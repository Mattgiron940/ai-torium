import OutreachDashboard from '@/components/admin/OutreachDashboard'
import { getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminOutreachPage() {
  const user = await getUser()
  
  // In production, implement proper admin role checking
  if (!user || !user.email?.includes('admin')) {
    redirect('/dashboard')
  }

  return <OutreachDashboard />
}