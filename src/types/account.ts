export type AccountType = 'cash' | 'checking' | 'savings' | 'investment'

export interface Account {
  id: string
  name: string
  balance: number
  icon: string
  color: string
  type: AccountType
  createdAt?: string
  updatedAt?: string
}

export interface CreateAccountDTO {
  name: string
  balance?: number
  icon?: string
  color?: string
  type?: AccountType
}

export interface UpdateAccountDTO extends Partial<CreateAccountDTO> {
  id: string
}
