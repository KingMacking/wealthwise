import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

function addId<T extends { _id: unknown }>(doc: T): T & { id: string } {
  return { ...doc, id: doc._id as string }
}

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []
    const userId = identity.tokenIdentifier
    const items = await ctx.db.query('budgets').collect()
    return items.filter((a) => a.userId === undefined || a.userId === userId).map(addId)
  },
})

export const getByMonth = query({
  args: { month: v.number(), year: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []
    const userId = identity.tokenIdentifier
    const items = await ctx.db
      .query('budgets')
      .withIndex('by_month_year', (q) => q.eq('month', args.month).eq('year', args.year))
      .collect()
    return items.filter((a) => a.userId === undefined || a.userId === userId).map(addId)
  },
})

export const create = mutation({
  args: {
    categoryId: v.id('categories'),
    subcategoryId: v.optional(v.string()),
    month: v.number(),
    year: v.number(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    return await ctx.db.insert('budgets', {
      ...args,
      userId: identity.tokenIdentifier,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('budgets'),
    categoryId: v.optional(v.id('categories')),
    subcategoryId: v.optional(v.string()),
    month: v.optional(v.number()),
    year: v.optional(v.number()),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const existing = await ctx.db.get(args.id)
    if (!existing) throw new Error('Not found')
    if (existing.userId !== undefined && existing.userId !== identity.tokenIdentifier) throw new Error('Not found')
    const { id, ...fields } = args
    await ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id('budgets') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const existing = await ctx.db.get(args.id)
    if (!existing) throw new Error('Not found')
    if (existing.userId !== undefined && existing.userId !== identity.tokenIdentifier) throw new Error('Not found')
    await ctx.db.delete(args.id)
  },
})

export const deleteAll = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const userId = identity.tokenIdentifier
    const items = await ctx.db.query('budgets').collect()
    for (const item of items) {
      if (item.userId === undefined || item.userId === userId) {
        await ctx.db.delete(item._id)
      }
    }
  },
})
