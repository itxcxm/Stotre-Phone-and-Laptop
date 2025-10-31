# Cloud Gaming Service

A full-stack e-commerce application for cloud gaming services built with React and Node.js/Express.

## 🚀 Features

### User Features
- User registration and authentication (JWT-based)
- Browse and search products
- Shopping cart management
- Order placement and tracking
- User profile management

### Admin Features
- Product management (CRUD operations)
- Order management and tracking
- User management

## 📋 Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **JWT Decode** - Token decoding

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Cloud gaming service/
├── back-end/
│   ├── config/
│   │   └── config.js          # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.js            # Authentication middleware
│   │   └── errorHandler.js    # Error handling middleware
│   ├── models/
│   │   ├── user.js            # User model
│   │   ├── Products.js        # Product model
│   │   ├── Carts.js           # Cart model
│   │   ├── Orders.js          # Order model
│   │   └── Categories.js      # Category model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── products.js        # Product routes
│   │   ├── carts.js           # Cart routes
│   │   └── orders.js          # Order routes
│   ├── index.js               # Main server file
│   └── package.json
└── front-end/
    ├── src/
    │   ├── pages/             # React components/pages
    │   ├── components/         # Reusable components
    │   ├── redux/             # State management
    │   └── App.js             # Main App component
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd back-end
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `back-end` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/cloud_gaming_service

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1h
REFRESH_SECRET=your_refresh_token_secret_here
REFRESH_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd front-end
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register a new user | No |
| POST | `/login` | Login user | No |
| POST | `/refresh` | Refresh access token | No |
| GET | `/user-info` | Get user information | Yes |

### Products

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/product` | Get all products | No | No |
| GET | `/product/:slug` | Get product by slug | No | No |
| POST | `/product` | Create new product | Yes | Yes |
| POST | `/add-product` | Create new product (compatibility) | Yes | Yes |
| PUT | `/product/:slug` | Update product | Yes | Yes |
| PUT | `/update/:slug` | Update product (compatibility) | Yes | Yes |
| DELETE | `/product/:slug` | Delete product | Yes | Yes |
| GET | `/product/update/:slug` | Get product for update | Yes | Yes |
| GET | `/update/:slug` | Get product for update (compatibility) | Yes | Yes |

### Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/carts` | Add product to cart | Yes |
| GET | `/carts` | Get user's cart | Yes |
| DELETE | `/carts/:slug` | Remove product from cart | Yes |

### Orders

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | `/orders` | Create new order | Yes | No |
| GET | `/orders` | Get user's orders | Yes | No |
| GET | `/orders/admin` | Get all orders | Yes | Yes |
| GET | `/ordersAdmin` | Get all orders (compatibility) | Yes | Yes |
| DELETE | `/orders/:id` | Delete order | Yes | No* |

*Users can only delete their own orders, admins can delete any order.

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Structure
- **Access Token**: Short-lived (default: 1 hour), used for API requests
- **Refresh Token**: Long-lived (default: 7 days), used to get new access tokens

## 🗄️ Database Models

### User Model
- `userName` (unique, required)
- `password` (hashed, required)
- `email` (unique, required)
- `fullName` (required)
- `phone`
- `address`
- `role` (enum: "admin", "user", default: "user")
- `isActive` (default: true)
- `refreshToken`

### Product Model
- `name` (required)
- `slug` (unique, required)
- `sku`
- `category.name`
- `brand`
- `description`
- `specifications` (cpu, ram, storage, screen, gpu, battery, os, processor, camera)
- `price` (required)
- `discountPrice`
- `quantity` (default: 0)
- `status` (enum: "in_stock", "out_of_stock")
- `isFeatured` (default: false)
- `images[]` (array with path and isMain flag)

### Cart Model
- `user` (required, references User)
- `slug` (required, references Product)
- Compound unique index on (user, slug) to prevent duplicates

### Order Model
- `orderNumber` (unique, required)
- `username` (required)
- `idUser` (required, references User)
- `phone` (required)
- `images`
- `products` (object with slug, quantity, price, total)
- `status` (enum: "pending", "processing", "shipped", "delivered", "cancelled")
- `totalAmount` (required)
- `shippingAddress` (required)
- `paymentMethod` (required)
- `paymentStatus` (enum: "pending", "paid")
- `notes`

## ✨ Optimizations Made

### Code Organization
- ✅ Separated route handlers into modular route files
- ✅ Removed duplicate code from `index.js`
- ✅ Organized middleware functions
- ✅ Proper error handling with centralized error handler

### Database Optimizations
- ✅ Added database indexes for faster queries:
  - User: `userName`, `email`
  - Product: `slug`, `category.name`, `status`, `isFeatured`
  - Cart: Compound index on `(user, slug)` with unique constraint
  - Order: `idUser`, `orderNumber`, `status`
- ✅ Added schema validations and constraints
- ✅ Implemented pre-save hooks (e.g., auto-update product status based on quantity)

### Security Improvements
- ✅ Password validation (minimum 6 characters)
- ✅ Email validation with regex
- ✅ Username validation (3-30 characters)
- ✅ Proper JWT token structure (minimal payload)
- ✅ User active status checking
- ✅ Role-based access control

### Code Quality
- ✅ Consistent error messages
- ✅ Proper HTTP status codes
- ✅ Input validation
- ✅ Environment variable configuration
- ✅ Timestamps enabled in models
- ✅ CORS configuration for frontend

### API Improvements
- ✅ RESTful route structure
- ✅ Consistent response format
- ✅ Backward compatibility routes for existing frontend
- ✅ Health check endpoint
- ✅ Product sorting by creation date

## 🐛 Error Handling

The application uses a centralized error handler middleware that handles:
- **ValidationError** - Mongoose validation errors (400)
- **CastError** - Invalid MongoDB ObjectId (400)
- **DuplicateKeyError** - Unique constraint violations (400)
- **TokenExpiredError** - Expired JWT tokens (401)
- **Generic errors** - Default 500 error

Error responses include:
- `message`: Error message
- `stack`: Error stack (only in development mode)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `back-end` directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cloud_gaming_service
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1h
REFRESH_SECRET=your_refresh_secret_here
REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## 📝 Development Scripts

### Backend
```bash
npm start        # Start server with nodemon (auto-reload)
npm test         # Run tests (not configured yet)
```

### Frontend
```bash
npm start        # Start development server
npm build        # Build for production
npm test         # Run tests
```

## 🚧 Future Improvements

- [ ] Add pagination for products and orders
- [ ] Implement search and filtering functionality
- [ ] Add image upload functionality
- [ ] Implement order status updates
- [ ] Add email notifications
- [ ] Implement payment gateway integration
- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add admin dashboard analytics
- [ ] Write unit and integration tests
- [ ] Add API rate limiting
- [ ] Implement request logging
- [ ] Add Swagger/OpenAPI documentation

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the repository.

---

**Note**: This project has been optimized for better code organization, database performance, security, and maintainability. All backward compatibility routes are maintained to ensure existing frontend code continues to work without modifications.

