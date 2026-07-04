import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { matchesUserId } from './userId'

function addId<T extends { _id: unknown }>(doc: T): T & { id: string } {
  return { ...doc, id: doc._id as string }
}

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []
    const userId = identity.tokenIdentifier
    const items = await ctx.db.query('goals').collect()
    return items.filter((a) => matchesUserId(a.userId, userId)).map(addId)
  },
})

export const getById = query({
  args: { id: v.id('goals') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null
    const doc = await ctx.db.get(args.id)
    if (!doc) return null
    if (!matchesUserId(doc.userId, identity.tokenIdentifier)) return null
    return addId(doc)
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    targetAmount: v.number(),
    currentAmount: v.optional(v.number()),
    targetDate: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    return await ctx.db.insert('goals', {
      name: args.name,
      targetAmount: args.targetAmount,
      currentAmount: args.currentAmount ?? 0,
      targetDate: args.targetDate,
      icon: args.icon ?? 'Target',
      color: args.color ?? '#3b82f6',
      userId: identity.tokenIdentifier,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('goals'),
    name: v.optional(v.string()),
    targetAmount: v.optional(v.number()),
    currentAmount: v.optional(v.number()),
    targetDate: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const existing = await ctx.db.get(args.id)
    if (!existing) throw new Error('Not found')
    if (!matchesUserId(existing.userId, identity.tokenIdentifier)) throw new Error('Not found')
    const { id, ...fields } = args
    await ctx.db.patch(id, fields)
  },
})

export const deposit = mutation({
  args: {
    id: v.id('goals'),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const goal = await ctx.db.get(args.id)
    if (!goal) throw new Error('Goal not found')
    if (!matchesUserId(goal.userId, identity.tokenIdentifier)) throw new Error('Goal not found')
    await ctx.db.patch(args.id, {
      currentAmount: goal.currentAmount + args.amount,
    })
  },
})

export const remove = mutation({
  args: { id: v.id('goals') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const existing = await ctx.db.get(args.id)
    if (!existing) throw new Error('Not found')
    if (!matchesUserId(existing.userId, identity.tokenIdentifier)) throw new Error('Not found')
    await ctx.db.delete(args.id)
  },
})

export const deleteAll = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const userId = identity.tokenIdentifier
    const items = await ctx.db.query('goals').collect()
    for (const item of items) {
      if (matchesUserId(item.userId, userId)) {
        await ctx.db.delete(item._id)
      }
    }
  },
})
