import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const project_id = formData.get('project_id') as string
    const full_name = (formData.get('full_name') as string)?.trim()
    const phone = (formData.get('phone') as string)?.trim()
    const file = formData.get('file') as File | null

    if (!project_id || !full_name || !phone) {
      return NextResponse.json(
        { error: 'Project, Full Name, and Phone are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    let agreement_file_url: string | null = null

    if (file && file.size > 0) {
      // Validate allowed file types: PDF, PNG, JPEG/JPG
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Only PDF documents and JPG/PNG/WebP images are supported.' },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const fileBuffer = new Uint8Array(bytes)
      const extension = file.name.split('.').pop() || (file.type.includes('pdf') ? 'pdf' : 'jpg')
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `loa-${project_id}-${Date.now()}-${sanitizedName}`

      const { error: uploadErr } = await supabase.storage
        .from('land_owner_agreements')
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadErr) {
        return NextResponse.json(
          { error: `Agreement file upload failed: ${uploadErr.message}` },
          { status: 500 }
        )
      }

      const { data: urlData } = supabase.storage
        .from('land_owner_agreements')
        .getPublicUrl(fileName)

      agreement_file_url = urlData.publicUrl
    }

    const { data: landOwner, error: insertErr } = await supabase
      .from('land_owners')
      .insert({
        project_id,
        full_name,
        phone,
        agreement_file_url,
      })
      .select()
      .single()

    if (insertErr) {
      return NextResponse.json(
        { error: `Database insert failed: ${insertErr.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: landOwner }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
