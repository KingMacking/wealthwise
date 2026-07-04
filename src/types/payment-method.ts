export interface PaymentMethod {
  id: string
  name: string
  icon: string
  createdAt?: string
  updatedAt?: string
}

export interface CreatePaymentMethodDTO {
  name: string
  icon?: string
}

export interface UpdatePaymentMethodDTO extends Partial<CreatePaymentMethodDTO> {
  id: string
}
