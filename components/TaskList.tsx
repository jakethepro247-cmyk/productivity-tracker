'use client'

import { useState, useEffect, useTransition } from 'react'
import { Check, Trash2, Play, Pause, Square, ChevronDown, ChevronUp, Clock, FileText } from 'lucide-react'
import { toggleTaskComplete, deleteTask, updateTask } from '@/app/dashboard/actions'

export type Task = {
  id: string
  title: string
  completed: boolean
  created_at: string
  description?: string | null
  duration_seconds?: number | null
}

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
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Timer state
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(task.duration_seconds || 0)
  const [description, setDescription] = useState(task.description || '')

  useEffect(() => {
    let interval: any
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

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
    if (isRunning) {
      // Pause: Sync with DB
      updateTask(task.id, { duration_seconds: elapsed })
    }
    setIsRunning(!isRunning)
  }

  const handleTimerReset = () => {
    setIsRunning(false)
    setElapsed(0)
    updateTask(task.id, { duration_seconds: 0 })
  }

  const handleDescriptionBlur = () => {
    if (description !== task.description) {
      updateTask(task.id, { description })
    }
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    isRunning 
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                    : 'bg-red-500 text-white hover:bg-red-400 shadow-sm shadow-red-500/20'
                  }`}
                >
                  {isRunning ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Start</>}
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
        </div>
      )}
    </li>
  )
}
