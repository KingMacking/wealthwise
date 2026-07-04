import { z } from 'zod'

export const budgetFormSchema = z.object({
  categoryId: z.string().min(1, 'La categoría es requerida'),
  amount: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().positive('El monto debe ser mayor a 0')),
})

export type BudgetFormValues = z.infer<typeof budgetFormSchema>
