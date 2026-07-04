import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

function addId<T extends { _id: unknown }>(doc: T): T & { id: string } {
  return { ...doc, id: doc._id as string }
}

export const getAll = query({
  handler: async (ctx) => {
    const items = await ctx.db.query('budgets').collect()
    return items.map(addId)
  },
})

export const getByMonth = query({
  args: { month: v.number(), year: v.number() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('budgets')
      .withIndex('by_month_year', (q) => q.eq('month', args.month).eq('year', args.year))
      .collect()
    return items.map(addId)
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
    return await ctx.db.insert('budgets', args)
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
    const { id, ...fields } = args
    await ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id('budgets') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const deleteAll = mutation({
  handler: async (ctx) => {
    const items = await ctx.db.query('budgets').collect()
    for (const item of items) {
      await ctx.db.delete(item._id)
    }
  },
})
