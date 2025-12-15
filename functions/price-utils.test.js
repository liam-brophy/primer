const assert = require('assert');
const { computeOrderAmounts } = require('./price-utils');

// Test default pricing
(() => {
  const res = computeOrderAmounts(1, false, '');
  assert.strictEqual(res.unitPrice, 2399);
  assert.strictEqual(res.amount, 2399);
  assert.strictEqual(res.shippingAmount, 499);
  assert.strictEqual(res.total, 2898);
  assert.strictEqual(res.discountApplied, false);
})();

// Test pickup (no shipping)
(() => {
  const res = computeOrderAmounts(2, true, '');
  assert.strictEqual(res.amount, 2399 * 2);
  assert.strictEqual(res.shippingAmount, 0);
  assert.strictEqual(res.total, 2399 * 2);
})();

// Test discount code (SPACE) - single copy
(() => {
  const res = computeOrderAmounts(1, false, 'SPACE');
  assert.strictEqual(res.unitPrice, 2000);
  assert.strictEqual(res.amount, 2000);
  assert.strictEqual(res.shippingAmount, 0);
  assert.strictEqual(res.total, 2000);
  assert.strictEqual(res.discountApplied, true);
  assert.strictEqual(res.discountCode, 'SPACE');
})();

// Test discount code case-insensitive and multiple quantity
(() => {
  const res = computeOrderAmounts(3, false, ' space ');
  assert.strictEqual(res.unitPrice, 2000);
  assert.strictEqual(res.amount, 2000 * 3);
  assert.strictEqual(res.shippingAmount, 0);
  assert.strictEqual(res.total, 2000 * 3);
})();

console.log('price-utils tests passed');
