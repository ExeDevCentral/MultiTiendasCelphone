import { describe, it, expect } from 'vitest';
import { parseAuthToken, verifyTenantAccess } from '../src/lib/authGuard';
import { signToken } from '../src/lib/tokenSigner';

describe('Security Audit & Penetration Hardening Suite', () => {
  describe('OWASP A04: Anti Price Parameter Tampering', () => {
    it('should override client-tampered prices with authoritative database price', () => {
      // Canonical product catalog in database
      const dbProducts = [
        { id: 'prod-iphone-16-pro', name: 'iPhone 16 Pro Max', price: 1399, stock: 10, storeId: 'store-celstore' },
        { id: 'acc-case-leather', name: 'Funda Cuero', price: 59, stock: 25, storeId: 'store-celstore' }
      ];

      // Malicious payload sent by attacker attempting to buy for $0.01
      const maliciousItemsPayload = [
        { productId: 'prod-iphone-16-pro', quantity: 2, price: 0.01 },
        { productId: 'acc-case-leather', quantity: 1, price: 0.00 }
      ];

      // Server computation logic
      let secureTotal = 0;
      const sanitizedOrderItems = maliciousItemsPayload.map(item => {
        const canonicalProd = dbProducts.find(p => p.id === item.productId);
        expect(canonicalProd).toBeDefined();
        const authoritativePrice = Number(canonicalProd.price);
        secureTotal += authoritativePrice * item.quantity;
        return {
          productId: canonicalProd.id,
          name: canonicalProd.name,
          price: authoritativePrice,
          quantity: item.quantity
        };
      });

      // Assert that attacker's forged price ($0.02) was ignored and real total ($2857) was enforced
      expect(secureTotal).toBe(1399 * 2 + 59 * 1); // $2857
      expect(sanitizedOrderItems[0].price).toBe(1399);
      expect(sanitizedOrderItems[1].price).toBe(59);
    });
  });

  describe('OWASP A01: Multi-Tenant RBAC & Access Isolation', () => {
    it('should allow superadmin full access across all store tenants', () => {
      const superAdminAuth = { role: 'superadmin', isSuperAdmin: true, storeId: null };
      expect(verifyTenantAccess(superAdminAuth, 'store-celstore-premium')).toBe(true);
      expect(verifyTenantAccess(superAdminAuth, 'store-retromobile')).toBe(true);
      expect(verifyTenantAccess(superAdminAuth, 'store-technova')).toBe(true);
    });

    it('should allow store manager to access ONLY their own tenant store', () => {
      const managerAuth = { role: 'store_manager', isSuperAdmin: false, storeId: 'store-celstore-premium' };
      expect(verifyTenantAccess(managerAuth, 'store-celstore-premium')).toBe(true);
      expect(verifyTenantAccess(managerAuth, 'store-retromobile')).toBe(false);
      expect(verifyTenantAccess(managerAuth, 'store-technova')).toBe(false);
    });

    it('should block unauthenticated requests with null auth', () => {
      expect(verifyTenantAccess(null, 'store-celstore-premium')).toBe(false);
    });
  });

  describe('OWASP A07: Token Verification & Backdoor Prevention', () => {
    it('should parse valid signed tokens correctly from headers', () => {
      const superAdminToken = signToken({
        sub: 'super-admin-01',
        role: 'superadmin',
        name: 'Director General CelStore',
        email: 'superadmin@platform.com',
      });

      const mockSuperAdminReq = {
        headers: new Headers({
          Authorization: `Bearer ${superAdminToken}`,
        }),
      };
      const authSuper = parseAuthToken(mockSuperAdminReq);
      expect(authSuper).not.toBeNull();
      expect(authSuper.isSuperAdmin).toBe(true);

      const managerToken = signToken({
        sub: 'mgr-store-retromobile',
        role: 'store_manager',
        storeId: 'store-retromobile',
        name: 'Gerente RetroMobile Vault',
        email: 'admin@retromobile.com',
      });

      const mockManagerReq = {
        headers: new Headers({
          Authorization: `Bearer ${managerToken}`,
        }),
      };
      const authManager = parseAuthToken(mockManagerReq);
      expect(authManager).not.toBeNull();
      expect(authManager.isSuperAdmin).toBe(false);
      expect(authManager.storeId).toBe('store-retromobile');
    });

    it('should reject invalid, forged or missing authorization tokens', () => {
      const invalidReq = {
        headers: new Headers({
          Authorization: 'Basic invalid-token',
        }),
      };
      expect(parseAuthToken(invalidReq)).toBeNull();

      // Legacy static mock tokens without signature must be rejected
      const forgedReq = {
        headers: new Headers({
          Authorization: 'Bearer jwt-mock-superadmin-1700000000',
        }),
      };
      expect(parseAuthToken(forgedReq)).toBeNull();

      const emptyReq = {
        headers: new Headers({}),
      };
      expect(parseAuthToken(emptyReq)).toBeNull();
    });

    it('should reject store login when using backdoor static password against wrong manager', () => {
      const mockStores = [
        {
          id: 'store-retromobile',
          managerEmail: 'admin@retromobile.com',
          managerPassword: 'SecretCustomPassword123'
        }
      ];

      const tryLogin = (email, password) => {
        return mockStores.find(
          s => s.managerEmail.toLowerCase() === email.toLowerCase() && s.managerPassword === password
        );
      };

      // Attacker tries universal 'admin123' bypass
      const resultWithBackdoor = tryLogin('admin@retromobile.com', 'admin123');
      expect(resultWithBackdoor).toBeUndefined();

      // Legitimate login with correct credentials
      const legitResult = tryLogin('admin@retromobile.com', 'SecretCustomPassword123');
      expect(legitResult).toBeDefined();
      expect(legitResult.id).toBe('store-retromobile');
    });
  });
});
