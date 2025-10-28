'use client'

import { useState } from 'react'

interface TransactionFormProps {
  onSubmit: (data: any) => void
  onCancel?: () => void
  initialData?: any
}

const CATEGORIES = {
  ingreso: [
    { value: 'salario', label: 'Salario' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'inversiones', label: 'Inversiones' },
    { value: 'ventas', label: 'Ventas' },
    { value: 'aguinaldo', label: 'Aguinaldo' },
    { value: 'bonos', label: 'Bonos' },
    { value: 'otros-ingresos', label: 'Otros ingresos' }
  ],
  gasto: [
    { value: 'alimentacion', label: 'Alimentación' },
    { value: 'transporte', label: 'Transporte/Locomoción' },
    { value: 'vivienda', label: 'Vivienda/Arriendo' },
    { value: 'salud', label: 'Salud/Isapre' },
    { value: 'entretenimiento', label: 'Entretenimiento' },
    { value: 'educacion', label: 'Educación' },
    { value: 'ropa', label: 'Ropa y Vestimenta' },
    { value: 'servicios', label: 'Servicios Básicos' },
    { value: 'impuestos', label: 'Impuestos' },
    { value: 'supermercado', label: 'Supermercado' },
    { value: 'otros-gastos', label: 'Otros gastos' }
  ]
}

export default function TransactionForm({ onSubmit, onCancel, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    type: initialData?.type || 'gasto',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' && { category: '' })
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.description || !formData.category) {
      alert('Por favor completa todos los campos')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      // Reset form if it's a new transaction
      if (!initialData) {
        setFormData({
          amount: '',
          description: '',
          category: '',
          type: 'gasto',
          date: new Date().toISOString().split('T')[0]
        })
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error)
    }
    setIsSubmitting(false)
  }

  const availableCategories = CATEGORIES[formData.type as keyof typeof CATEGORIES] || []

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {initialData ? 'Editar Transacción' : 'Nueva Transacción'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          >
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monto (CLP)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="1"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          >
            <option value="">Selecciona una categoría</option>
            {availableCategories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar' : 'Agregar Transacción')}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}