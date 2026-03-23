import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/login/actions'
import { getTasks, addTask } from './actions'
import TaskList from '@/components/TaskList'
import ProgressBar from '@/components/ProgressBar'
import { LogOut, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Protect the route
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch initial tasks Server Side
  const tasks = await getTasks()

  return (
    <div className="mx-auto max-w-2xl p-4 pt-12 sm:p-8 sm:pt-20">
      <header className="mb-12 flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
          <p className="text-sm text-zinc-400">
            Welcome back, {user.email?.split('@')[0]}
          </p>
        </div>
        
        <form action={signout}>
          <button 
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </header>

      <main>
        <ProgressBar tasks={tasks || []} />

        <div className="mb-8">
          <form action={addTask} className="flex flex-col sm:flex-row gap-3 relative">
            <input
              type="text"
              name="title"
              placeholder="What needs to be done?"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-base text-white placeholder-zinc-500 shadow-sm focus:border-red-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all sm:w-auto w-full"
            >
              <Plus className="h-5 w-5" />
              Add Task
            </button>
          </form>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Your Tasks</h2>
            <span className="text-sm font-medium text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-full">
              {tasks?.length || 0} Total
            </span>
          </div>
          <TaskList tasks={tasks || []} />
        </section>
      </main>
    </div>
  )
}
