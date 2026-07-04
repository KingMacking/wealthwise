import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

const subcategorySchema = v.object({ id: v.string(), name: v.string() })

function addId<T extends { _id: unknown }>(doc: T): T & { id: string } {
  return { ...doc, id: doc._id as string }
}

export const getAll = query({
  handler: async (ctx) => {
    const items = await ctx.db.query('categories').collect()
    return items.map(addId)
  },
})

export const getById = query({
  args: { id: v.id('categories') },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id)
    return doc ? addId(doc) : null
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    monthlyBudget: v.optional(v.number()),
    subcategories: v.optional(v.array(subcategorySchema)),
    order: v.optional(v.number()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('categories', {
      name: args.name,
      icon: args.icon ?? 'Tag',
      color: args.color ?? '#3b82f6',
      monthlyBudget: args.monthlyBudget,
      subcategories: args.subcategories ?? [],
      order: args.order ?? 0,
      active: args.active ?? true,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('categories'),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    monthlyBudget: v.optional(v.number()),
    subcategories: v.optional(v.array(subcategorySchema)),
    order: v.optional(v.number()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    await ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id('categories') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const deleteAll = mutation({
  handler: async (ctx) => {
    const items = await ctx.db.query('categories').collect()
    for (const item of items) {
      await ctx.db.delete(item._id)
    }
  },
})
