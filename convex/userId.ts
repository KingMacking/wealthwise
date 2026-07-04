export function matchesUserId(userId: string | undefined, tokenIdentifier: string | undefined): boolean {
  if (tokenIdentifier === undefined) return true
  if (userId === undefined) return true
  if (userId === tokenIdentifier) return true
  const suffix = tokenIdentifier.split(/[/|]/).pop()
  return suffix !== undefined && suffix === userId
}
