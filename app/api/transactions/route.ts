import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Transaction from '@/models/Transaction'

// GET - Obtener todas las transacciones
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'ingreso' o 'gasto'
    const category = searchParams.get('category')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')

    // Construir filtros
    const filters: any = {}
    if (type) filters.type = type
    if (category) filters.category = category
    
    // Filtro por fecha
    if (month || year) {
      const dateFilter: any = {}
      
      if (year && month) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
        dateFilter.$gte = startDate
        dateFilter.$lte = endDate
      } else if (year) {
        const startDate = new Date(parseInt(year), 0, 1)
        const endDate = new Date(parseInt(year), 11, 31, 23, 59, 59)
        dateFilter.$gte = startDate
        dateFilter.$lte = endDate
      }
      
      if (Object.keys(dateFilter).length > 0) {
        filters.date = dateFilter
      }
    }
    
    // Filtro por búsqueda
    if (search) {
      filters.description = { $regex: search, $options: 'i' }
    }

    const skip = (page - 1) * limit

    const transactions = await Transaction.find(filters)
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip)

    const total = await Transaction.countDocuments(filters)

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: transactions.length,
        totalTransactions: total
      }
    })

  } catch (error) {
    console.error('Error al obtener transacciones:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva transacción
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { amount, description, category, type, date } = body

    // Validaciones básicas
    if (!amount || !description || !category || !type) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'El monto debe ser mayor a 0' },
        { status: 400 }
      )
    }

    const transaction = new Transaction({
      amount: parseFloat(amount),
      description,
      category,
      type,
      date: date ? new Date(date) : new Date()
    })

    const savedTransaction = await transaction.save()

    return NextResponse.json({
      success: true,
      data: savedTransaction
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error al crear transacción:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}