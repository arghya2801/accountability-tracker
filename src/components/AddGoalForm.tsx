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

        // const user_id = 'a8f426c8-29e8-4855-9d9f-e9ef398fc26a' // Use supabase.auth.getUser() if using Auth
        // const user_id = supabase.auth.getUser()

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            alert('User not authenticated.')
            setLoading(false)
            return
        }

        const user_id = user.id

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
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 max-w-md bg-white shadow-lg rounded-xl p-8"
        >
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Add New Goal</h2>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Goal Title</label>
                <input
                    required
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Enter your goal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    placeholder="Describe your goal (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Target Date</label>
                <input
                    type="date"
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                />
            </div>
            <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50"
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>
                        Adding...
                    </span>
                ) : (
                    'Add Goal'
                )}
            </button>
        </form>
    )
}
