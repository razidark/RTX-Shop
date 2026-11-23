export const NEW_ORDER_STATUS = 'PENDING';

export class OrderValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OrderValidationError';
  }
}

/**
 * Normalize the requested items into a safe shape.
 * Rejects non-positive, fractional or unparsable quantities.
 */
export function normalizeRequestedItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new OrderValidationError('O pedido deve conter pelo menos um item');
  }

  return items.map((item) => {
    const productId = String(item?.productId ?? item?.id ?? '').trim();
    if (!productId) {
      throw new OrderValidationError('Cada item do pedido deve informar um produto');
    }

    const rawQuantity = Number(item?.quantity);
    if (!Number.isInteger(rawQuantity) || rawQuantity < 1) {
      throw new OrderValidationError('A quantidade de cada item deve ser um número inteiro maior que zero');
    }

    return { productId, quantity: rawQuantity };
  });
}

/**
 * Build order lines from server-side product records.
 * The client-supplied price is never trusted.
 */
export function buildOrderLines(requestedItems, products) {
  const lines = [];

  for (const { productId, quantity } of requestedItems) {
    const product = products.find((candidate) => candidate.id === productId);
    if (!product) {
      throw new OrderValidationError(`Produto ${productId} não existe`);
    }

    if (typeof product.stock === 'number' && product.stock < quantity) {
      throw new OrderValidationError(`Estoque insuficiente para ${product.name}`);
    }

    lines.push({
      productId,
      quantity,
      price: product.price,
      stock: product.stock,
    });
  }

  return lines;
}

/**
 * Compute the order total from the server-side prices.
 */
export function computeOrderTotal(lines) {
  return lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

/**
 * Compute the stock remaining after the order, never below zero.
 */
export function computeRemainingStock(stock, quantity) {
  return Math.max(0, stock - quantity);
}

/**
 * Discount rules.
 *
 * These existed only in the browser (src/pages/Checkout.jsx), so the UI
 * showed a discounted price that the server never charged -- the customer
 * saw 25% off and was billed the full amount. The rules live here so both
 * sides compute the same total.
 */
export const COUPON_DISCOUNTS = {
  RTX2026: 0.10,
};

export const PIX_DISCOUNT = 0.15;

/**
 * Apply the coupon and payment-method discounts to a subtotal.
 * Unknown coupons are ignored (the client rejects them separately).
 */
export function computeOrderTotalWithDiscounts(subtotal, { coupon, paymentMethod } = {}) {
  const base = Number(subtotal) || 0;

  const couponRate = coupon ? (COUPON_DISCOUNTS[String(coupon).trim().toUpperCase()] ?? 0) : 0;
  const afterCoupon = base - base * couponRate;

  const pixRate = String(paymentMethod).toLowerCase() === 'pix' ? PIX_DISCOUNT : 0;
  const finalTotal = afterCoupon - afterCoupon * pixRate;

  // Round to cents so the server total and the displayed total match
  // exactly instead of differing by a floating-point fraction.
  return Math.round(finalTotal * 100) / 100;
}

/**
 * Whether a coupon code is known.
 */
export function isValidCoupon(coupon) {
  return Object.prototype.hasOwnProperty.call(
    COUPON_DISCOUNTS,
    String(coupon ?? '').trim().toUpperCase()
  );
}
