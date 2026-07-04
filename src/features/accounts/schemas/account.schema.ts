import { z } from 'zod'

export const accountFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50),
  type: z.enum(['cash', 'checking', 'savings', 'investment']),
  color: z.string(),
  balance: z.preprocess((v) => (v === '' ? 0 : Number(v)), z.number()),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>
