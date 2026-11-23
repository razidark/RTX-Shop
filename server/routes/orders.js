import express from 'express';
import prisma from '../db.js';
import { verifyToken } from './auth.js';
import {
  NEW_ORDER_STATUS,
  OrderValidationError,
  buildOrderLines,
  computeOrderTotal,
  computeOrderTotalWithDiscounts,
  isValidCoupon,
  normalizeRequestedItems,
} from '../security/orderPolicy.js';

const router = express.Router();

// Get order history for authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de pedidos' });
  }
});

// Create a new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { address, items, coupon, paymentMethod } = req.body;

    // Prices, totals and status are always derived server-side.
    const requestedItems = normalizeRequestedItems(items);
    const productIds = [...new Set(requestedItems.map((item) => item.productId))];

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const lines = buildOrderLines(requestedItems, products);
    const subtotal = computeOrderTotal(lines);

    // The coupon and the PIX discount used to be applied only in the
    // browser, so the customer was shown a discounted price and charged
    // the full amount. The rules now live in orderPolicy.js and are
    // applied to the server-side subtotal.
    if (coupon && !isValidCoupon(coupon)) {
      return res.status(400).json({ error: 'Cupom inválido' });
    }
    const total = computeOrderTotalWithDiscounts(subtotal, { coupon, paymentMethod });

    // Use Prisma transaction to create order, items and update stocks
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const order = await tx.order.create({
        data: {
          userId: req.user.userId,
          total,
          address: address || 'Retirada na Loja',
          status: NEW_ORDER_STATUS
        }
      });

      // 2. Create order items and decrement stocks
      for (const line of lines) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: line.productId,
            quantity: line.quantity,
            price: line.price
          }
        });

        // Decrement product stock atomically; guard against concurrent purchases
        const updatedProduct = await tx.product.updateMany({
          where: {
            id: line.productId,
            stock: { gte: line.quantity }
          },
          data: {
            stock: { decrement: line.quantity }
          }
        });

        if (updatedProduct.count === 0) {
          throw new OrderValidationError(`Estoque insuficiente durante a confirmação para o produto ID ${line.productId}`);
        }
      }

      // 3. Clear user's cart
      await tx.cartItem.deleteMany({
        where: { userId: req.user.userId }
      });

      return order;
    });

    res.status(201).json({ message: 'Pedido realizado com sucesso', order: newOrder });
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Erro ao processar o pedido' });
  }
});

export default router;
