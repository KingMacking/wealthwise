import { z } from 'zod'

export const goalFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50),
  targetAmount: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().positive('La meta debe ser mayor a 0')),
  currentAmount: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().min(0, 'No puede ser negativo')),
  targetDate: z.string().nullable().optional(),
  icon: z.string(),
  color: z.string(),
})

export type GoalFormValues = z.infer<typeof goalFormSchema>

export const goalDepositSchema = z.object({
  amount: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().positive('El monto debe ser mayor a 0')),
})

export type GoalDepositValues = z.infer<typeof goalDepositSchema>
