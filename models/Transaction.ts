import mongoose, { Schema, Document } from 'mongoose'

export interface ITransaction extends Document {
  amount: number
  description: string
  category: string
  type: 'ingreso' | 'gasto'
  date: Date
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema: Schema = new Schema({
  amount: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0.01, 'El monto debe ser mayor a 0']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: [
      // Categorías de ingresos
      'salario',
      'freelance', 
      'inversiones',
      'ventas',
      'otros-ingresos',
      // Categorías de gastos
      'alimentacion',
      'transporte',
      'vivienda',
      'salud',
      'entretenimiento',
      'educacion',
      'ropa',
      'servicios',
      'otros-gastos'
    ]
  },
  type: {
    type: String,
    required: [true, 'El tipo de transacción es requerido'],
    enum: ['ingreso', 'gasto']
  },
  date: {
    type: Date,
    required: [true, 'La fecha es requerida'],
    default: Date.now
  }
}, {
  timestamps: true // Esto añade createdAt y updatedAt automáticamente
})

// Índices para mejorar las consultas
TransactionSchema.index({ date: -1 })
TransactionSchema.index({ type: 1 })
TransactionSchema.index({ category: 1 })

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema)