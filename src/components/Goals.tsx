import { supabase } from '../../lib/supabaseClient'
import { useEffect, useState } from 'react'

type Goal = {
  id: number
  title: string
  status: string
  description: string
}

function GoalsList() {
  const [goals, setGoals] = useState<Goal[]>([])
  useEffect(() => {
    supabase
      .from('goals')
      .select('*')
      .then(({ data }: { data: Goal[] | null }) => setGoals(data || []))
  }, [])

  return (
    <ul>
      {goals.map(goal => (
        <li key={goal.id}>
          <b>{goal.title}</b> ({goal.status}) <br/>
          {goal.description}
        </li>
      ))}
    </ul>
  )
}

export default GoalsList