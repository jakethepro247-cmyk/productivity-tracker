'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { Check, Trash2, Play, Pause, Square, ChevronDown, ChevronUp, Clock, FileText, Calendar as CalendarIcon } from 'lucide-react'
import { toggleTaskComplete, deleteTask, updateTask, updateTimerState } from '@/app/dashboard/actions'

import type { Task } from '@/types'

export type { Task }

export default function TaskList({ tasks }: { tasks: Task[] }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-12 text-zinc-500">
        <p>No tasks yet. Create one above to get started.</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

function TaskItem({ task }: { task: Task }) {
  const [isPendingComplete, startCompleteTransition] = useTransition()
  const [isPendingDelete, startDeleteTransition] = useTransition()
  const [isPendingTimer, startTimerTransition] = useTransition()
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatForInput = (dateStr: string | null | undefined) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - (offset * 60 * 1000))
    return localDate.toISOString().slice(0, 16)
  }

  // Helper to get total elapsed time including currently running duration
  const getElapsed = useCallback(() => {
    let base = task.duration_seconds || 0
    if (task.timer_started_at) {
      const start = new Date(task.timer_started_at).getTime()
      const now = new Date().getTime()
      base += Math.floor((now - start) / 1000)
    }
    return base
  }, [task.duration_seconds, task.timer_started_at])

  // Timer and Form state
  // We derive isRunning directly from the prop to ensure it stays in sync with the server
  const isRunning = !!task.timer_started_at
  const [elapsed, setElapsed] = useState(getElapsed())
  const [description, setDescription] = useState(task.description || '')
  const [dueDate, setDueDate] = useState(formatForInput(task.due_date))

  // Sync internal state with props when they change
  useEffect(() => {
    setElapsed(getElapsed())
    setDescription(task.description || '')
    setDueDate(formatForInput(task.due_date))
  }, [task.duration_seconds, task.description, task.due_date, task.timer_started_at, getElapsed])

  // Real-time tick
  useEffect(() => {
    let interval: any
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed(getElapsed())
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, getElapsed])

  const handleToggle = () => {
    startCompleteTransition(() => {
      toggleTaskComplete(task.id, task.completed)
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      startDeleteTransition(() => {
        deleteTask(task.id)
      })
    }
  }

  const handleTimerToggle = () => {
    startTimerTransition(() => {
      if (isRunning) {
        // Pause: Save calculated duration and clear start time (no page reload)
        updateTimerState(task.id, { 
          duration_seconds: elapsed,
          timer_started_at: null 
        })
      } else {
        // Start: Set start time to now (no page reload)
        updateTimerState(task.id, { 
          timer_started_at: new Date().toISOString() 
        })
      }
    })
  }

  const handleTimerReset = () => {
    startTimerTransition(() => {
      setElapsed(0)
      updateTimerState(task.id, { 
        duration_seconds: 0,
        timer_started_at: null 
      })
    })
  }

  const handleDescriptionBlur = () => {
    if (description !== task.description) {
      updateTask(task.id, { description })
    }
  }

  const handleDateChange = (newDate: string) => {
    setDueDate(newDate)
    updateTask(task.id, { due_date: newDate ? new Date(newDate).toISOString() : null })
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return [h, m, s].map(v => v < 10 ? "0" + v : v).join(":")
  }

  const isPending = isPendingComplete || isPendingDelete

  return (
    <li
      className={`group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all ${
        isPending ? 'opacity-50' : 'opacity-100 hover:border-zinc-700 hover:bg-zinc-900'
      }`}
    >
      {/* Main Task Row */}
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
              task.completed
                ? 'border-red-500 bg-red-500 text-white'
                : 'border-zinc-600 text-transparent hover:border-red-400'
            }`}
          >
            {task.completed ? <Check className="h-4 w-4" /> : null}
          </button>
          
          <div className="flex flex-col min-w-0 flex-1">
            <span
              className={`truncate text-sm sm:text-base font-medium transition-all ${
                task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'
              }`}
            >
              {task.title}
            </span>
            {elapsed > 0 && (
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {formatTime(elapsed)} Spent
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 transition-colors ${isExpanded ? 'bg-zinc-800 text-zinc-200' : ''}`}
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Dropdown Content */}
      {isExpanded && (
        <div className="border-t border-zinc-800 p-4 pt-2 flex flex-col gap-4 bg-zinc-900/30 rounded-b-xl animate-in slide-in-from-top-1 duration-200">
          {/* Timer Section */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Time Tracker
            </label>
            <div className="flex items-center justify-between bg-zinc-950/50 rounded-lg p-3 border border-zinc-800">
              <span className={`text-xl font-mono tabular-nums ${isRunning ? 'text-red-400 animate-pulse' : 'text-zinc-300'}`}>
                {formatTime(elapsed)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleTimerToggle}
                  disabled={isPendingTimer}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    isPendingTimer ? 'opacity-50 cursor-wait' : ''
                  } ${
                    isRunning 
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                    : 'bg-red-500 text-white hover:bg-red-400 shadow-sm shadow-red-500/20'
                  }`}
                >
                  {isPendingTimer ? '...' : (isRunning ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Start</>)}
                </button>
                <button
                  onClick={handleTimerReset}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold bg-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition-all"
                >
                  <Square className="h-3 w-3 fill-current" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
              <FileText className="h-3 w-3" />
              Additional Information
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              placeholder="Add more details about this task..."
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 min-h-[80px] transition-all resize-none"
            />
          </div>

          {/* Deadline Section */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
              <CalendarIcon className="h-3 w-3" />
              Deadline & Time
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 transition-all [color-scheme:dark]"
            />
          </div>
        </div>
      )}
    </li>
  )
}
