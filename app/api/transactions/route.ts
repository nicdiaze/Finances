import { NextRequest, NextResponse } from 'next/server'

// Esta ruta está deshabilitada porque estamos usando Firebase como provider principal
export async function GET(request: NextRequest) {
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