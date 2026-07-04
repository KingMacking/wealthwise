export interface CreditCard {
  id: string
  name: string
  limit: number
  closingDay: number
  dueDay: number
  balance: number
  currentConsumption: number
  color: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCreditCardDTO {
  name: string
  limit: number
  closingDay: number
  dueDay: number
  currentConsumption?: number
  balance?: number
  color?: string
}

export interface UpdateCreditCardDTO extends Partial<CreateCreditCardDTO> {
  id: string
}
