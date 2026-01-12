# E-commerce Web Application

A full-stack online shopping platform built with modern technologies.

## 🚀 Technologies

### Frontend
- **React** - UI Library
- **Redux Toolkit** - State Management
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Stripe** - Payment Processing
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Stripe** - Payment Integration

## ✨ Features

- **User Authentication** - Register, login, JWT-based sessions
- **Product Catalog** - Browse products with filtering, sorting, pagination
- **Shopping Cart** - Add/remove items, quantity management
- **Secure Checkout** - Stripe payment integration
- **Order Management** - Track orders, order history
- **Admin Dashboard** - Manage products, orders, users
- **Responsive Design** - Mobile-first, works on all devices

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm or yarn

### Setup

1. **Clone and install dependencies**
\`\`\`bash
cd "E-commerce web"
npm run install-all
\`\`\`

2. **Configure environment variables**

Create `.env` file in `server/` folder:
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=http://localhost:5173
\`\`\`

Create `.env` file in `client/` folder:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
\`\`\`

3. **Seed the database (optional)**
\`\`\`bash
cd server
npm run seed
\`\`\`

4. **Run the application**
\`\`\`bash
# From root directory - runs both client and server
npm run dev

# Or run separately:
npm run client  # Frontend at http://localhost:5173
npm run server  # Backend at http://localhost:5000
\`\`\`

## 🔐 Default Users

After seeding:
- **Admin**: admin@ecommerce.com / admin123
- **User**: john@example.com / password123

## 📁 Project Structure

\`\`\`
E-commerce web/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store & slices
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   └── ...
├── server/                 # Express Backend
│   ├── config/             # Database config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── utils/              # Utilities & seeder
└── package.json            # Root package.json
\`\`\`

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updateprofile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get categories
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders/create-payment-intent` - Stripe payment

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## 🐳 Docker

Build and run with Docker:
\`\`\`bash
docker-compose up --build
\`\`\`

## 📝 License

MIT License
