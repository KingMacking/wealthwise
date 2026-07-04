export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string | null
  icon: string
  color: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateGoalDTO {
  name: string
  targetAmount: number
  currentAmount?: number
  targetDate?: string
  icon?: string
  color?: string
}

export interface UpdateGoalDTO extends Partial<CreateGoalDTO> {
  id: string
}
