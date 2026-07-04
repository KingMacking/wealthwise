import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

function addId<T extends { _id: unknown }>(doc: T): T & { id: string } {
  return { ...doc, id: doc._id as string }
}

export const getAll = query({
  handler: async (ctx) => {
    const items = await ctx.db.query('accounts').collect()
    return items.map(addId)
  },
})

export const getById = query({
  args: { id: v.id('accounts') },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id)
    return doc ? addId(doc) : null
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    balance: v.optional(v.number()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('accounts', {
      name: args.name,
      balance: args.balance ?? 0,
      icon: args.icon ?? 'Landmark',
      color: args.color ?? '#3b82f6',
      type: args.type ?? 'checking',
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('accounts'),
    name: v.optional(v.string()),
    balance: v.optional(v.number()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    await ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id('accounts') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const deleteAll = mutation({
  handler: async (ctx) => {
    const items = await ctx.db.query('accounts').collect()
    for (const item of items) {
      await ctx.db.delete(item._id)
    }
  },
})
