import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { userId, role } = await req.json()

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing userId or role" }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Update Auth Metadata
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    })
    if (authError) throw authError

    // 2. Update User Profile
    const { error: profileError } = await supabaseAdmin.from('user_profiles').update({ role }).eq('id', userId)
    if (profileError) throw profileError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
