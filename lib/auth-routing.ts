export function getAuthenticatedLandingPath(
  hasRelationshipMembership: boolean,
  requestedPath: string | null | undefined,
): string {
  if (!hasRelationshipMembership) {
    return '/onboarding'
  }

  if (
    requestedPath &&
    requestedPath.startsWith('/') &&
    !requestedPath.startsWith('//')
  ) {
    return requestedPath
  }

  return '/dashboard'
}
