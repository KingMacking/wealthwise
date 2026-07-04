import { SignIn } from '@clerk/clerk-react'
import { APP_NAME } from '@/lib/constants'
import { dark } from '@clerk/themes'
import { useThemeStore } from '@/store/theme.store'

export default function AuthPage() {
  const resolved = useThemeStore((s) => s.resolved)
  const isDark = resolved === 'dark'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
          W
        </div>
        <h1 className="text-xl font-semibold tracking-tight">{APP_NAME}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Iniciá sesión para acceder a tus finanzas
        </p>
      </div>

      <SignIn
        appearance={{
          baseTheme: isDark ? dark : undefined,
          elements: {
            card: 'shadow-none',
            formButtonPrimary: 'bg-primary hover:bg-primary/90',
            footerActionLink: 'text-primary hover:text-primary/90',
          },
        }}
      />
    </div>
  )
}
