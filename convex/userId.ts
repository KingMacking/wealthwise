export function matchesUserId(userId: string | undefined, tokenIdentifier: string): boolean {
  if (userId === undefined) return true
  if (userId === tokenIdentifier) return true
  const suffix = tokenIdentifier.split('/').pop()
  return suffix !== undefined && suffix === userId
}
