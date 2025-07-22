import React, { useEffect, useState } from 'react'

export default function DarkModeSwitch() {
  const [dark, setDark] = useState(false) // Start with false to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved theme or default to light
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setDark(isDark)
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark, mounted])

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="px-3 py-2 rounded bg-gray-200 text-gray-800 w-24 h-10">
        {/* Placeholder to prevent layout shift */}
      </div>
    )
  }

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
    >
      {dark ? 'Dark Mode' : 'Light Mode'}
    </button>
  )
}