import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getTasks } from '../actions'
import StatsView from '@/components/StatsView'

export default async function StatsPage() {
  const supabase = await createClient()

  // Protect the route
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch initial tasks
  const tasks = await getTasks()

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-12">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Stats</h1>
        <p className="text-sm text-zinc-400">
          Your productivity at a glance.
        </p>
      </header>

      <main>
        <StatsView tasks={tasks || []} />
      </main>
    </div>
  )
}
