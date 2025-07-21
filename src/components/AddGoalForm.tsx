'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AddGoalForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // ⚠️ Hard-coded user_id for dev/testing
    const user_id = 'replace-with-your-user-id' // Use supabase.auth.getUser() if using Auth

    const { error } = await supabase.from('goals').insert([
      {
        title,
        description,
        target_date: targetDate,
        user_id,
      },
    ])

    if (error) {
      alert('Failed to add goal: ' + error.message)
    } else {
      setTitle('')
      setDescription('')
      setTargetDate('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <input
        required
        className="border p-2 rounded"
        placeholder="Goal title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 rounded"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        className="border p-2 rounded"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Goal'}
      </button>
    </form>
  )
}
