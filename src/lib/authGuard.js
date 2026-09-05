/**
 * Authentication and Multi-Tenant RBAC Authorization Guard
 * Valida tokens firmados (AES-256-GCM) y blinda el aislamiento de tenants.
 * Solo se ejecuta en el servidor (API Routes).
 */
import { verifyToken } from './tokenSigner';

export function parseAuthToken(request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return null;

  const token = parts[1];
  const payload = verifyToken(token);
  if (!payload) return null;

  if (payload.role === 'superadmin') {
    return {
      role: 'superadmin',
      isSuperAdmin: true,
      storeId: null,
      name: payload.name || null,
      email: payload.email || null,
    };
  }

  if (payload.role === 'store_manager' && payload.storeId) {
    return {
      role: 'store_manager',
      isSuperAdmin: false,
      storeId: payload.storeId,
      name: payload.name || null,
      email: payload.email || null,
    };
  }

  return null;
}

export function verifyTenantAccess(auth, targetStoreId) {
  if (!auth) return false;
  if (auth.isSuperAdmin) return true;
  return auth.storeId === targetStoreId;
}

export function isSuperAdminAuth(auth) {
  return Boolean(auth?.isSuperAdmin);
}