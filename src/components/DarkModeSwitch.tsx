import React, { useEffect, useState } from 'react'

export default function DarkModeSwitch() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      {dark ? 'Dark Mode' : 'Light Mode'}
    </button>
  )
}