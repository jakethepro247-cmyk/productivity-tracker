'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Task } from './TaskList'

export default function CalendarView({ tasks }: { tasks: Task[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Calendar logic
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1)
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  
  const totalSlots = 42 // 6 weeks
  const nextMonthDays = Array.from({ length: totalSlots - prevMonthDays.length - currentMonthDays.length }, (_, i) => i + 1)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))

  const getTasksForDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return []
    const dateStr = new Date(year, month, day).toISOString().split('T')[0]
    return tasks.filter(task => task.due_date && task.due_date.startsWith(dateStr))
  }

  const isToday = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-zinc-900/50 p-4 border border-zinc-800 rounded-2xl">
        <h2 className="text-lg font-semibold text-white">
          {monthNames[month]} <span className="text-zinc-500">{year}</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors border border-zinc-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors border border-zinc-800"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Day Labels */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-zinc-900/80 p-3 text-center text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
            {day}
          </div>
        ))}

        {/* Previous Month Days */}
        {prevMonthDays.map(day => (
          <div key={`prev-${day}`} className="bg-zinc-950/40 min-h-[120px] p-3 opacity-30">
            <span className="text-sm font-medium">{day}</span>
          </div>
        ))}

        {/* Current Month Days */}
        {currentMonthDays.map(day => {
          const dayTasks = getTasksForDate(day, true)
          const today = isToday(day, true)
          return (
            <div key={`curr-${day}`} className="bg-zinc-900/40 min-h-[120px] p-3 transition-colors hover:bg-zinc-900/60 relative group">
              <span className={`text-sm font-bold flex h-7 w-7 items-center justify-center rounded-full transition-all ${today ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                {day}
              </span>
              
              <div className="mt-2 flex flex-col gap-1.5 overflow-y-auto max-h-[80px] custom-scrollbar">
                {dayTasks.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || '')).map(task => {
                  const timeStr = task.due_date ? new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
                  return (
                    <div 
                      key={task.id} 
                      className={`text-[9px] p-1 rounded-md border border-l-2 flex flex-col gap-0.5 ${task.completed ? 'bg-zinc-800/50 border-zinc-700 text-zinc-500 line-through border-l-zinc-600' : 'bg-red-500/10 border-red-500/20 text-red-100 border-l-red-500'}`}
                      title={`${task.title} ${timeStr ? `- ${timeStr}` : ''}`}
                    >
                      {timeStr && <span className="font-bold opacity-70 flex items-center gap-1"><Clock className="h-2 w-2" />{timeStr}</span>}
                      <span className="truncate">{task.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Next Month Days */}
        {nextMonthDays.map(day => (
          <div key={`next-${day}`} className="bg-zinc-950/40 min-h-[120px] p-3 opacity-30">
            <span className="text-sm font-medium">{day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
