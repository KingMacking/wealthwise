import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import type { Id } from './_generated/dataModel'

const subcategorySchema = v.object({ id: v.string(), name: v.string() })

export const getAllData = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return { movements: [], categories: [], accounts: [], paymentMethods: [], budgets: [], creditCards: [], goals: [] }
    const userId = identity.tokenIdentifier
    const [movements, categories, accounts, paymentMethods, budgets, creditCards, goals] = await Promise.all([
      ctx.db.query('movements').collect(),
      ctx.db.query('categories').collect(),
      ctx.db.query('accounts').collect(),
      ctx.db.query('paymentMethods').collect(),
      ctx.db.query('budgets').collect(),
      ctx.db.query('creditCards').collect(),
      ctx.db.query('goals').collect(),
    ])
    const filter = <T extends { userId?: string }>(items: T[]) => items.filter((a) => a.userId === undefined || a.userId === userId)
    return {
      movements: filter(movements),
      categories: filter(categories),
      accounts: filter(accounts),
      paymentMethods: filter(paymentMethods),
      budgets: filter(budgets),
      creditCards: filter(creditCards),
      goals: filter(goals),
    }
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
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const userId = identity.tokenIdentifier
    for (const item of args.categories) {
      await ctx.db.insert('categories', {
        name: item.name,
        icon: item.icon ?? 'Tag',
        color: item.color ?? '#3b82f6',
        monthlyBudget: item.monthlyBudget,
        subcategories: item.subcategories ?? [],
        order: item.order ?? 0,
        active: item.active ?? true,
        userId,
      })
    }
    for (const item of args.accounts) {
      await ctx.db.insert('accounts', {
        name: item.name,
        balance: item.balance ?? 0,
        icon: item.icon ?? 'Landmark',
        color: item.color ?? '#3b82f6',
        type: item.type ?? 'checking',
        userId,
      })
    }
    for (const item of args.paymentMethods) {
      await ctx.db.insert('paymentMethods', {
        name: item.name,
        icon: item.icon ?? 'CreditCard',
        userId,
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
        userId,
      })
    }
    for (const item of args.budgets) {
      await ctx.db.insert('budgets', {
        categoryId: item.categoryId as Id<'categories'>,
        subcategoryId: item.subcategoryId,
        month: item.month,
        year: item.year,
        amount: item.amount,
        userId,
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
        userId,
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
        userId,
      })
    }
  },
})

export const migrateData = mutation({
  args: {
    manualUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let userId = args.manualUserId
    if (!userId) {
      const identity = await ctx.auth.getUserIdentity()
      if (!identity) return -1
      userId = identity.tokenIdentifier
    }

    let migrated = 0

    const allAccounts = await ctx.db.query('accounts').collect()
    for (const item of allAccounts) {
      if (!item.userId) {
        await ctx.db.patch(item._id, { userId } as any)
        migrated++
      }
    }

    const allCategories = await ctx.db.query('categories').collect()
    for (const item of allCategories) {
      if (!item.userId) {
        await ctx.db.patch(item._id, { userId } as any)
        migrated++
      }
    }

    const allPaymentMethods = await ctx.db.query('paymentMethods').collect()
    for (const item of allPaymentMethods) {
      if (!item.userId) {
        await ctx.db.patch(item._id, { userId } as any)
        migrated++
      }
    }

    const allBudgets = await ctx.db.query('budgets').collect()
    for (const item of allBudgets) {
      if (!item.userId) {
        await ctx.db.patch(item._id, { userId } as any)
        migrated++
      }
    }

    const allCreditCards = await ctx.db.query('creditCards').collect()
    for (const item of allCreditCards) {
      if (!item.userId) {
        await ctx.db.patch(item._id, { userId } as any)
        migrated++
      }
    }

    const allGoals = await ctx.db.query('goals').collect()
    for (const item of allGoals) {
      if (!item.userId) {
        await ctx.db.patch(item._id, { userId } as any)
        migrated++
      }
    }

    const allMovements = await ctx.db.query('movements').collect()
    for (const item of allMovements) {
      if (!item.userId) {
        await ctx.db.patch(item._id, { userId } as any)
        migrated++
      }
    }

    return migrated
  },
})
