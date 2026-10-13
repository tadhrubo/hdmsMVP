import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // ── Extract fields ─────────────────────────────────────────
    const client_id    = formData.get('client_id') as string
    const flat_id      = formData.get('flat_id') as string
    const total_price  = parseFloat(formData.get('total_price') as string)
    const agreement_date = formData.get('agreement_date') as string
    const down_payment = parseFloat(formData.get('down_payment') as string)
    const method       = formData.get('method') as string
    const pdfFile      = formData.get('pdf') as File | null

    // ── Validate ───────────────────────────────────────────────
    if (!client_id || !flat_id || !agreement_date || isNaN(total_price)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (isNaN(down_payment) || down_payment < 0) {
      return NextResponse.json({ error: 'Down payment must be a non-negative number' }, { status: 400 })
    }
    if (!['Cash', 'Bank', 'Cheque'].includes(method)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    const supabase = await createClient()

    // ── Step 1: Verify flat is still Available ─────────────────
    const { data: flat, error: flatErr } = await supabase
      .from('flats')
      .select('status')
      .eq('id', flat_id)
      .single()

    if (flatErr || !flat) {
      return NextResponse.json({ error: 'Flat not found' }, { status: 404 })
    }
    if (flat.status !== 'Available') {
      return NextResponse.json({ error: 'Flat is no longer available' }, { status: 409 })
    }

    // ── Step 2: Upload PDF to Supabase Storage ─────────────────
    let pdf_url: string | null = null
    if (pdfFile && pdfFile.size > 0) {
      const bytes = await pdfFile.arrayBuffer()
      const fileBuffer = new Uint8Array(bytes)
      const fileName = `${flat_id}-${Date.now()}.pdf`

      const { error: uploadErr } = await supabase.storage
        .from('agreements')
        .upload(fileName, fileBuffer, {
          contentType: 'application/pdf',
          upsert: false,
        })

      if (uploadErr) {
        return NextResponse.json({ error: `PDF upload failed: ${uploadErr.message}` }, { status: 500 })
      }

      const { data: urlData } = supabase.storage
        .from('agreements')
        .getPublicUrl(fileName)

      pdf_url = urlData.publicUrl
    }

    // ── Step 3: Insert booking ─────────────────────────────────
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .insert({ client_id, flat_id, total_price, agreement_date, pdf_url })
      .select()
      .single()

    if (bookingErr) {
      // If booking already exists for this flat
      if (bookingErr.code === '23505') {
        return NextResponse.json({ error: 'A booking already exists for this flat' }, { status: 409 })
      }
      return NextResponse.json({ error: bookingErr.message }, { status: 500 })
    }

    // ── Step 4: Insert initial payment ────────────────────────
    if (down_payment > 0) {
      const { error: payErr } = await supabase
        .from('payments')
        .insert({
          booking_id: booking.id,
          amount: down_payment,
          payment_date: agreement_date,
          method,
        })

      if (payErr) {
        // Non-fatal: booking is created, log but don't fail
        console.error('Payment insert failed:', payErr.message)
      }
    }

    // ── Step 5: Update flat status → Sold ─────────────────────
    const { error: updateErr } = await supabase
      .from('flats')
      .update({ status: 'Sold' })
      .eq('id', flat_id)

    if (updateErr) {
      return NextResponse.json({ error: `Failed to update flat status: ${updateErr.message}` }, { status: 500 })
    }

    return NextResponse.json({ booking_id: booking.id, pdf_url }, { status: 201 })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      agreement_date,
      total_price,
      pdf_url,
      created_at,
      clients ( id, full_name, phone ),
      flats (
        id,
        flat_number,
        buildings (
          id,
          name,
          projects ( id, name, code )
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
