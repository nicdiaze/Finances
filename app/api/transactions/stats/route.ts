import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Transaction from '@/models/Transaction'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null

    // Construir filtros de fecha
    let startDate: Date
    let endDate: Date

    if (month) {
      startDate = new Date(year, month - 1, 1)
      endDate = new Date(year, month, 0, 23, 59, 59)
    } else {
      startDate = new Date(year, 0, 1)
      endDate = new Date(year, 11, 31, 23, 59, 59)
    }

    // Agregaciones para estadísticas
    const stats = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ])

    // Estadísticas por categoría
    const categoryStats = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ])

    // Transacciones recientes (últimas 5)
    const recentTransactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate }
    })
      .sort({ date: -1 })
      .limit(5)

    // Formatear datos
    const formattedStats = {
      ingresos: stats.find(s => s._id === 'ingreso') || { total: 0, count: 0, avgAmount: 0 },
      gastos: stats.find(s => s._id === 'gasto') || { total: 0, count: 0, avgAmount: 0 }
    }

    const balance = formattedStats.ingresos.total - formattedStats.gastos.total

    return NextResponse.json({
      success: true,
      data: {
        period: month ? `${month}/${year}` : year.toString(),
        summary: {
          totalIngresos: formattedStats.ingresos.total,
          totalGastos: formattedStats.gastos.total,
          balance,
          totalTransacciones: formattedStats.ingresos.count + formattedStats.gastos.count
        },
        byCategory: categoryStats,
        recentTransactions
      }
    })

  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}