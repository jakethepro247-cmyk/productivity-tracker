'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTasks() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tasks:', error)
    return []
  }

  return data
}

export async function addTask(formData: FormData) {
  const title = formData.get('title') as string
  if (!title) return

  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.from('tasks').insert({
    title,
    user_id: user.id
  })

  if (error) {
    console.error('Error adding task:', error)
  }

  revalidatePath('/dashboard')
}

export async function toggleTaskComplete(id: string, currentStatus: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tasks')
    .update({ completed: !currentStatus })
    .match({ id })

  if (error) {
    console.error('Error toggling task:', error)
  }

  revalidatePath('/dashboard')
}

export async function deleteTask(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('tasks').delete().match({ id })

  if (error) {
    console.error('Error deleting task:', error)
  }

  revalidatePath('/dashboard')
}

export async function updateTask(id: string, updates: { description?: string, duration_seconds?: number }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .match({ id })

  if (error) {
    console.error('Error updating task:', error)
  }

  revalidatePath('/dashboard')
}
