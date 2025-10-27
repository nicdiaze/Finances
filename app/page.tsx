'use client'

import { useState, useEffect } from 'react'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import FinanceStats from '@/components/FinanceStats'
import FilterBar from '@/components/FilterBar'
import ExportButton from '@/components/ExportButton'
import SimpleCharts from '@/components/SimpleCharts'
import ThemeToggle from '@/components/ThemeToggle'
import ToastContainer, { useToast } from '@/components/Toast'

interface Transaction {
  _id: string
  amount: number
  description: string
  category: string
  type: 'ingreso' | 'gasto'
  date: string
  createdAt: string
}

interface Stats {
  totalIngresos: number
  totalGastos: number
  balance: number
  totalTransacciones: number
}

interface FilterOptions {
  type: '' | 'ingreso' | 'gasto'
  category: string
  month: string
  year: string
}

interface ChartData {
  totalIngresos: number
  totalGastos: number
  balance: number
  byCategory: Array<{
    category: string
    total: number
    count: number
    type: string
  }>
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<Stats>({
    totalIngresos: 0,
    totalGastos: 0,
    balance: 0,
    totalTransacciones: 0
  })
  const [chartData, setChartData] = useState<ChartData>({
    totalIngresos: 0,
    totalGastos: 0,
    balance: 0,
    byCategory: []
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    type: '',
    category: '',
    month: '',
    year: new Date().getFullYear().toString()
  })
  const [searchQuery, setSearchQuery] = useState('')
  const toast = useToast()

  // Cargar todas las transacciones
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions?limit=100')
      const data = await response.json()
      
      if (data.success) {
        setAllTransactions(data.data)
        setTransactions(data.data)
        setFilteredTransactions(data.data)
      } else {
        console.error('Error al cargar transacciones:', data.error)
        toast.error('Error al cargar las transacciones')
      }
    } catch (error) {
      console.error('Error al cargar transacciones:', error)
      toast.error('Error de conexión al cargar las transacciones')
    } finally {
      setLoading(false)
    }
  }

  // Cargar estadísticas
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/transactions/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data.summary)
        setChartData({
          totalIngresos: data.data.summary.totalIngresos,
          totalGastos: data.data.summary.totalGastos,
          balance: data.data.summary.balance,
          byCategory: data.data.byCategory.map((item: any) => ({
            category: item._id.category,
            total: item.total,
            count: item.count,
            type: item._id.type
          }))
        })
      } else {
        console.error('Error al cargar estadísticas:', data.error)
        toast.error('Error al cargar las estadísticas')
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
      toast.error('Error de conexión al cargar las estadísticas')
    } finally {
      setStatsLoading(false)
    }
  }

  // Aplicar filtros y búsqueda
  const applyFilters = () => {
    let filtered = [...allTransactions]

    // Filtro por tipo
    if (currentFilters.type) {
      filtered = filtered.filter(t => t.type === currentFilters.type)
    }

    // Filtro por categoría
    if (currentFilters.category) {
      filtered = filtered.filter(t => t.category === currentFilters.category)
    }

    // Filtro por mes y año
    if (currentFilters.month || currentFilters.year) {
      filtered = filtered.filter(t => {
        const date = new Date(t.date)
        const year = date.getFullYear().toString()
        const month = (date.getMonth() + 1).toString()

        let matchesYear = true
        let matchesMonth = true

        if (currentFilters.year) {
          matchesYear = year === currentFilters.year
        }

        if (currentFilters.month) {
          matchesMonth = month === currentFilters.month
        }

        return matchesYear && matchesMonth
      })
    }

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredTransactions(filtered)
    setTransactions(filtered.slice(0, 20)) // Mostrar solo los primeros 20
  }

  // Crear nueva transacción
  const handleCreateTransaction = async (formData: any) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        fetchTransactions()
        fetchStats()
        setShowForm(false)
        toast.success('Transacción creada exitosamente')
      } else {
        toast.error('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error al crear transacción:', error)
      toast.error('Error al crear la transacción')
    }
  }

  // Actualizar transacción
  const handleUpdateTransaction = async (formData: any) => {
    if (!editingTransaction) return

    try {
      const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        fetchTransactions()
        fetchStats()
        setEditingTransaction(null)
        toast.success('Transacción actualizada exitosamente')
      } else {
        toast.error('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error al actualizar transacción:', error)
      toast.error('Error al actualizar la transacción')
    }
  }

  // Eliminar transacción
  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchTransactions()
        fetchStats()
        toast.success('Transacción eliminada exitosamente')
      } else {
        toast.error('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error al eliminar transacción:', error)
      toast.error('Error al eliminar la transacción')
    }
  }

  // Manejar cambios en filtros
  const handleFilterChange = (filters: FilterOptions) => {
    setCurrentFilters(filters)
  }

  // Manejar cambios en búsqueda
  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
  }

  // Manejar edición
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setShowForm(false)
  }

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingTransaction(null)
  }

  // Aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters()
  }, [currentFilters, searchQuery, allTransactions])

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchTransactions()
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Toast Container */}
      <ToastContainer />
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                💰 Historial Financiero
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Gestiona tus ingresos y gastos de forma sencilla
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => {
                  setShowForm(!showForm)
                  setEditingTransaction(null)
                }}
                className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
              >
                {showForm ? 'Cancelar' : '+ Nueva Transacción'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <FinanceStats stats={stats} loading={statsLoading} />

        {/* Filtros y búsqueda */}
        <FilterBar 
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />

        {/* Formulario */}
        {(showForm || editingTransaction) && (
          <div className="mb-8">
            <TransactionForm
              onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
              onCancel={editingTransaction ? handleCancelEdit : () => setShowForm(false)}
              initialData={editingTransaction}
            />
          </div>
        )}

        {/* Gráficos y análisis */}
        {!loading && !statsLoading && (
          <SimpleCharts data={chartData} loading={statsLoading} />
        )}

        {/* Botones de exportación */}
        {filteredTransactions.length > 0 && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors">
            <ExportButton transactions={filteredTransactions} />
          </div>
        )}

        {/* Lista de transacciones */}
        <div className="space-y-4">
          {filteredTransactions.length > transactions.length && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                📊 Mostrando {transactions.length} de {filteredTransactions.length} transacciones que coinciden con tus filtros.
              </p>
            </div>
          )}

          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDeleteTransaction}
            loading={loading}
          />
        </div>

        {/* Información adicional mejorada */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded transition-colors">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Tips Financieros</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Mantén un registro consistente de tus transacciones</li>
              <li>• Revisa tus gastos mensualmente</li>
              <li>• Usa las categorías para identificar patrones de gasto</li>
              <li>• Exporta tus datos para análisis externos</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 rounded transition-colors">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">🚀 Funcionalidades</h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• 🔍 Búsqueda por descripción</li>
              <li>• 📊 Filtros avanzados por fecha y categoría</li>
              <li>• 📈 Gráficos y análisis visual</li>
              <li>• 📤 Exportación a CSV, JSON e impresión</li>
              <li>• 🌙 Modo oscuro disponible</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}