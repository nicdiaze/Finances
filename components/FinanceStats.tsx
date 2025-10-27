'use client'

interface StatsCardProps {
  title: string
  amount: number
  type?: 'ingreso' | 'gasto' | 'balance'
  count?: number
}

interface FinanceStatsProps {
  stats: {
    totalIngresos: number
    totalGastos: number
    balance: number
    totalTransacciones: number
  }
  loading?: boolean
}

function StatsCard({ title, amount, type = 'balance', count }: StatsCardProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount))
  }

  const getColorClasses = () => {
    switch (type) {
      case 'ingreso':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'gasto':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'balance':
        return amount >= 0 
          ? 'bg-blue-50 border-blue-200 text-blue-800'
          : 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getAmountPrefix = () => {
    if (type === 'ingreso') return '+'
    if (type === 'gasto') return '-'
    if (type === 'balance' && amount < 0) return '-'
    return amount >= 0 ? '+' : ''
  }

  return (
    <div className={`p-6 rounded-lg border-2 ${getColorClasses()}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold">
            {getAmountPrefix()}{formatAmount(amount)}
          </p>
          {count !== undefined && (
            <p className="text-sm opacity-60 mt-1">
              {count} transaccion{count !== 1 ? 'es' : ''}
            </p>
          )}
        </div>
        
        <div className="text-3xl opacity-50">
          {type === 'ingreso' && '📈'}
          {type === 'gasto' && '📉'}
          {type === 'balance' && (amount >= 0 ? '💰' : '⚠️')}
        </div>
      </div>
    </div>
  )
}

export default function FinanceStats({ stats, loading }: FinanceStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Ingresos"
        amount={stats.totalIngresos}
        type="ingreso"
      />
      
      <StatsCard
        title="Total Gastos"
        amount={stats.totalGastos}
        type="gasto"
      />
      
      <StatsCard
        title="Balance"
        amount={stats.balance}
        type="balance"
      />
      
      <StatsCard
        title="Transacciones"
        amount={stats.totalTransacciones}
        count={stats.totalTransacciones}
      />
    </div>
  )
}