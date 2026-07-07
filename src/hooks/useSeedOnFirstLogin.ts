import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/api'

export function useSeedOnFirstLogin() {
  const { isSignedIn, isLoaded } = useAuth()
  const hasData = useQuery(api.hasData.hasData)
  const seedDefaultData = useMutation(api.seed.seedDefaultData)
  const seeded = useRef(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || seeded.current) return
    if (hasData === undefined) return

    seeded.current = true

    if (!hasData.hasData) {
      seedDefaultData()
    }
  }, [isLoaded, isSignedIn, hasData, seedDefaultData])
}
