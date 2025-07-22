'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Goal = {
  id: string
  title: string
  description: string
  target_date: string | null
  status: string
}

export default function GoalsTable() {
  const [goals, setGoals] = useState<Goal[]>([])

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('target_date', { ascending: true })

    if (error) {
      console.error('Error fetching goals:', error)
    } else {
      setGoals(data as Goal[])
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Title</th>
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Target Date</th>
            <th className="border p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal) => (
            <tr key={goal.id}>
              <td className="border p-2">{goal.title}</td>
              <td className="border p-2">{goal.description || '-'}</td>
              <td className="border p-2">
                {goal.target_date ? new Date(goal.target_date).toLocaleDateString() : '-'}
              </td>
              <td className="border p-2">{goal.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
