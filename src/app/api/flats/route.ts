import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { building_id, flat_number, size_sqft, price } = body

    if (!building_id || !flat_number || !size_sqft || !price) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('flats')
      .insert({
        building_id,
        flat_number: flat_number.trim(),
        size_sqft: parseFloat(size_sqft),
        price: parseFloat(price),
        status: 'Available',
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Flat number already exists in this building' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
