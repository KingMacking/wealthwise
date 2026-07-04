export type MovementType = 'income' | 'expense' | 'transfer'
export type MovementStatus = 'pending' | 'confirmed'

export interface Movement {
  id: string
  date: string
  type: MovementType
  description: string
  amount: number
  categoryId: string
  subcategoryId: string | null
  accountId: string
  destinationAccountId: string | null
  paymentMethodId: string
  notes: string | null
  tags: string[]
  attachments: string[]
  color: string
  icon: string
  status: MovementStatus
  createdAt?: string
  updatedAt?: string
}

export interface CreateMovementDTO {
  date: string
  type: MovementType
  description: string
  amount: number
  categoryId: string
  subcategoryId?: string
  accountId: string
  destinationAccountId?: string
  paymentMethodId: string
  notes?: string
  tags?: string[]
  color?: string
  icon?: string
  status?: MovementStatus
}

export interface UpdateMovementDTO extends Partial<CreateMovementDTO> {
  id: string
}

export interface MovementFilters {
  type?: MovementType
  categoryId?: string
  subcategoryId?: string
  accountId?: string
  paymentMethodId?: string
  status?: MovementStatus
  tags?: string[]
  search?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  sortBy?: keyof Movement
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
