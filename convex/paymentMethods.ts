import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

function addId<T extends { _id: unknown }>(doc: T): T & { id: string } {
  return { ...doc, id: doc._id as string }
}

export const getAll = query({
  handler: async (ctx) => {
    const items = await ctx.db.query('paymentMethods').collect()
    return items.map(addId)
  },
})

export const getById = query({
  args: { id: v.id('paymentMethods') },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id)
    return doc ? addId(doc) : null
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('paymentMethods', {
      name: args.name,
      icon: args.icon ?? 'CreditCard',
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('paymentMethods'),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    await ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id('paymentMethods') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const deleteAll = mutation({
  handler: async (ctx) => {
    const items = await ctx.db.query('paymentMethods').collect()
    for (const item of items) {
      await ctx.db.delete(item._id)
    }
  },
})
