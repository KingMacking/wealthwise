import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import type { Doc, Id } from './_generated/dataModel'
import { matchesUserId } from './userId'

function addId<T extends { _id: unknown }>(doc: T): T & { id: string } {
  return { ...doc, id: doc._id as string }
}

async function applyBalanceEffect(ctx: any, accountId: Id<'accounts'>, amount: number) {
  const account = await ctx.db.get(accountId)
  if (account) {
    await ctx.db.patch(accountId, { balance: account.balance + amount })
  }
}

type MovementEffect = Pick<Doc<'movements'>, 'type' | 'amount' | 'accountId' | 'destinationAccountId' | 'status'>

async function revertMovementEffect(ctx: any, movement: MovementEffect) {
  if (movement.status !== 'confirmed') return

  if (movement.type === 'income') {
    await applyBalanceEffect(ctx, movement.accountId, -movement.amount)
  } else if (movement.type === 'expense') {
    await applyBalanceEffect(ctx, movement.accountId, movement.amount)
  } else if (movement.type === 'transfer') {
    await applyBalanceEffect(ctx, movement.accountId, movement.amount)
    if (movement.destinationAccountId) {
      await applyBalanceEffect(ctx, movement.destinationAccountId, -movement.amount)
    }
  }
}

async function applyMovementEffect(ctx: any, movement: MovementEffect) {
  if (movement.status !== 'confirmed') return

  if (movement.type === 'income') {
    await applyBalanceEffect(ctx, movement.accountId, movement.amount)
  } else if (movement.type === 'expense') {
    await applyBalanceEffect(ctx, movement.accountId, -movement.amount)
  } else if (movement.type === 'transfer') {
    await applyBalanceEffect(ctx, movement.accountId, -movement.amount)
    if (movement.destinationAccountId) {
      await applyBalanceEffect(ctx, movement.destinationAccountId, movement.amount)
    }
  }
}

const movementFiltersSchema = v.object({
  type: v.optional(v.string()),
  categoryId: v.optional(v.id('categories')),
  subcategoryId: v.optional(v.string()),
  accountId: v.optional(v.id('accounts')),
  paymentMethodId: v.optional(v.id('paymentMethods')),
  status: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  search: v.optional(v.string()),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  minAmount: v.optional(v.number()),
  maxAmount: v.optional(v.number()),
  sortBy: v.optional(v.string()),
  sortOrder: v.optional(v.string()),
  page: v.optional(v.number()),
  limit: v.optional(v.number()),
})

