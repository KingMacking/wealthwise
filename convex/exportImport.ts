import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import type { Id } from './_generated/dataModel'

const subcategorySchema = v.object({ id: v.string(), name: v.string() })

export const getAllData = query({
  handler: async (ctx) => {
    const [movements, categories, accounts, paymentMethods, budgets, creditCards, goals] = await Promise.all([
      ctx.db.query('movements').collect(),
      ctx.db.query('categories').collect(),
      ctx.db.query('accounts').collect(),
      ctx.db.query('paymentMethods').collect(),
      ctx.db.query('budgets').collect(),
      ctx.db.query('creditCards').collect(),
      ctx.db.query('goals').collect(),
    ])
    return { movements, categories, accounts, paymentMethods, budgets, creditCards, goals }
  },
})

export const importAll = mutation({
  args: {
    movements: v.array(v.object({
      date: v.string(),
      type: v.string(),
      description: v.string(),
      amount: v.number(),
      categoryId: v.string(),
      subcategoryId: v.optional(v.string()),
      accountId: v.string(),
      destinationAccountId: v.optional(v.string()),
      paymentMethodId: v.string(),
      notes: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      color: v.optional(v.string()),
      icon: v.optional(v.string()),
      status: v.optional(v.string()),
    })),
    categories: v.array(v.object({
      name: v.string(),
      icon: v.optional(v.string()),
      color: v.optional(v.string()),
      monthlyBudget: v.optional(v.number()),
      subcategories: v.optional(v.array(subcategorySchema)),
      order: v.optional(v.number()),
      active: v.optional(v.boolean()),
    })),
    accounts: v.array(v.object({
      name: v.string(),
      balance: v.optional(v.number()),
      icon: v.optional(v.string()),
      color: v.optional(v.string()),
      type: v.optional(v.string()),
    })),
    paymentMethods: v.array(v.object({
      name: v.string(),
      icon: v.optional(v.string()),
    })),
    budgets: v.array(v.object({
      categoryId: v.string(),
      subcategoryId: v.optional(v.string()),
      month: v.number(),
      year: v.number(),
      amount: v.number(),
    })),
    creditCards: v.array(v.object({
      name: v.string(),
      limit: v.number(),
      closingDay: v.number(),
      dueDay: v.number(),
      balance: v.optional(v.number()),
      currentConsumption: v.optional(v.number()),
      color: v.optional(v.string()),
    })),
    goals: v.array(v.object({
      name: v.string(),
      targetAmount: v.number(),
      currentAmount: v.optional(v.number()),
      targetDate: v.optional(v.string()),
      icon: v.optional(v.string()),
      color: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    for (const item of args.categories) {
      await ctx.db.insert('categories', {
        name: item.name,
        icon: item.icon ?? 'Tag',
        color: item.color ?? '#3b82f6',
        monthlyBudget: item.monthlyBudget,
        subcategories: item.subcategories ?? [],
        order: item.order ?? 0,
        active: item.active ?? true,
      })
    }
    for (const item of args.accounts) {
      await ctx.db.insert('accounts', {
        name: item.name,
        balance: item.balance ?? 0,
        icon: item.icon ?? 'Landmark',
        color: item.color ?? '#3b82f6',
        type: item.type ?? 'checking',
      })
    }
    for (const item of args.paymentMethods) {
      await ctx.db.insert('paymentMethods', {
        name: item.name,
        icon: item.icon ?? 'CreditCard',
      })
    }
    for (const item of args.movements) {
      await ctx.db.insert('movements', {
        date: item.date,
        type: item.type,
        description: item.description,
        amount: item.amount,
        categoryId: item.categoryId as Id<'categories'>,
        subcategoryId: item.subcategoryId,
        accountId: item.accountId as Id<'accounts'>,
        destinationAccountId: item.destinationAccountId as Id<'accounts'> | undefined,
        paymentMethodId: item.paymentMethodId as Id<'paymentMethods'>,
        notes: item.notes,
        tags: item.tags ?? [],
        attachments: [],
        color: item.color ?? '#3b82f6',
        icon: item.icon ?? 'ArrowRight',
        status: item.status ?? 'confirmed',
      })
    }
    for (const item of args.budgets) {
      await ctx.db.insert('budgets', {
        categoryId: item.categoryId as Id<'categories'>,
        subcategoryId: item.subcategoryId,
        month: item.month,
        year: item.year,
        amount: item.amount,
      })
    }
    for (const item of args.creditCards) {
      await ctx.db.insert('creditCards', {
        name: item.name,
        limit: item.limit,
        closingDay: item.closingDay,
        dueDay: item.dueDay,
        balance: item.balance ?? 0,
        currentConsumption: item.currentConsumption ?? 0,
        color: item.color ?? '#3b82f6',
      })
    }
    for (const item of args.goals) {
      await ctx.db.insert('goals', {
        name: item.name,
        targetAmount: item.targetAmount,
        currentAmount: item.currentAmount ?? 0,
        targetDate: item.targetDate,
        icon: item.icon ?? 'Target',
        color: item.color ?? '#3b82f6',
      })
    }
  },
})
