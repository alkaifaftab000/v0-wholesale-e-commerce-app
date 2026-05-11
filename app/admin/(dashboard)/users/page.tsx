import { createClient } from "@supabase/supabase-js"
import AdminUsersClient from "./AdminUsersClient"

export default async function AdminUsersPage() {
  // We use the service role key to get all users from the auth schema and join with profiles
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: authUsers, error: authErr } = await supabaseAdmin.auth.admin.listUsers()
  const { data: profiles, error: profileErr } = await supabaseAdmin.from('user_profiles').select('*')

  const usersList = authUsers?.users.map(u => {
    const profile = profiles?.find(p => p.id === u.id)
    return {
      id: u.id,
      email: u.email,
      name: u.user_metadata?.full_name || u.user_metadata?.name || "Unknown",
      role: profile?.role || "basic",
      businessName: profile?.business_name || "N/A",
      createdAt: new Date(u.created_at).toLocaleDateString()
    }
  }) || []

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users & Roles</h1>
        <p className="text-gray-500">Manage all registered accounts, view details, and control access levels.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <AdminUsersClient initialUsers={usersList} />
      </div>
    </div>
  )
}
