import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Test basic connection
    const { data: subjects, error } = await supabase
      .from('subjects')
      .select('count')

    if (error) {
      return NextResponse.json({ 
        status: 'error', 
        message: error.message,
        code: error.code 
      })
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase connected!',
      subjects_count: subjects?.length || 0
    })

  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: (error as Error).message 
    })
  }
}