// Utility to compute pricing and shipping with optional discount codes
const VALID_DISCOUNT_CODE = 'SPACE';

function computeOrderAmounts(quantity, isPickup, discountCode) {
  const qty = parseInt(quantity, 10) || 1;

  // default unit price in cents
  let unitPrice = 2399; // $23.99
  let discountApplied = false;

  if (typeof discountCode === 'string' && discountCode.trim().toUpperCase() === VALID_DISCOUNT_CODE) {
    // Discount makes Volume 1 $20.00 and free shipping
    unitPrice = 2000; // $20.00
    discountApplied = true;
  }

  const amount = unitPrice * qty;

  // shipping in cents - fixed $4.99 unless pickup or discount applies
  let shippingAmount = isPickup ? 0 : 499;
  if (discountApplied) shippingAmount = 0;

  const total = amount + shippingAmount;

  return {
    unitPrice,
    amount,
    shippingAmount,
    total,
    discountApplied,
    discountCode: discountApplied ? VALID_DISCOUNT_CODE : null
  };
}

module.exports = { computeOrderAmounts };