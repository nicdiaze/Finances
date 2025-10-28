import { NextRequest, NextResponse } from 'next/server'

import dbConnect from '@/lib/dbConnect'
import Transaction from '@/models/Transaction'

// GET - Obtener todas las transacciones
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'ingreso' | 'gasto' | undefined
    const category = searchParams.get('category') || undefined
    const limitParam = parseInt(searchParams.get('limit') || '50')

    let query: any = {}
    
    if (type) {
      query.type = type
    }
    
    if (category) {
      query.category = category
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(limitParam)

    return NextResponse.json({
      success: true,
      data: transactions
    })

  } catch (error: any) {
    console.error('Error en GET /api/transactions:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Esta ruta de MongoDB está deshabilitada. Usa /api/firebase/transactions en su lugar.',
      redirectTo: '/api/firebase/transactions',
      provider: 'firebase'
    },
    { status: 410 }
  )
}