import { query } from './_generated/server'
import { matchesUserId } from './userId'

export const hasData = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const userId = identity?.tokenIdentifier

    const [categories, paymentMethods] = await Promise.all([
      ctx.db.query('categories').collect(),
      ctx.db.query('paymentMethods').collect(),
    ])

    const hasCategories = categories.some((c) => matchesUserId(c.userId, userId))
    const hasPaymentMethods = paymentMethods.some((pm) => matchesUserId(pm.userId, userId))

    return { hasData: hasCategories || hasPaymentMethods }
  },
})
