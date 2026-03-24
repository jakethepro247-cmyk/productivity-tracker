'use client'

import { useState, useMemo } from 'react'
import type { Task } from '@/types'

type FilterType = 'Today' | 'Week' | 'Month' | 'All'

export default function StatsView({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<FilterType>('Week')

  // Filter tasks based on selected period and if they have duration
  const filteredTasks = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // Sunday
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return tasks.filter(task => {
      // Only include tasks with recorded time
      if (!task.duration_seconds || task.duration_seconds <= 0) return false

      const taskDate = new Date(task.created_at) // Or due_date if preferred
      switch (filter) {
        case 'Today':
          return taskDate >= today
        case 'Week':
          return taskDate >= startOfWeek
        case 'Month':
          return taskDate >= startOfMonth
        case 'All':
        default:
          return true
      }
    })
  }, [tasks, filter])

  // Top Level Metrics
  const totalSeconds = filteredTasks.reduce((sum, task) => sum + (task.duration_seconds || 0), 0)
  const totalHours = (totalSeconds / 3600).toFixed(1)
  const totalMinutes = Math.floor(totalSeconds / 60)
  
  const sessions = filteredTasks.length
  
  const avgSessionSeconds = sessions > 0 ? totalSeconds / sessions : 0
  const avgSessionMinutes = Math.floor(avgSessionSeconds / 60)

  // Day of Week calculation
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const timeByDay = [0, 0, 0, 0, 0, 0, 0] // 0 = Sunday

  filteredTasks.forEach(task => {
    const day = new Date(task.created_at).getDay()
    timeByDay[day] += (task.duration_seconds || 0)
  })

  const maxDayTime = Math.max(...timeByDay, 1) // prevent division by zero
  const mostProductiveDayIndex = timeByDay.indexOf(Math.max(...timeByDay))
  const mostProductiveDayStr = totalSeconds > 0 ? daysOfWeek[mostProductiveDayIndex] : '-'

  // Top Tasks
  const topTasks = [...filteredTasks]
    .sort((a, b) => (b.duration_seconds || 0) - (a.duration_seconds || 0))
    .slice(0, 5)

  // Formatting helper
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hrs > 0) return `${hrs}h ${mins}m`
    return `${mins}m`
  }

  return (
    <div className="flex flex-col gap-6 w-full text-white">
      {/* Top Bar with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">Overview</h2>
        </div>
        
        <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
          {(['Today', 'Week', 'Month', 'All'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f 
                ? 'bg-red-500 text-white shadow-sm shadow-red-500/20' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Time */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Total Time</p>
          <div>
            <p className="text-3xl font-bold text-white mb-1">{totalMinutes}m</p>
            <p className="text-xs text-zinc-500">{totalHours} hours</p>
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Sessions</p>
          <div>
            <p className="text-3xl font-bold text-white mb-1">{sessions}</p>
            <p className="text-xs text-zinc-500">tasks worked on</p>
          </div>
        </div>

        {/* Avg Session */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Avg Session</p>
          <div>
            <p className="text-3xl font-bold text-white mb-1">{avgSessionMinutes}m</p>
            <p className="text-xs text-zinc-500">per task</p>
          </div>
        </div>

        {/* Most Productive */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Most Productive</p>
          <div>
            <p className="text-3xl font-bold text-white mb-1">{mostProductiveDayStr}</p>
            <p className="text-xs text-zinc-500">{totalSeconds > 0 ? formatTime(timeByDay[mostProductiveDayIndex]) : '0m'}</p>
          </div>
        </div>
      </div>

      {/* Top Tasks List */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-6">Top Tasks by Time Spent</h3>
        {topTasks.length > 0 ? (
          <div className="flex flex-col gap-4">
            {topTasks.map((task, index) => (
              <div key={task.id} className="flex justify-between items-center bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xs font-bold text-zinc-600 bg-zinc-950 w-6 h-6 flex items-center justify-center rounded-full">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium truncate">{task.title}</span>
                </div>
                <span className="text-sm font-bold text-red-400 whitespace-nowrap">
                  {formatTime(task.duration_seconds || 0)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center border-2 border-dashed border-zinc-800 rounded-xl">
            <p className="text-sm text-zinc-500">No task data for this period.</p>
          </div>
        )}
      </div>

      {/* Bar Chart: By Day of Week */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
        <h3 className="text-sm font-bold text-white mb-8">By Day of Week</h3>
        
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4">
          {daysOfWeek.map((day, i) => {
            const time = timeByDay[i]
            const heightPercentage = Math.max((time / maxDayTime) * 100, time > 0 ? 5 : 0) // minimum 5% height if > 0
            
            return (
              <div key={day} className="flex flex-col items-center flex-1 group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-bold text-white bg-zinc-800 px-2 py-1 rounded-md mb-2 pointer-events-none">
                  {formatTime(time)}
                </div>
                
                {/* Bar */}
                <div className="w-full max-w-[40px] bg-zinc-800 rounded-t-md relative overflow-hidden h-32 flex items-end justify-center transition-all group-hover:bg-zinc-700">
                  <div 
                    className="w-full bg-red-500 transition-all duration-1000 ease-out"
                    style={{ height: `${heightPercentage}%`, opacity: time > 0 ? 1 : 0.1 }}
                  />
                </div>
                
                {/* Label */}
                <span className="text-xs font-medium text-zinc-500 mt-4 uppercase tracking-widest">{day}</span>
              </div>
            )
          })}
        </div>
      </div>
      
    </div>
  )
}
