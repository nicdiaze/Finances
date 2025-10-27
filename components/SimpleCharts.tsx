'use client'

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

interface SimpleChartsProps {
  data: ChartData
  loading?: boolean
}

const CATEGORY_LABELS: { [key: string]: string } = {
  'salario': '💼 Salario',
  'freelance': '💻 Freelance',
  'inversiones': '📈 Inversiones',
  'ventas': '💰 Ventas',
  'otros-ingresos': '➕ Otros ingresos',
  'alimentacion': '🍔 Alimentación',
  'transporte': '🚗 Transporte',
  'vivienda': '🏠 Vivienda',
  'salud': '⚕️ Salud',
  'entretenimiento': '🎬 Entretenimiento',
  'educacion': '📚 Educación',
  'ropa': '👔 Ropa',
  'servicios': '🔧 Servicios',
  'otros-gastos': '➖ Otros gastos'
}

export default function SimpleCharts({ data, loading }: SimpleChartsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Análisis Visual</h3>
        <div className="animate-pulse">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const total = data.totalIngresos + data.totalGastos
  const ingresosPorcentaje = total > 0 ? (data.totalIngresos / total) * 100 : 0
  const gastosPorcentaje = total > 0 ? (data.totalGastos / total) * 100 : 0

  // Obtener los gastos más altos
  const gastosPorCategoria = data.byCategory
    .filter(item => item.type === 'gasto')
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  // Obtener los ingresos más altos
  const ingresosPorCategoria = data.byCategory
    .filter(item => item.type === 'ingreso')
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  const maxGasto = gastosPorCategoria.length > 0 ? gastosPorCategoria[0].total : 1
  const maxIngreso = ingresosPorCategoria.length > 0 ? ingresosPorCategoria[0].total : 1

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">📊 Análisis Visual</h3>
      
      {/* Gráfico de balance circular */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-800 mb-3">💰 Distribución Ingresos vs Gastos</h4>
        
        {total > 0 ? (
          <div className="space-y-3">
            {/* Barra de progreso para ingresos */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-green-700">📈 Ingresos</span>
                <span className="text-sm text-green-600">
                  ${data.totalIngresos.toFixed(2)} ({ingresosPorcentaje.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${ingresosPorcentaje}%` }}
                ></div>
              </div>
            </div>
            
            {/* Barra de progreso para gastos */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-red-700">📉 Gastos</span>
                <span className="text-sm text-red-600">
                  ${data.totalGastos.toFixed(2)} ({gastosPorcentaje.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${gastosPorcentaje}%` }}
                ></div>
              </div>
            </div>

            {/* Balance */}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-800">💵 Balance Total</span>
                <span className={`text-sm font-semibold ${data.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.balance >= 0 ? '+' : ''}${data.balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay datos para mostrar</p>
            <p className="text-sm">Agrega algunas transacciones para ver el análisis</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top gastos por categoría */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">🔴 Top Gastos por Categoría</h4>
          {gastosPorCategoria.length > 0 ? (
            <div className="space-y-3">
              {gastosPorCategoria.map((item, index) => (
                <div key={`gasto-${item.category}`} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <span className="text-sm text-red-600 font-medium">
                        ${item.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.total / maxGasto) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.count} transacción{item.count !== 1 ? 'es' : ''}
                    </div>
                  </div>
                  <div className="text-lg">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No hay gastos registrados</p>
            </div>
          )}
        </div>

        {/* Top ingresos por categoría */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">🟢 Top Ingresos por Categoría</h4>
          {ingresosPorCategoria.length > 0 ? (
            <div className="space-y-3">
              {ingresosPorCategoria.map((item, index) => (
                <div key={`ingreso-${item.category}`} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        ${item.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.total / maxIngreso) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.count} transacción{item.count !== 1 ? 'es' : ''}
                    </div>
                  </div>
                  <div className="text-lg">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No hay ingresos registrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Consejos basados en los datos */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <h5 className="font-medium text-blue-900 mb-2">💡 Insights Automáticos</h5>
        <div className="text-sm text-blue-800 space-y-1">
          {data.balance > 0 && (
            <p>✅ Tienes un balance positivo de ${data.balance.toFixed(2)}. ¡Buen trabajo!</p>
          )}
          {data.balance < 0 && (
            <p>⚠️ Tu balance es negativo (${data.balance.toFixed(2)}). Considera revisar tus gastos.</p>
          )}
          {gastosPorCategoria.length > 0 && (
            <p>🔍 Tu mayor gasto está en {CATEGORY_LABELS[gastosPorCategoria[0].category]} (${gastosPorCategoria[0].total.toFixed(2)}).</p>
          )}
          {ingresosPorCategoria.length > 0 && (
            <p>💼 Tu principal fuente de ingresos es {CATEGORY_LABELS[ingresosPorCategoria[0].category]} (${ingresosPorCategoria[0].total.toFixed(2)}).</p>
          )}
        </div>
      </div>
    </div>
  )
}