'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Cargar tema al montar el componente
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Si no hay tema guardado, usar la preferencia del sistema
    let shouldBeDark = false
    if (savedTheme) {
      shouldBeDark = savedTheme === 'dark'
    } else {
      shouldBeDark = prefersDark
    }
    
    setIsDark(shouldBeDark)
    
    // Aplicar el tema al DOM
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    
    setIsDark(newIsDark)
    
    // Aplicar cambios al DOM
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Evitar flash de contenido sin estilo
  if (!mounted) {
    return (
      <div className="w-14 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${isDark ? 'bg-blue-600' : 'bg-gray-200'}
      `}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span className="sr-only">Cambiar tema</span>
      <div
        className={`
          inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200
          ${isDark ? 'translate-x-7' : 'translate-x-1'}
        `}
      >
        {isDark ? (
          <span className="text-xs">🌙</span>
        ) : (
          <span className="text-xs">☀️</span>
        )}
      </div>
    </button>
  )
}