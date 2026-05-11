const { createClient } = require('@supabase/supabase-js')

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createAdmin() {
  const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
  const existingUser = usersData?.users.find(u => u.email === 'labhanshusahu.20@gmail.com')

  let userId;

  if (existingUser) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
      password: 'LoveGendu@000',
      user_metadata: { role: 'admin', full_name: 'Labhanshu Sahu' }
    })
    if (error) return console.error(error.message)
    userId = existingUser.id
    console.log("Updated existing user password and role!")
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'labhanshusahu.20@gmail.com',
      password: 'LoveGendu@000',
      email_confirm: true,
      user_metadata: { role: 'admin', full_name: 'Labhanshu Sahu' }
    })
    if (error) return console.error(error.message)
    userId = data.user.id
    console.log("Created new admin user!")
  }

  // Add to user_profiles
  const { error: profileError } = await supabaseAdmin.from('user_profiles').upsert({
    id: userId,
    role: 'admin',
    business_name: 'ThokWale Super Admin',
    loyalty_points: 0
  })

  if (profileError) {
    console.error('Error creating profile:', profileError.message)
  } else {
    console.log('Profile setup complete!')
  }
}

createAdmin()
