import express from 'express';
import prisma from '../db.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get wishlist items for authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: req.user.userId },
      include: { product: true }
    });

    // Format to return an array of product objects
    const formattedWishlist = wishlistItems.map(item => item.product);

    res.json(formattedWishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Erro ao buscar lista de desejos' });
  }
});

// Add item to wishlist
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId: rawProductId } = req.body;
    const productId = rawProductId ? String(rawProductId) : undefined;

    if (!productId) {
      return res.status(400).json({ error: 'ID do produto é obrigatório' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Check if item is already in wishlist
    const existingWishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId
        }
      }
    });

    if (existingWishlistItem) {
      return res.json({ message: 'Produto já está na lista de desejos', product });
    }

    await prisma.wishlistItem.create({
      data: {
        userId: req.user.userId,
        productId
      }
    });

    res.status(201).json({ message: 'Produto adicionado à lista de desejos', product });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Erro ao adicionar item à lista de desejos' });
  }
});

// Remove item from wishlist by productId
router.delete('/:productId', verifyToken, async (req, res) => {
  try {
    const productId = String(req.params.productId);

    const existingWishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId
        }
      }
    });

    if (!existingWishlistItem) {
      return res.status(404).json({ error: 'Item não encontrado na lista de desejos' });
    }

    await prisma.wishlistItem.delete({
      where: { id: existingWishlistItem.id }
    });

    res.json({ message: 'Produto removido da lista de desejos' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Erro ao remover item da lista de desejos' });
  }
});

export default router;
