import express from 'express';
import prisma from '../db.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get cart items for authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.userId },
      include: { product: true }
    });

    // Format to match what frontend expects: product fields + quantity
    const formattedCart = cartItems.map(item => ({
      ...item.product,
      quantity: item.quantity
    }));

    res.json(formattedCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Erro ao buscar o carrinho' });
  }
});

// Add or increment item in cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId: rawProductId, quantity: rawQuantity = 1 } = req.body;
    const productId = rawProductId ? String(rawProductId) : undefined;

    if (!productId) {
      return res.status(400).json({ error: 'ID do produto é obrigatório' });
    }

    // The quantity must be a positive whole number. It arrived straight
    // from the request body, so a float, a negative value, a string or
    // NaN could be stored and used to drive the order total.
    const quantity = Number(rawQuantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Quantidade deve ser um número inteiro maior que zero' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Check if cart item already exists for user
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId
        }
      }
    });

    let resultItem;
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      // Check stock limit
      if (product.stock !== undefined && newQuantity > product.stock) {
        return res.status(400).json({ error: `Estoque insuficiente. Máximo disponível: ${product.stock}` });
      }

      resultItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true }
      });
    } else {
      // Check stock limit
      if (product.stock !== undefined && quantity > product.stock) {
        return res.status(400).json({ error: `Estoque insuficiente. Máximo disponível: ${product.stock}` });
      }

      resultItem = await prisma.cartItem.create({
        data: {
          userId: req.user.userId,
          productId,
          quantity
        },
        include: { product: true }
      });
    }

    res.json({
      message: 'Item adicionado ao carrinho',
      item: {
        ...resultItem.product,
        quantity: resultItem.quantity
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Erro ao adicionar item ao carrinho' });
  }
});

// Update cart item quantity by productId
router.put('/:productId', verifyToken, async (req, res) => {
  try {
    const productId = String(req.params.productId);
    const { quantity: rawQuantity } = req.body;

    // The quantity must be a positive whole number -- `quantity < 1` alone
    // let a float or a non-numeric value through.
    const quantity = Number(rawQuantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'A quantidade deve ser um número inteiro de pelo menos 1' });
    }

    // Check if cart item exists
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId
        }
      },
      include: { product: true }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }

    // Check stock limit
    if (existingItem.product.stock !== undefined && quantity > existingItem.product.stock) {
      return res.status(400).json({ error: `Estoque insuficiente. Máximo disponível: ${existingItem.product.stock}` });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity },
      include: { product: true }
    });

    res.json({
      ...updatedItem.product,
      quantity: updatedItem.quantity
    });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({ error: 'Erro ao atualizar quantidade no carrinho' });
  }
});

// Delete cart item by productId
router.delete('/:productId', verifyToken, async (req, res) => {
  try {
    const productId = String(req.params.productId);

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId
        }
      }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }

    await prisma.cartItem.delete({
      where: { id: existingItem.id }
    });

    res.json({ message: 'Item removido do carrinho' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Erro ao remover item do carrinho' });
  }
});

// Clear entire cart for authenticated user
router.delete('/', verifyToken, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.userId }
    });

    res.json({ message: 'Carrinho limpo com sucesso' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Erro ao limpar o carrinho' });
  }
});

export default router;
