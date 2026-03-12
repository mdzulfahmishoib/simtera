'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function createAdminUser(formData: FormData) {
  const supabase = await createClient()
  
  // Verify admin status
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Use the admin API to bypass RLS and create a user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    return { error: error.message }
  }

  // Insert into profiles table
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: data.user.id,
      role: 'admin'
    })

  if (profileError) {
    // Attempt rollback if profile creation fails
    await supabaseAdmin.auth.admin.deleteUser(data.user.id)
    return { error: 'Failed to create admin profile: ' + profileError.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteAdminUser(userId: string) {
  const supabase = await createClient()
  
  // Verify current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id === userId) return

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabaseAdmin.auth.admin.deleteUser(userId)
  revalidatePath('/admin/users')
}

export async function resetAdminPassword(formData: FormData) {
  const supabase = await createClient()
  
  // Verify admin status
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const userId = formData.get('userId') as string
  const password = formData.get('password') as string

  if (!userId || !password) {
    return { error: "Missing fields" }
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: password
  })

  if (error) {
     return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
