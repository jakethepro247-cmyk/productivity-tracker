import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getTasks } from '../actions'
import CalendarView from '@/components/CalendarView'

export default async function CalendarPage() {
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
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Calendar</h1>
        <p className="text-sm text-zinc-400">
          Visualize your deadlines and plan your schedule ahead.
        </p>
      </header>

      <main>
        <CalendarView tasks={tasks || []} />
      </main>
    </div>
  )
}
