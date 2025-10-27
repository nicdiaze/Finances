'use client'

import { useState, useEffect } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type'], duration?: number) => void
  removeToast: (id: string) => void
}

// Context simple para notificaciones
let toastContext: ToastContextType = {
  toasts: [],
  addToast: () => {},
  removeToast: () => {}
}

// Hook personalizado para usar las notificaciones
export function useToast() {
  return {
    success: (message: string, duration = 3000) => toastContext.addToast(message, 'success', duration),
    error: (message: string, duration = 5000) => toastContext.addToast(message, 'error', duration),
    info: (message: string, duration = 3000) => toastContext.addToast(message, 'info', duration),
    warning: (message: string, duration = 4000) => toastContext.addToast(message, 'warning', duration)
  }
}

// Componente individual de toast
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 10)
    
    // Auto-remove después del duration
    const removeTimer = setTimeout(() => {
      handleRemove()
    }, toast.duration || 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [])

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getToastStyles = () => {
    const baseStyles = 'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 transform'
    
    if (isRemoving) {
      return `${baseStyles} translate-x-full opacity-0`
    }
    
    if (isVisible) {
      return `${baseStyles} translate-x-0 opacity-100`
    }
    
    return `${baseStyles} translate-x-full opacity-0`
  }

  const getIconAndColors = () => {
    switch (toast.type) {
      case 'success':
        return { icon: '✅', bgColor: 'bg-green-50', textColor: 'text-green-800', borderColor: 'border-green-200' }
      case 'error':
        return { icon: '❌', bgColor: 'bg-red-50', textColor: 'text-red-800', borderColor: 'border-red-200' }
      case 'warning':
        return { icon: '⚠️', bgColor: 'bg-yellow-50', textColor: 'text-yellow-800', borderColor: 'border-yellow-200' }
      case 'info':
      default:
        return { icon: 'ℹ️', bgColor: 'bg-blue-50', textColor: 'text-blue-800', borderColor: 'border-blue-200' }
    }
  }

  const { icon, bgColor, textColor, borderColor } = getIconAndColors()

  return (
    <div className={getToastStyles()}>
      <div className={`p-4 border-l-4 ${borderColor} ${bgColor}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-lg">{icon}</span>
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${textColor}`}>
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`inline-flex ${textColor} hover:opacity-75 focus:outline-none`}
              onClick={handleRemove}
            >
              <span className="sr-only">Cerrar</span>
              <span className="text-lg">✕</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal del contenedor de toasts
export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Configurar el contexto
  useEffect(() => {
    toastContext.toasts = toasts
    toastContext.addToast = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const newToast: Toast = { id, message, type, duration }
      setToasts(prev => [...prev, newToast])
    }
    toastContext.removeToast = (id: string) => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }
  }, [toasts])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={toastContext.removeToast}
        />
      ))}
    </div>
  )
}

// Función helper para mostrar notificaciones desde cualquier lugar
export const showToast = {
  success: (message: string, duration = 3000) => {
    if (toastContext.addToast) {
      toastContext.addToast(message, 'success', duration)
    }
  },
  error: (message: string, duration = 5000) => {
    if (toastContext.addToast) {
      toastContext.addToast(message, 'error', duration)
    }
  },
  info: (message: string, duration = 3000) => {
    if (toastContext.addToast) {
      toastContext.addToast(message, 'info', duration)
    }
  },
  warning: (message: string, duration = 4000) => {
    if (toastContext.addToast) {
      toastContext.addToast(message, 'warning', duration)
    }
  }
}