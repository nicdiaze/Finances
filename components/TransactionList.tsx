'use client'

import { useState } from 'react'

interface Transaction {
  _id?: string  // MongoDB
  id?: string   // Firebase
  amount: number
  description: string
  category: string
  type: 'ingreso' | 'gasto'
  date: string
  createdAt: string
}

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  loading?: boolean
}

const CATEGORY_LABELS: { [key: string]: string } = {
  // Ingresos
  'salario': 'Salario',
  'freelance': 'Freelance',
  'inversiones': 'Inversiones',
  'ventas': 'Ventas',
  'aguinaldo': 'Aguinaldo',
  'bonos': 'Bonos',
  'otros-ingresos': 'Otros ingresos',
  // Gastos
  'alimentacion': 'Alimentación',
  'transporte': 'Transporte/Locomoción',
  'vivienda': 'Vivienda/Arriendo',
  'salud': 'Salud/Isapre',
  'entretenimiento': 'Entretenimiento',
  'educacion': 'Educación',
  'ropa': 'Ropa y Vestimenta',
  'servicios': 'Servicios Básicos',
  'impuestos': 'Impuestos',
  'supermercado': 'Supermercado',
  'otros-gastos': 'Otros gastos'
}

export default function TransactionList({ transactions, onEdit, onDelete, loading }: TransactionListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAmount = (amount: number, type: string) => {
    const formattedAmount = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
    
    return type === 'ingreso' ? `+${formattedAmount}` : `-${formattedAmount}`
  }

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-500 text-lg mb-2">No hay transacciones</div>
        <p className="text-gray-400">Agrega tu primera transacción para comenzar a rastrear tus finanzas</p>
      </div>
    )
  }

  // Validación defensiva
  if (!Array.isArray(transactions)) {
    console.error('TransactionList: transactions is not an array:', transactions)
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-600">Error: Los datos de transacciones no son válidos</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Transacciones Recientes ({transactions.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div key={transaction._id || transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-1">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.type === 'ingreso' 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}></div>
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {transaction.description}
                  </h4>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {CATEGORY_LABELS[transaction.category] || transaction.category}
                  </span>
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={`text-lg font-semibold ${
                  transaction.type === 'ingreso' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formatAmount(transaction.amount, transaction.type)}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </button>
                  
                  <button
                    onClick={() => {
                      const id = transaction._id || transaction.id || ''
                      if (id) handleDelete(id)
                    }}
                    className={`text-sm font-medium ${
                      deleteConfirm === (transaction._id || transaction.id)
                        ? 'text-red-800 bg-red-100 px-2 py-1 rounded'
                        : 'text-red-600 hover:text-red-800'
                    }`}
                  >
                    {deleteConfirm === (transaction._id || transaction.id) ? '¿Confirmar?' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}