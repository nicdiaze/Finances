'use client'

import { useState } from 'react'

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void
  onSearchChange: (search: string) => void
}

interface FilterOptions {
  type: '' | 'ingreso' | 'gasto'
  category: string
  month: string
  year: string
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)
const MONTHS = [
  { value: '', label: 'Todos los meses' },
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' }
]

const CATEGORIES = [
  { value: '', label: 'Todas las categorías' },
  // Ingresos
  { value: 'salario', label: '💼 Salario' },
  { value: 'freelance', label: '💻 Freelance' },
  { value: 'inversiones', label: '📈 Inversiones' },
  { value: 'ventas', label: '💰 Ventas' },
  { value: 'otros-ingresos', label: '➕ Otros ingresos' },
  // Gastos
  { value: 'alimentacion', label: '🍔 Alimentación' },
  { value: 'transporte', label: '🚗 Transporte' },
  { value: 'vivienda', label: '🏠 Vivienda' },
  { value: 'salud', label: '⚕️ Salud' },
  { value: 'entretenimiento', label: '🎬 Entretenimiento' },
  { value: 'educacion', label: '📚 Educación' },
  { value: 'ropa', label: '👔 Ropa' },
  { value: 'servicios', label: '🔧 Servicios' },
  { value: 'otros-gastos', label: '➖ Otros gastos' }
]

export default function FilterBar({ onFilterChange, onSearchChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    type: '',
    category: '',
    month: '',
    year: CURRENT_YEAR.toString()
  })
  
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange(value)
  }

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      type: '',
      category: '',
      month: '',
      year: CURRENT_YEAR.toString()
    }
    setFilters(clearedFilters)
    setSearch('')
    onFilterChange(clearedFilters)
    onSearchChange('')
  }

  const hasActiveFilters = filters.type || filters.category || filters.month || search

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Header con botón toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">🔍 Filtros y Búsqueda</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Filtros activos
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Limpiar filtros
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
        </div>
      </div>

      {/* Barra de búsqueda - siempre visible */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Buscar por descripción..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filtros avanzados */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="ingreso">📈 Ingresos</option>
              <option value="gasto">📉 Gastos</option>
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mes
            </label>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {MONTHS.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Año */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año
            </label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {YEARS.map(year => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Resumen de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Filtros activos:</strong>{' '}
            {filters.type && `Tipo: ${filters.type === 'ingreso' ? 'Ingresos' : 'Gastos'} • `}
            {filters.category && `Categoría: ${CATEGORIES.find(c => c.value === filters.category)?.label} • `}
            {filters.month && `Mes: ${MONTHS.find(m => m.value === filters.month)?.label} • `}
            {filters.year !== CURRENT_YEAR.toString() && `Año: ${filters.year} • `}
            {search && `Búsqueda: "${search}"`}
          </p>
        </div>
      )}
    </div>
  )
}