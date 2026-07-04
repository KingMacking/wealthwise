import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  accounts: defineTable({
    name: v.string(),
    balance: v.number(),
    icon: v.string(),
    color: v.string(),
    type: v.string(),
    userId: v.optional(v.string()),
  }).index('by_userId', ['userId']),

  categories: defineTable({
    name: v.string(),
    icon: v.string(),
    color: v.string(),
    monthlyBudget: v.optional(v.number()),
    subcategories: v.array(
      v.object({ id: v.string(), name: v.string() })
    ),
    order: v.number(),
    active: v.boolean(),
    userId: v.optional(v.string()),
  }).index('by_userId', ['userId']),

  paymentMethods: defineTable({
    name: v.string(),
    icon: v.string(),
    userId: v.optional(v.string()),
  }).index('by_userId', ['userId']),

  budgets: defineTable({
    categoryId: v.id('categories'),
    subcategoryId: v.optional(v.string()),
    month: v.number(),
    year: v.number(),
    amount: v.number(),
    userId: v.optional(v.string()),
  }).index('by_month_year', ['month', 'year']).index('by_userId', ['userId']),

  creditCards: defineTable({
    name: v.string(),
    limit: v.number(),
    closingDay: v.number(),
    dueDay: v.number(),
    balance: v.number(),
    currentConsumption: v.number(),
    color: v.string(),
    userId: v.optional(v.string()),
  }).index('by_userId', ['userId']),

  goals: defineTable({
    name: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    targetDate: v.optional(v.string()),
    icon: v.string(),
    color: v.string(),
    userId: v.optional(v.string()),
  }).index('by_userId', ['userId']),

  movements: defineTable({
    date: v.string(),
    type: v.string(),
    description: v.string(),
    amount: v.number(),
    categoryId: v.id('categories'),
    subcategoryId: v.optional(v.string()),
    accountId: v.id('accounts'),
    destinationAccountId: v.optional(v.id('accounts')),
    paymentMethodId: v.id('paymentMethods'),
    notes: v.optional(v.string()),
    tags: v.array(v.string()),
    attachments: v.array(v.string()),
    color: v.string(),
    icon: v.string(),
    status: v.string(),
    userId: v.optional(v.string()),
  })
    .index('by_date', ['date'])
    .index('by_account', ['accountId'])
    .index('by_category', ['categoryId'])
    .index('by_payment_method', ['paymentMethodId'])
    .index('by_type_date', ['type', 'date'])
    .index('by_userId', ['userId']),
})
