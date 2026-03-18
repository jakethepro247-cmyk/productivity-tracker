'use client'

import { useTransition } from 'react'
import { Check, Trash2, Circle } from 'lucide-react'
import { toggleTaskComplete, deleteTask } from '@/app/dashboard/actions'

type Task = {
  id: string
  title: string
  completed: boolean
  created_at: string
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

  const handleToggle = () => {
    startCompleteTransition(() => {
      toggleTaskComplete(task.id, task.completed)
    })
  }

  const handleDelete = () => {
    startDeleteTransition(() => {
      deleteTask(task.id)
    })
  }

  const isPending = isPendingComplete || isPendingDelete

  return (
    <li
      className={`group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 transition-all sm:p-4 ${
        isPending ? 'opacity-50' : 'opacity-100 hover:border-zinc-700 hover:bg-zinc-900'
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
            task.completed
              ? 'border-indigo-500 bg-indigo-500 text-white'
              : 'border-zinc-600 text-transparent hover:border-indigo-400'
          }`}
        >
          {task.completed ? <Check className="h-4 w-4" /> : null}
        </button>
        <span
          className={`truncate text-sm sm:text-base transition-all ${
            task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'
          }`}
        >
          {task.title}
        </span>
      </div>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-zinc-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950 group-hover:opacity-100"
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  )
}
