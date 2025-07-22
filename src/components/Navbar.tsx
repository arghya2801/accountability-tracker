'use client'
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import DarkModeSwitch from './DarkModeSwitch'

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data?.session?.user ?? null)
        })
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })
        return () => {
            listener?.subscription.unsubscribe()
        }
    }, [])

    const handleLogin = () => {
        window.location.href = '/login'
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between shadow-lg dark:shadow-[0_4px_24px_0_rgba(0,0,0,0.5)]">
            <div className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Accountability App
            </div>
            <div className="flex items-center gap-4">
            {!user ? (
                <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                >
                Login
                </button>
            ) : (
                <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded hover:bg-gray-900 dark:hover:bg-gray-800 transition"
                >
                Logout
                </button>
            )}
            <DarkModeSwitch />
            </div>
        </nav>
    )
}