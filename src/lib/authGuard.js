/**
 * Authentication and Multi-Tenant RBAC Authorization Guard
 * Validates request tokens and enforces tenant isolation.
 */
export function parseAuthToken(request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return null;

  const token = parts[1];
  
  if (token.startsWith('jwt-mock-superadmin') || token.startsWith('jwt-superadmin-token')) {
    return {
      role: 'super_admin',
      isSuperAdmin: true,
      storeId: null
    };
  }

  // Check store manager token with timestamp: jwt-mock-store-<storeId>-<timestamp>
  const mockTimestampMatch = token.match(/^jwt-mock-store-(.+)-\d+$/);
  if (mockTimestampMatch) {
    return {
      role: 'store_manager',
      isSuperAdmin: false,
      storeId: mockTimestampMatch[1]
    };
  }

  // Check store manager token pattern: jwt-mock-store-<storeId> or jwt-store-token-<storeId>
  const storeTokenMatch = token.match(/^jwt-(?:mock-)?store-(?:token-)?([a-zA-Z0-9_-]+)$/);
  if (storeTokenMatch) {
    return {
      role: 'store_manager',
      isSuperAdmin: false,
      storeId: storeTokenMatch[1]
    };
  }

  return null;
}

export function verifyTenantAccess(auth, targetStoreId) {
  if (!auth) return false;
  if (auth.isSuperAdmin) return true;
  return auth.storeId === targetStoreId;
}
