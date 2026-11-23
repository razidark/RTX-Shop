# RTX Shop

> A full-stack e-commerce storefront for PC hardware — catalogue, cart, wishlist,
> checkout with coupons, and a complete admin back office.

Built with React + Vite on the front and Express + Prisma (SQLite) on the back.

---

## Features

**Storefront**
- Product catalogue with filtering, a PC-builder page and product detail pages
- Cart with quantity management and stock enforcement
- Wishlist
- Checkout with coupon codes and a PIX payment discount
- Customer accounts with order history

**Admin back office**
- Manage products and stock
- Create and manage customers and staff
- View and update order status
- Revenue and order statistics

## Tech stack

| | |
|---|---|
| Client | React, React Router, Vite, lucide-react |
| Server | Express, Helmet, CORS, cookie-parser, JWT (httpOnly cookies) |
| Database | Prisma + SQLite |
| Auth | bcrypt password hashing, signed JWTs, rate-limited endpoints |
| Validation | Zod |

## Requirements

- Node.js 20+
- npm

## Getting started

```bash
npm install        # also runs `prisma generate`
npm run dev        # client -> http://127.0.0.1:5180
```

In a second terminal, start the API:

```bash
cd server
npm run dev        # API -> http://127.0.0.1:5000
```

The Vite dev server proxies `/api` to the backend, so open
**<http://127.0.0.1:5180/>**.

### Scripts

| Script | Does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | production build to `dist/` |
| `npm run lint` | ESLint |
| `npm test` | server security tests (`node --test`) |
| `npm run preview` | serve the production build |

## Environment

Copy `server/.env.example` to `server/.env` and fill it in:

```ini
DATABASE_URL="file:./dev.db"

# at least 32 characters. Generate one with:
#   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
JWT_SECRET=""
```

Both `server/.env` and `server/prisma/dev.db` are git-ignored — they are
machine-local and must never be committed.

### Database

```bash
cd server
npx prisma migrate dev --schema=prisma/schema.prisma
npx prisma studio  --schema=prisma/schema.prisma   # browse the data
```

Models: `User`, `Product`, `CartItem`, `WishlistItem`, `Order`, `OrderItem`.

## Security

- Passwords are bcrypt-hashed; no plaintext credential is ever stored
- Admin routes require a signed JWT with the `ADMIN` role, delivered in an
  `httpOnly` cookie
- Order status is validated against a fixed allowlist, and every price,
  total and discount is computed **server-side** from the product records —
  the client's totals are never trusted
- Cart quantities must be positive integers and are checked against stock
- Creating a customer or staff account requires an explicit password of at
  least 8 characters; there are no default passwords

## Credits

Built by **RZL Apps**.
