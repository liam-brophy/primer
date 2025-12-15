// Simple test runner for price-utils
const assert = require('assert');
const { computeOrderAmounts } = require('../functions/price-utils');

// no discount, shipping (default unit price $23.99 = 2399 cents, shipping $4.99 = 499 cents)
let r = computeOrderAmounts(1, false, '')
assert.equal(r.unitPrice, 2399)
assert.equal(r.shippingAmount, 499)
assert.equal(r.total, 2399 + 499)

// pickup (no shipping)
r = computeOrderAmounts(2, true, '')
assert.equal(r.unitPrice, 2399)
assert.equal(r.shippingAmount, 0)
assert.equal(r.total, 2399 * 2)

// discount code SPACE should set to 2000 and free shipping
r = computeOrderAmounts(1, false, 'SPACE')
assert.equal(r.unitPrice, 2000)
assert.equal(r.shippingAmount, 0)
assert.equal(r.total, 2000)

console.log('price-utils tests passed')
