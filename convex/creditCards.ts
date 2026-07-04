import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

function addId<T extends { _id: unknown }>(doc: T): T & { id: string } {
  return { ...doc, id: doc._id as string }
}

export const getAll = query({
  handler: async (ctx) => {
    const items = await ctx.db.query('creditCards').collect()
    return items.map(addId)
  },
})

export const getById = query({
  args: { id: v.id('creditCards') },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id)
    return doc ? addId(doc) : null
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    limit: v.number(),
    closingDay: v.number(),
    dueDay: v.number(),
    balance: v.optional(v.number()),
    currentConsumption: v.optional(v.number()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('creditCards', {
      name: args.name,
      limit: args.limit,
      closingDay: args.closingDay,
      dueDay: args.dueDay,
      balance: args.balance ?? 0,
      currentConsumption: args.currentConsumption ?? 0,
      color: args.color ?? '#3b82f6',
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('creditCards'),
    name: v.optional(v.string()),
    limit: v.optional(v.number()),
    closingDay: v.optional(v.number()),
    dueDay: v.optional(v.number()),
    balance: v.optional(v.number()),
    currentConsumption: v.optional(v.number()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    await ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id('creditCards') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const deleteAll = mutation({
  handler: async (ctx) => {
    const items = await ctx.db.query('creditCards').collect()
    for (const item of items) {
      await ctx.db.delete(item._id)
    }
  },
})
