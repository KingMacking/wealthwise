export interface Subcategory {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  monthlyBudget: number | null
  subcategories: Subcategory[]
  order: number
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateCategoryDTO {
  name: string
  icon?: string
  color?: string
  monthlyBudget?: number
  subcategories?: Subcategory[]
  order?: number
  active?: boolean
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
  id: string
}
