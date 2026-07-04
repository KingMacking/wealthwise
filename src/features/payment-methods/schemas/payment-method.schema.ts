import { z } from 'zod'

export const paymentMethodFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50),
  icon: z.string(),
})

export type PaymentMethodFormValues = z.infer<typeof paymentMethodFormSchema>
