import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successful authentication, redirect to the 'next' path
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }
  }

  // If there's an error or no code, redirect to home page with an error parameter
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=Invalid_link`)
}
