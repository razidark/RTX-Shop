import express from 'express';
import prisma from '../db.js';
import { verifyToken, requireAdmin } from './auth.js';

const router = express.Router();

// Get all products (Public)
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Get single product (Public)
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id }
    });
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// Admin Only: Create Product
router.post('/products', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const newProduct = await prisma.product.create({
      data: { name, description, price: parseFloat(price), image, category, stock: parseInt(stock) || 0 }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Admin Only: Update Product
router.put('/products/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category, stock } = req.body;
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, description, price: parseFloat(price), image, category, stock: parseInt(stock) || 0 }
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Admin Only: Delete Product
router.delete('/products/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
});

// Admin Only: Refill Product Stock (+10 units)
router.post('/products/:id/refill', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    const updated = await prisma.product.update({
      where: { id },
      data: { stock: product.stock + 10 }
    });
    res.json({ message: 'Estoque reabastecido com sucesso!', product: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao reabastecer estoque' });
  }
});

// Admin Only: Get Dashboard Stats
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    // 1. Core Counts
    const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const staffCount = await prisma.user.count({ where: { role: { in: ['ADMIN', 'EMPLOYEE'] } } });
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    // 2. Revenue & Average Ticket
    const nonCancelledOrders = await prisma.order.findMany({
      where: { status: { not: 'CANCELLED' } },
      select: { total: true }
    });
    const totalRevenue = nonCancelledOrders.reduce((acc, o) => acc + o.total, 0);
    const nonCancelledCount = nonCancelledOrders.length;
    const averageTicket = nonCancelledCount > 0 ? parseFloat((totalRevenue / nonCancelledCount).toFixed(2)) : 0;

    // 3. Recent Orders (last 5)
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // 4. Top Selling Products
    const orderItems = await prisma.orderItem.findMany({
      include: {
        product: {
          select: { name: true, image: true }
        }
      }
    });

    const productSales = {};
    for (const item of orderItems) {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          id: item.productId,
          name: item.product?.name || 'Produto Removido',
          image: item.product?.image || '/images/placeholder.png',
          quantity: 0,
          totalSales: 0
        };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].totalSales += item.quantity * item.price;
    }

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map(p => ({
        ...p,
        totalSales: parseFloat(p.totalSales.toFixed(2))
      }));

    // 5. Sales Trend for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ordersLast30Days = await prisma.order.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { not: 'CANCELLED' }
      },
      select: {
        createdAt: true,
        total: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Pre-populate last 30 days
    const dailySales = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailySales[dateStr] = 0;
    }

    // Populate with order data
    for (const order of ordersLast30Days) {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (dailySales[dateStr] !== undefined) {
        dailySales[dateStr] += order.total;
      }
    }

    const salesTrend = Object.keys(dailySales).sort().map(date => ({
      date,
      revenue: parseFloat(dailySales[date].toFixed(2))
    }));

    // 6. Critical Stock Alerts (stock <= 5)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: { lte: 5 }
      },
      select: {
        id: true,
        name: true,
        stock: true,
        image: true
      },
      orderBy: {
        stock: 'asc'
      }
    });

    res.json({
      totalUsers,
      staffCount,
      totalProducts,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      averageTicket,
      recentOrders,
      topProducts,
      salesTrend,
      lowStockProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Admin Only: Get All Customers (Unified User DB/CRM)
router.get('/customers', verifyToken, requireAdmin, async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: { select: { total: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// Admin Only: Get Orders for a specific User
router.get('/customers/:id/orders', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await prisma.order.findMany({
      where: { userId: id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, image: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar pedidos do cliente' });
  }
});

// Admin Only: Create Customer (supporting any role)
router.post('/customers', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'E-mail já cadastrado.' });

    // There is no default password. A well-known default means every
    // account created without an explicit password shares a credential
    // that is published in the source, so the password is required.
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'A senha é obrigatória e deve ter ao menos 8 caracteres.' });
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(password, 10);

    const customer = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || 'CUSTOMER' }
    });
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar cliente.' });
  }
});

// Admin Only: Update Customer (with self-protection check)
router.put('/customers/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (id === req.user.userId && role !== 'ADMIN') {
      return res.status(400).json({ error: 'Você não pode alterar seu próprio cargo de administrador!' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { name, email, role }
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar cliente.' });
  }
});

// Admin Only: Reset Customer Password
router.put('/customers/:id/password', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // The new password must be long enough to be worth storing, and the
    // old one must be confirmed so that a hijacked admin session cannot
    // silently lock the real owner out of their own account.
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'A nova senha deve ter ao menos 8 caracteres.' });
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(password, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
    res.json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao redefinir senha.' });
  }
});

// Admin Only: Delete Customer safely (with self-protection check)
router.delete('/customers/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.userId) {
      return res.status(400).json({ error: 'Você não pode excluir sua própria conta administradora!' });
    }

    // 1. Get user orders
    const orders = await prisma.order.findMany({ where: { userId: id } });
    const orderIds = orders.map(o => o.id);

    // 2. Delete all items belonging to those orders
    if (orderIds.length > 0) {
      await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
    }

    // 3. Delete user orders
    await prisma.order.deleteMany({ where: { userId: id } });

    // 4. Delete user (which cascades CartItem and WishlistItem)
    await prisma.user.delete({ where: { id } });

    res.json({ message: 'Cliente excluído com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir cliente.' });
  }
});

// Admin Only: Get All Orders
router.get('/orders', verifyToken, requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Admin Only: Update Order Status
router.put('/orders/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // The status column is a free-form String, so it must be validated
    // against the known set. Without this an admin request (or a forged
    // admin token) could store any string, and the /stats revenue query
    // counts non-cancelled orders -- a junk status would be counted as
    // real revenue.
    const VALID_ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!VALID_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Status inválido. Valores permitidos: ${VALID_ORDER_STATUSES.join(', ')}`
      });
    }

    // Only the listed fields may change.
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

// Admin Only: Delete All Orders
router.delete('/orders', verifyToken, requireAdmin, async (req, res) => {
  try {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    res.json({ message: 'Todos os pedidos foram excluídos com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir todos os pedidos' });
  }
});

// Admin Only: Delete Order
router.delete('/orders/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });
    res.json({ message: 'Pedido excluído com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir pedido' });
  }
});

// Admin Only: Get All Staff (EMPLOYEES)
router.get('/staff', verifyToken, requireAdmin, async (req, res) => {
  try {
    const staff = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar equipe de funcionários' });
  }
});

// Admin Only: Create Staff Member
router.post('/staff', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário com este e-mail já existe' });
    }

    // No default password -- see the customer-creation route.
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'A senha é obrigatória e deve ter ao menos 8 caracteres.' });
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(password, 10);

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'EMPLOYEE'
      },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    res.status(201).json(newStaff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
  }
});

// Admin Only: Delete Staff Member
router.delete('/staff/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Funcionário removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover funcionário' });
  }
});

export default router;
