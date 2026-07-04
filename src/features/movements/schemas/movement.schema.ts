import { z } from 'zod'

export const movementFormSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  type: z.enum(['income', 'expense', 'transfer']),
  description: z.string().min(2, 'La descripción debe tener al menos 2 caracteres').max(200),
  amount: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().positive('El monto debe ser mayor a 0')),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  subcategoryId: z.string().optional(),
  accountId: z.string().min(1, 'La cuenta es requerida'),
  destinationAccountId: z.string().optional(),
  paymentMethodId: z.string().min(1, 'El método de pago es requerido'),
  status: z.enum(['pending', 'confirmed']),
  notes: z.string().max(500).optional(),
  tags: z.string().optional(),
}).refine(
  (data) => data.type !== 'transfer' || (data.destinationAccountId && data.destinationAccountId !== data.accountId),
  {
    message: 'Debe seleccionar una cuenta destino diferente a la cuenta origen',
    path: ['destinationAccountId'],
  }
)

export type MovementFormValues = z.infer<typeof movementFormSchema>
