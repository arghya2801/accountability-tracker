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

export default function GoalsTable({ userId }: { userId: string }) {
    const [goals, setGoals] = useState<Goal[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Partial<Goal>>({})
    const [showCompleted, setShowCompleted] = useState(false)

    const fetchGoals = async () => {
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('target_date', { ascending: true })

        if (error) {
            console.error('Error fetching goals:', error)
        } else {
            setGoals(
                (data as Goal[]).filter(goal => typeof goal.id === 'string' && goal.id.length === 36)
            )
        }
    }

    const filteredGoals = goals.filter(goal =>
        showCompleted ? goal.status === 'complete' : goal.status !== 'complete'
    )

    const updateGoalStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('goals')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            console.error('Error updating status:', error)
        } else {
            fetchGoals()
        }
    }

    const deleteGoal = async (id: string) => {
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting goal:', error)
        } else {
            fetchGoals()
        }
    }

    const startEdit = (goal: Goal) => {
        setEditingId(goal.id)
        setEditForm({
            title: goal.title,
            description: goal.description,
            target_date: goal.target_date ?? '',
            status: goal.status,
        })
    }

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: value }))
    }

    const saveEdit = async (id: string) => {
        const { error } = await supabase
            .from('goals')
            .update({
                title: editForm.title,
                description: editForm.description,
                target_date: editForm.target_date,
                status: editForm.status,
            })
            .eq('id', id)

        if (error) {
            console.error('Error updating goal:', error)
        } else {
            setEditingId(null)
            setEditForm({})
            fetchGoals()
        }
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm({})
    }

    useEffect(() => {
        fetchGoals()

        // Create a unique channel name to avoid conflicts
        const channelName = `goals-changes-${userId}-${Date.now()}`

        const channel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'goals',
                    filter: `user_id=eq.${userId}` // Only listen to changes for this user
                },
                (payload) => {
                    console.log('Real-time update received:', payload)
                    fetchGoals()
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status)
            })

        return () => {
            console.log('Cleaning up subscription')
            supabase.removeChannel(channel)
        }
    }, [userId]) // Add userId as dependency


    return (
        <div className="w-full p-4">
            <div className="flex mb-4 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setShowCompleted(false)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!showCompleted
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Pending ({goals.filter(g => g.status !== 'complete').length})
                </button>
                <button
                    onClick={() => setShowCompleted(true)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${showCompleted
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Completed ({goals.filter(g => g.status === 'complete').length})
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Target Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredGoals.map((goal) => {
                            const isEditing = editingId === goal.id
                            return (
                                <tr key={goal.id} className={isEditing ? '' : 'align-middle'}>
                                    {isEditing ? (
                                        <>
                                            <td className="px-4 py-2 border-t border-gray-200 align-top">
                                                <input
                                                    name="title"
                                                    value={editForm.title ?? ''}
                                                    onChange={handleEditChange}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border-t border-gray-200 align-top">
                                                <textarea
                                                    name="description"
                                                    value={editForm.description ?? ''}
                                                    onChange={handleEditChange}
                                                    className="border rounded px-2 py-1 w-full resize-none"
                                                    rows={3}
                                                />
                                            </td>
                                            <td className="px-4 py-2 border-t border-gray-200 align-top">
                                                <input
                                                    name="target_date"
                                                    type="date"
                                                    value={
                                                        editForm.target_date
                                                            ? new Date(editForm.target_date).toISOString().slice(0, 10)
                                                            : ''
                                                    }
                                                    onChange={handleEditChange}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border-t border-gray-200 align-top">
                                                <select
                                                    name="status"
                                                    value={editForm.status ?? 'pending'}
                                                    onChange={handleEditChange}
                                                    className="border rounded px-2 py-1 w-full"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="complete">Complete</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-2 border-t border-gray-200 align-top">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-2 py-1 bg-blue-500 text-white rounded"
                                                        onClick={() => saveEdit(goal.id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="px-2 py-1 bg-gray-400 text-white rounded"
                                                        onClick={cancelEdit}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-2 border-t border-gray-200 align-middle">{goal.title}</td>
                                            <td className="px-4 py-2 border-t border-gray-200 align-middle truncate max-w-xs" title={goal.description || '-'}>
                                                <span className="block whitespace-normal break-words">
                                                    {goal.description || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border-t border-gray-200 align-middle">
                                                {goal.target_date
                                                    ? (() => {
                                                        const date = new Date(goal.target_date)
                                                        const day = date.getDate()
                                                        const daySuffix =
                                                            day === 1 || day === 21 || day === 31
                                                                ? 'st'
                                                                : day === 2 || day === 22
                                                                    ? 'nd'
                                                                    : day === 3 || day === 23
                                                                        ? 'rd'
                                                                        : 'th'
                                                        const month = date.toLocaleString('default', { month: 'long' })
                                                        const year = date.getFullYear()
                                                        return `${day}${daySuffix} ${month} ${year}`
                                                    })()
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-2 border-t border-gray-200 align-middle">
                                                {goal.status === 'pending' ? (
                                                    <button
                                                        className="px-2 py-1 bg-green-500 text-white rounded"
                                                        onClick={() => updateGoalStatus(goal.id, 'complete')}
                                                    >
                                                        Mark Complete
                                                    </button>
                                                ) : (
                                                    <span className="text-green-700 font-semibold">Complete</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 border-t border-gray-200 align-middle">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="p-1 rounded hover:bg-blue-100 text-blue-600 transition"
                                                        title="Edit"
                                                        onClick={() => startEdit(goal)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="p-1 rounded hover:bg-red-100 text-red-600 transition"
                                                        title="Delete"
                                                        onClick={() => deleteGoal(goal.id)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
