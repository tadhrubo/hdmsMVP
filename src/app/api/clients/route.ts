import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { full_name, phone, nid, email } = body

    if (!full_name || !phone) {
      return NextResponse.json({ error: 'Full name and phone are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('clients')
      .insert({ full_name: full_name.trim(), phone: phone.trim(), nid: nid?.trim() || null, email: email?.trim() || null })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('full_name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
