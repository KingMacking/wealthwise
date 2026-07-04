import { z } from 'zod'

export const subcategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es requerido'),
})

export const categoryFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50),
  icon: z.string(),
  color: z.string(),
  monthlyBudget: z.preprocess(
    (v) => (v === '' || v === undefined || v === null ? undefined : Number(v)),
    z.number().optional()
  ),
  active: z.boolean(),
  subcategories: z.array(subcategorySchema),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
