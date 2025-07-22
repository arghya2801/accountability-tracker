'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AddGoalForm() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [targetDate, setTargetDate] = useState(() => {
        const today = new Date()
        const yyyy = today.getFullYear()
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const dd = String(today.getDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
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
    const [showForm, setShowForm] = useState(false)

    return (
        <div>
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white mx-4 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
                >
                    Add New Goal
                </button>
            )}
            {showForm && (
                <div className="flex p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6 w-full max-w-6xl bg-white shadow-lg rounded-xl p-8 dark:bg-gray-900 dark:shadow-gray-800"
                    >
                        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Add New Goal</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Goal Title</label>
                                <input
                                    required
                                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400"
                                    placeholder="Enter your goal"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400"
                                    placeholder="Describe your goal (optional)"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Date</label>
                                <input
                                    type="date"
                                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400"
                                    value={targetDate}
                                    onChange={(e) => setTargetDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50 dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 dark:text-white"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white dark:text-white" viewBox="0 0 24 24">
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
                            <button
                                type="button"
                                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-400 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                onClick={() => setShowForm(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