export const getAll = query({
  args: { filters: v.optional(movementFiltersSchema) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = identity?.tokenIdentifier
    let items = await ctx.db.query('movements').collect()
    items = items.filter((m) => matchesUserId(m.userId, userId))

    const f = args.filters
    if (!f) return { data: items.map(addId), total: items.length }

    if (f.type) items = items.filter((m) => m.type === f.type)
    if (f.categoryId) items = items.filter((m) => m.categoryId === f.categoryId)
    if (f.subcategoryId) items = items.filter((m) => m.subcategoryId === f.subcategoryId)
    if (f.accountId) items = items.filter((m) => m.accountId === f.accountId)
    if (f.paymentMethodId) items = items.filter((m) => m.paymentMethodId === f.paymentMethodId)
    if (f.status) items = items.filter((m) => m.status === f.status)
    if (f.startDate) items = items.filter((m) => m.date >= f.startDate!)
    if (f.endDate) items = items.filter((m) => m.date <= f.endDate!)
    if (f.minAmount !== undefined) items = items.filter((m) => m.amount >= f.minAmount!)
    if (f.maxAmount !== undefined) items = items.filter((m) => m.amount <= f.maxAmount!)
    if (f.tags && f.tags.length > 0) items = items.filter((m) => f.tags!.some((t) => m.tags.includes(t)))
    if (f.search) {
      const q = f.search.toLowerCase()
      items = items.filter((m) => m.description.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q)))
    }

    const total = items.length

    const sortBy = f.sortBy as keyof typeof items[0] | undefined
    const sortOrder = f.sortOrder === 'asc' ? 1 : -1
    items.sort((a, b) => {
      if (sortBy === 'date') {
        return (new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime()) * sortOrder
      }
      if (sortBy) {
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        if (typeof aVal === 'number' && typeof bVal === 'number') return (bVal - aVal) * sortOrder
        if (typeof aVal === 'string' && typeof bVal === 'string') return String(aVal).localeCompare(String(bVal)) * sortOrder
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    if (f.page && f.limit) {
      const start = (f.page - 1) * f.limit
      items = items.slice(start, start + f.limit)
    }

    return { data: items.map(addId), total }
  },
})

export const getById = query({
  args: { id: v.id('movements') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const doc = await ctx.db.get(args.id)
    if (!doc) return null
    if (!matchesUserId(doc.userId, identity?.tokenIdentifier)) return null
    return addId(doc)
  },
})

export const getByDateRange = query({
  args: { startDate: v.string(), endDate: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = identity?.tokenIdentifier
    const all = await ctx.db.query('movements').collect()
    return all.filter((m) => matchesUserId(m.userId, userId) && m.date >= args.startDate && m.date <= args.endDate).map(addId)
  },
})

export const getByYear = query({
  args: { year: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = identity?.tokenIdentifier
    const all = await ctx.db.query('movements').collect()
    return all.filter((m) => {
      if (!matchesUserId(m.userId, userId)) return false
      const d = new Date(m.date)
      return d.getFullYear() === args.year
    }).map(addId)
  },
})

export const create = mutation({
  args: {
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
    tags: v.optional(v.array(v.string())),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const id = await ctx.db.insert('movements', {
      date: args.date,
      type: args.type,
      description: args.description,
      amount: args.amount,
      categoryId: args.categoryId,
      subcategoryId: args.subcategoryId,
      accountId: args.accountId,
      destinationAccountId: args.destinationAccountId,
      paymentMethodId: args.paymentMethodId,
      notes: args.notes,
      tags: args.tags ?? [],
      attachments: [],
      color: args.color ?? '#3b82f6',
      icon: args.icon ?? 'ArrowRight',
      status: args.status ?? 'confirmed',
      userId: identity.tokenIdentifier,
    })

    await applyMovementEffect(ctx, {
      type: args.type,
      amount: args.amount,
      accountId: args.accountId,
      destinationAccountId: args.destinationAccountId,
      status: args.status ?? 'confirmed',
    })

    return id
  },
})

export const update = mutation({
  args: {
    id: v.id('movements'),
    date: v.optional(v.string()),
    type: v.optional(v.string()),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
    categoryId: v.optional(v.id('categories')),
    subcategoryId: v.optional(v.string()),
    accountId: v.optional(v.id('accounts')),
    destinationAccountId: v.optional(v.id('accounts')),
    paymentMethodId: v.optional(v.id('paymentMethods')),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const old = await ctx.db.get(args.id)
    if (!old) throw new Error('Not found')
    if (!matchesUserId(old.userId, identity.tokenIdentifier)) throw new Error('Not found')

    await revertMovementEffect(ctx, old)

    const { id, ...fields } = args
    await ctx.db.patch(id, fields)

    const updated = await ctx.db.get(args.id)
    if (!updated) return

    await applyMovementEffect(ctx, updated)
  },
})

export const remove = mutation({
  args: { id: v.id('movements') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const movement = await ctx.db.get(args.id)
    if (!movement) throw new Error('Not found')
    if (!matchesUserId(movement.userId, identity.tokenIdentifier)) throw new Error('Not found')

    await revertMovementEffect(ctx, movement)
    await ctx.db.delete(args.id)
  },
})

export const deleteMany = mutation({
  args: { ids: v.array(v.id('movements')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    for (const id of args.ids) {
      const movement = await ctx.db.get(id)
      if (movement && matchesUserId(movement.userId, identity.tokenIdentifier)) {
        await revertMovementEffect(ctx, movement)
        await ctx.db.delete(id)
      }
    }
  },
})

export const deleteAll = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const userId = identity.tokenIdentifier
    const items = await ctx.db.query('movements').collect()
    for (const item of items) {
      if (matchesUserId(item.userId, userId)) {
        await revertMovementEffect(ctx, item)
        await ctx.db.delete(item._id)
      }
    }
  },
})
