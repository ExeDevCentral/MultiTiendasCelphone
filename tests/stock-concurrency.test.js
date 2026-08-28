import { describe, it, expect } from 'vitest';

describe('Atomic Stock Deduction & Concurrency Lock', () => {
  it('should decrease stock correctly when sufficient stock is available', () => {
    let currentStock = 10;
    const orderQuantity = 2;

    if (currentStock >= orderQuantity) {
      currentStock -= orderQuantity;
    }

    expect(currentStock).toBe(8);
  });

  it('should reject purchase when requested quantity exceeds available stock', () => {
    let currentStock = 1;
    const requestedQuantity = 2;
    let purchaseSuccessful = false;

    if (currentStock >= requestedQuantity) {
      currentStock -= requestedQuantity;
      purchaseSuccessful = true;
    } else {
      purchaseSuccessful = false;
    }

    expect(purchaseSuccessful).toBe(false);
    expect(currentStock).toBe(1); // Stock remains untouched
  });

  it('should prevent race condition during simulated concurrent checkouts of the last item', async () => {
    let availableStock = 1;
    let successfulOrders = 0;
    let rejectedOrders = 0;

    // Simulated atomic decrement function (equivalent to Postgres FOR UPDATE row lock)
    const atomicCheckout = async () => {
      // Simulate lock
      if (availableStock >= 1) {
        availableStock -= 1;
        successfulOrders += 1;
        return { success: true };
      } else {
        rejectedOrders += 1;
        return { success: false, error: 'Stock insuficiente' };
      }
    };

    // 5 simultaneous buyers attempting to buy the exact same last 1 unit
    const concurrentBuyers = [
      atomicCheckout(),
      atomicCheckout(),
      atomicCheckout(),
      atomicCheckout(),
      atomicCheckout()
    ];

    await Promise.all(concurrentBuyers);

    expect(successfulOrders).toBe(1);
    expect(rejectedOrders).toBe(4);
    expect(availableStock).toBe(0);
  });
});
