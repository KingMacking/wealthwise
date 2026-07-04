export interface Budget {
  id: string
  categoryId: string
  subcategoryId: string | null
  month: number
  year: number
  amount: number
  spent: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateBudgetDTO {
  categoryId: string
  subcategoryId?: string
  month: number
  year: number
  amount: number
}

export interface UpdateBudgetDTO extends Partial<CreateBudgetDTO> {
  id: string
}
