import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin-shell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <AdminShell>
      {children}
    </AdminShell>
  )
}
