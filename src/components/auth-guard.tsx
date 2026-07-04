import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { Loader2 } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
}
