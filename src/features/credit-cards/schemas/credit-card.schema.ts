import { z } from 'zod'

export const creditCardFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50),
  limit: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().positive('El límite debe ser mayor a 0')),
  closingDay: z.preprocess((v) => (v === '' ? 1 : Number(v)), z.number().int().min(1, 'Día inválido').max(31, 'Día inválido')),
  dueDay: z.preprocess((v) => (v === '' ? 1 : Number(v)), z.number().int().min(1, 'Día inválido').max(31, 'Día inválido')),
  currentConsumption: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number().min(0, 'No puede ser negativo')),
  color: z.string(),
})

export type CreditCardFormValues = z.infer<typeof creditCardFormSchema>
