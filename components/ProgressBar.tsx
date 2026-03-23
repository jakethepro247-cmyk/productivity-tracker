'use client'

type Task = {
  id: string
  completed: boolean
}

export default function ProgressBar({ tasks }: { tasks: Task[] }) {
  const total = tasks?.length || 0
  const completed = tasks?.filter((t) => t.completed).length || 0
  
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="flex flex-col gap-2 w-full mb-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-sm font-medium text-zinc-400">Daily Progress</h2>
          <p className="text-2xl font-bold text-white mt-1">
            {completed} <span className="text-zinc-500 text-lg font-medium">/ {total} tasks</span>
          </p>
        </div>
        <span className="text-sm font-bold text-red-400">{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div 
          className="h-full bg-red-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
