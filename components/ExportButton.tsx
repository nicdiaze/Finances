'use client'

interface Transaction {
  _id: string
  amount: number
  description: string
  category: string
  type: 'ingreso' | 'gasto'
  date: string
  createdAt: string
}

interface ExportButtonProps {
  transactions: Transaction[]
  filename?: string
}

const CATEGORY_LABELS: { [key: string]: string } = {
  'salario': 'Salario',
  'freelance': 'Freelance',
  'inversiones': 'Inversiones',
  'ventas': 'Ventas',
  'otros-ingresos': 'Otros ingresos',
  'alimentacion': 'Alimentación',
  'transporte': 'Transporte',
  'vivienda': 'Vivienda',
  'salud': 'Salud',
  'entretenimiento': 'Entretenimiento',
  'educacion': 'Educación',
  'ropa': 'Ropa',
  'servicios': 'Servicios',
  'otros-gastos': 'Otros gastos'
}

export default function ExportButton({ transactions, filename = 'transacciones' }: ExportButtonProps) {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  }

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'ingreso' ? '+' : '-'
    return `${sign}$${amount.toFixed(2)}`
  }

  const exportToCSV = () => {
    try {
      // Preparar los datos
      const headers = ['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto']
      
      const csvData = transactions.map(transaction => [
        formatDate(transaction.date),
        transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto',
        CATEGORY_LABELS[transaction.category] || transaction.category,
        transaction.description,
        formatAmount(transaction.amount, transaction.type)
      ])

      // Crear el contenido CSV
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => 
            typeof field === 'string' && field.includes(',') 
              ? `"${field}"` 
              : field
          ).join(',')
        )
      ].join('\n')

      // Crear y descargar el archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      alert('✅ Archivo CSV exportado exitosamente')
    } catch (error) {
      console.error('Error al exportar CSV:', error)
      alert('❌ Error al exportar el archivo CSV')
    }
  }

  const exportToJSON = () => {
    try {
      // Preparar los datos con formato legible
      const jsonData = transactions.map(transaction => ({
        fecha: formatDate(transaction.date),
        tipo: transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto',
        categoria: CATEGORY_LABELS[transaction.category] || transaction.category,
        descripcion: transaction.description,
        monto: formatAmount(transaction.amount, transaction.type),
        montoNumerico: transaction.amount,
        fechaOriginal: transaction.date,
        id: transaction._id
      }))

      // Crear estadísticas de resumen
      const totalIngresos = transactions
        .filter(t => t.type === 'ingreso')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const totalGastos = transactions
        .filter(t => t.type === 'gasto')
        .reduce((sum, t) => sum + t.amount, 0)

      const exportData = {
        resumen: {
          totalTransacciones: transactions.length,
          totalIngresos: totalIngresos,
          totalGastos: totalGastos,
          balance: totalIngresos - totalGastos,
          fechaExportacion: new Date().toISOString()
        },
        transacciones: jsonData
      }

      // Crear y descargar el archivo
      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      alert('✅ Archivo JSON exportado exitosamente')
    } catch (error) {
      console.error('Error al exportar JSON:', error)
      alert('❌ Error al exportar el archivo JSON')
    }
  }

  const printReport = () => {
    try {
      // Calcular estadísticas
      const totalIngresos = transactions
        .filter(t => t.type === 'ingreso')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const totalGastos = transactions
        .filter(t => t.type === 'gasto')
        .reduce((sum, t) => sum + t.amount, 0)

      const balance = totalIngresos - totalGastos

      // Crear contenido HTML para imprimir
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reporte Financiero</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; }
            .stat { display: inline-block; margin: 10px 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .ingreso { color: green; }
            .gasto { color: red; }
            .balance-positive { color: green; font-weight: bold; }
            .balance-negative { color: red; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>💰 Reporte Financiero</h1>
            <p>Generado el ${new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          <div class="stats">
            <h2>📊 Resumen</h2>
            <div class="stat">
              <strong>Total Ingresos:</strong> 
              <span class="ingreso">+$${totalIngresos.toFixed(2)}</span>
            </div>
            <div class="stat">
              <strong>Total Gastos:</strong> 
              <span class="gasto">-$${totalGastos.toFixed(2)}</span>
            </div>
            <div class="stat">
              <strong>Balance:</strong> 
              <span class="${balance >= 0 ? 'balance-positive' : 'balance-negative'}">
                ${balance >= 0 ? '+' : ''}$${balance.toFixed(2)}
              </span>
            </div>
            <div class="stat">
              <strong>Total Transacciones:</strong> ${transactions.length}
            </div>
          </div>

          <h2>📋 Detalle de Transacciones</h2>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(transaction => `
                <tr>
                  <td>${formatDate(transaction.date)}</td>
                  <td>${transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto'}</td>
                  <td>${CATEGORY_LABELS[transaction.category] || transaction.category}</td>
                  <td>${transaction.description}</td>
                  <td class="${transaction.type}">
                    ${formatAmount(transaction.amount, transaction.type)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `

      // Abrir ventana de impresión
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()
        printWindow.print()
      }
    } catch (error) {
      console.error('Error al imprimir:', error)
      alert('❌ Error al generar el reporte para imprimir')
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No hay transacciones para exportar
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-600 font-medium">
        📤 Exportar ({transactions.length} transacciones):
      </span>
      
      <button
        onClick={exportToCSV}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        title="Exportar como archivo CSV (Excel)"
      >
        📊 CSV
      </button>
      
      <button
        onClick={exportToJSON}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        title="Exportar como archivo JSON"
      >
        📋 JSON
      </button>
      
      <button
        onClick={printReport}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        title="Imprimir reporte"
      >
        🖨️ Imprimir
      </button>
    </div>
  )
}