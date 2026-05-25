# ESC Cafe — Backend API
Built with Node.js, Express, and MongoDB

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Fill in your values in `.env`:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any random secret string
- `PAYMONGO_SECRET_KEY` — from your PayMongo dashboard
- `PAYMONGO_PUBLIC_KEY` — from your PayMongo dashboard

### 3. Run the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Get current user (protected) |

### Menu
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/menu` | Get all menu items |
| GET | `/api/menu?category=Signature` | Filter by category |
| GET | `/api/menu/:id` | Get single item |
| POST | `/api/menu` | Add item (admin only) |
| PUT | `/api/menu/:id` | Update item (admin only) |
| DELETE | `/api/menu/:id` | Delete item (admin only) |

### Cart
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/cart/validate` | Validate cart items against DB |

### Orders
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/orders` | Place an order |
| GET  | `/api/orders/my` | Get my orders (protected) |
| GET  | `/api/orders` | Get all orders (admin only) |
| PUT  | `/api/orders/:id/status` | Update order status (admin only) |

### Payment
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/payment/gcash` | Create GCash payment link via PayMongo |
| POST | `/api/payment/webhook` | PayMongo webhook handler |

---

## Payment Flow

### COD
1. Customer places order → `POST /api/orders` with `paymentMethod: "COD"`
2. Order saved with `paymentStatus: "pending"` and `orderStatus: "pending"`
3. Admin confirms order manually

### GCash (via PayMongo)
1. Customer places order → `POST /api/orders` with `paymentMethod: "GCash"`
2. Frontend calls `POST /api/payment/gcash` with `orderId` and `amount`
3. Backend creates a PayMongo payment link and returns `checkoutUrl`
4. Customer is redirected to GCash to pay
5. PayMongo sends a webhook to `/api/payment/webhook` on success
6. Order is automatically marked as `paymentStatus: "paid"`

---

## Folder Structure
```
esc-backend/
  server.js           ← entry point
  .env.example        ← environment variables template
  package.json
  models/
    User.js           ← user schema
    MenuItem.js       ← menu item schema
    Order.js          ← order schema
  routes/
    auth.js           ← register, login, me
    menu.js           ← menu CRUD
    cart.js           ← cart validation
    orders.js         ← place & manage orders
    payment.js        ← PayMongo GCash integration
  middleware/
    auth.js           ← JWT protect + adminOnly
```
