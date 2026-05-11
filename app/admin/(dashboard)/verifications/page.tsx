import { createClient } from "@supabase/supabase-js"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, Store, FileText, Download } from "lucide-react"

export default async function AdminVerificationsPage() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: pendingProfiles } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('role', 'pending_retailer')

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Requests</h1>
        <p className="text-gray-500">Review and approve incoming B2B retailer applications.</p>
      </div>

      <div className="space-y-6">
        {(!pendingProfiles || pendingProfiles.length === 0) ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
            <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-4" />
            <p className="text-lg">All caught up! No pending verification requests.</p>
          </div>
        ) : (
          pendingProfiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0 flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-64 bg-gray-100 flex items-center justify-center p-6 relative">
                  {profile.shop_photo_url ? (
                    <img 
                      src={profile.shop_photo_url} 
                      alt="Shop Front" 
                      className="w-full h-48 object-cover rounded-xl shadow-sm border border-gray-200"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Store className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">No Photo Provided</p>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{profile.business_name}</h3>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                          <FileText className="w-4 h-4" /> GST: <span className="font-mono font-semibold text-gray-800">{profile.gst_number}</span>
                        </p>
                      </div>
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium uppercase mb-1">Primary Category</p>
                        <p className="font-semibold text-gray-900">{profile.primary_category || "Unspecified"}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium uppercase mb-1">Location</p>
                        <p className="font-semibold text-gray-900 truncate">{profile.location || "Unspecified"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                    <form className="flex-1" action={async () => {
                      "use server";
                      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
                      await supabase.from('user_profiles').update({ role: 'retailer' }).eq('id', profile.id);
                      await supabase.auth.admin.updateUserById(profile.id, { user_metadata: { role: 'retailer' } });
                    }}>
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Approve Retailer
                      </button>
                    </form>
                    <form className="flex-1" action={async () => {
                      "use server";
                      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
                      await supabase.from('user_profiles').update({ role: 'basic' }).eq('id', profile.id);
                      await supabase.auth.admin.updateUserById(profile.id, { user_metadata: { role: 'basic' } });
                    }}>
                      <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5" /> Reject Application
                      </button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
