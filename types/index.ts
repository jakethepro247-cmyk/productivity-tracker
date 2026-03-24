export type Task = {
  id: string
  title: string
  completed: boolean
  created_at: string
  description?: string | null
  duration_seconds?: number | null
  due_date?: string | null
  timer_started_at?: string | null
}
