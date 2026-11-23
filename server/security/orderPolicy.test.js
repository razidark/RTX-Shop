import test from 'node:test';
import assert from 'node:assert/strict';

import {
  NEW_ORDER_STATUS,
  OrderValidationError,
  buildOrderLines,
  computeOrderTotal,
  normalizeRequestedItems,
} from '../security/orderPolicy.js';

const products = [
  { id: 'p1', name: 'RTX 4090', price: 1999.9, stock: 5 },
  { id: 'p2', name: 'RTX 4080', price: 999.5, stock: 2 },
];

test('new orders always start as PENDING', () => {
  assert.equal(NEW_ORDER_STATUS, 'PENDING');
});

test('normalizeRequestedItems accepts productId + quantity', () => {
  const items = normalizeRequestedItems([{ productId: 'p1', quantity: 2 }]);
  assert.deepEqual(items, [{ productId: 'p1', quantity: 2 }]);
});

test('normalizeRequestedItems rejects empty item lists', () => {
  assert.throws(() => normalizeRequestedItems([]), OrderValidationError);
  assert.throws(() => normalizeRequestedItems(undefined), OrderValidationError);
});

test('normalizeRequestedItems rejects non-integer and non-positive quantities', () => {
  assert.throws(() => normalizeRequestedItems([{ productId: 'p1', quantity: 0 }]), OrderValidationError);
  assert.throws(() => normalizeRequestedItems([{ productId: 'p1', quantity: -3 }]), OrderValidationError);
  assert.throws(() => normalizeRequestedItems([{ productId: 'p1', quantity: 1.5 }]), OrderValidationError);
  assert.throws(() => normalizeRequestedItems([{ productId: 'p1', quantity: 'abc' }]), OrderValidationError);
});

test('normalizeRequestedItems rejects items without a product id', () => {
  assert.throws(() => normalizeRequestedItems([{ quantity: 1 }]), OrderValidationError);
});

test('buildOrderLines uses server-side prices, not client prices', () => {
  const requested = normalizeRequestedItems([{ productId: 'p1', quantity: 2 }]);
  const lines = buildOrderLines(requested, products);
  assert.equal(lines[0].price, 1999.9);
});

test('buildOrderLines rejects unknown products', () => {
  const requested = normalizeRequestedItems([{ productId: 'nope', quantity: 1 }]);
  assert.throws(() => buildOrderLines(requested, products), OrderValidationError);
});

test('buildOrderLines rejects orders beyond available stock', () => {
  const requested = normalizeRequestedItems([{ productId: 'p2', quantity: 5 }]);
  assert.throws(() => buildOrderLines(requested, products), OrderValidationError);
});

test('computeOrderTotal sums server-side price times quantity', () => {
  const requested = normalizeRequestedItems([
    { productId: 'p1', quantity: 2 },
    { productId: 'p2', quantity: 2 },
  ]);
  const lines = buildOrderLines(requested, products);
  assert.equal(computeOrderTotal(lines), 2 * 1999.9 + 2 * 999.5);
});
