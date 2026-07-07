import { mutation } from './_generated/server'

export const seedDefaultData = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const userId = identity.tokenIdentifier

    const existingCategories = await ctx.db.query('categories').collect()
    if (existingCategories.some((c) => c.userId === userId)) return { seeded: false, reason: 'categories exist' }

    const existingPaymentMethods = await ctx.db.query('paymentMethods').collect()
    if (existingPaymentMethods.some((pm) => pm.userId === userId)) return { seeded: false, reason: 'payment methods exist' }

    const categories = [
      { name: 'Comida y Supermercado', icon: 'UtensilsCrossed', color: '#ef4444' },
      { name: 'Transporte', icon: 'Car', color: '#f97316' },
      { name: 'Servicios', icon: 'Zap', color: '#f59e0b' },
      { name: 'Alquiler', icon: 'Home', color: '#eab308' },
      { name: 'Salud', icon: 'HeartPulse', color: '#22c55e' },
      { name: 'Educación', icon: 'GraduationCap', color: '#3b82f6' },
      { name: 'Entretenimiento', icon: 'Film', color: '#a855f7' },
      { name: 'Indumentaria', icon: 'Tshirt', color: '#ec4899' },
      { name: 'Viajes', icon: 'Plane', color: '#0ea5e9' },
      { name: 'Ahorro', icon: 'PiggyBank', color: '#10b981' },
      { name: 'Ingresos', icon: 'TrendingUp', color: '#84cc16' },
      { name: 'Otros', icon: 'MoreHorizontal', color: '#64748b' },
    ]

    const paymentMethods = [
      { name: 'Efectivo', icon: 'DollarSign' },
      { name: 'Débito', icon: 'CreditCard' },
      { name: 'Crédito', icon: 'CreditCard' },
      { name: 'QR', icon: 'QrCode' },
    ]

    for (const cat of categories) {
      await ctx.db.insert('categories', {
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        subcategories: [],
        order: 0,
        active: true,
        userId,
      })
    }

    for (const pm of paymentMethods) {
      await ctx.db.insert('paymentMethods', {
        name: pm.name,
        icon: pm.icon,
        userId,
      })
    }

    return { seeded: true }
  },
})
