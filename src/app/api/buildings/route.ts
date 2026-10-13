import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { project_id, name, total_floors } = body

    if (!project_id || !name || !total_floors) {
      return NextResponse.json({ error: 'project_id, name, and total_floors are required' }, { status: 400 })
    }

    const floors = parseInt(total_floors, 10)
    if (isNaN(floors) || floors < 1) {
      return NextResponse.json({ error: 'total_floors must be a positive integer' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('buildings')
      .insert({ project_id, name, total_floors: floors })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
