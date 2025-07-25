import SubscriptionPage from '@/components/subscription/SubscriptionPage'
import { getUser, getUserProfile } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Subscription() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getUserProfile(user.id)
  
  if (!profile) {
    redirect('/auth/login')
  }

  return <SubscriptionPage user={profile} />
}