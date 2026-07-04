import { query } from './_generated/server'

export const whoami = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return { authenticated: false, reason: 'no identity' }
    return {
      authenticated: true,
      tokenIdentifier: identity.tokenIdentifier,
      subject: identity.subject,
      email: identity.email,
      name: identity.name,
    }
  },
})
