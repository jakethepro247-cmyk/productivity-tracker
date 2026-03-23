'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CheckSquare, Calendar as CalendarIcon, LogOut } from 'lucide-react'
import { signout } from '@/app/login/actions'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Tasks', href: '/dashboard', icon: CheckSquare },
    { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
  ]

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-zinc-800 bg-zinc-900/20 p-6 lg:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white shadow-lg shadow-red-500/20">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Rekt</span>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-red-500/10 text-red-500 shadow-sm'
                    : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <form action={signout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 transition-all hover:bg-zinc-900 hover:text-zinc-200"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        {/* Mobile Nav Banner */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-red-500" />
            <span className="font-bold">Rekt</span>
          </div>
          <nav className="flex gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium ${isActive ? 'text-red-500' : 'text-zinc-500'}`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
