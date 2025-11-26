# Chit Fund Backend API

RESTful API built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
```powershell
npm install
```

2. Create `.env` file from `.env.example`:
```powershell
cp .env.example .env
```

3. Update environment variables in `.env`

4. Start MongoDB service

5. Run the server:
```powershell
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chitfund
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=30d
NODE_ENV=development
```

## API Documentation

### Authentication Required
All endpoints except `/api/auth/login` require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register employee (admin only)
- `GET /api/auth/me` - Get current user

#### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer (admin)

#### Chit Plans
- `GET /api/chitplans` - List all plans
- `POST /api/chitplans` - Create plan (admin/accountant)
- `GET /api/chitplans/:id` - Get plan details
- `PUT /api/chitplans/:id` - Update plan (admin/accountant)
- `DELETE /api/chitplans/:id` - Delete plan (admin)

#### Chits
- `GET /api/chits` - List all chits
- `POST /api/chits` - Create chit (admin/accountant)
- `GET /api/chits/:id` - Get chit details
- `PUT /api/chits/:id` - Update chit (admin/accountant)
- `POST /api/chits/:id/members` - Add member
- `DELETE /api/chits/:id/members/:memberId` - Remove member (admin)

#### Payments
- `GET /api/payments` - List payments (with filters)
- `POST /api/payments` - Record payment
- `GET /api/payments/:id` - Get payment details
- `PUT /api/payments/:id` - Update payment
- `GET /api/payments/pending/all` - Get pending payments

#### Bids
- `GET /api/bids` - List all bids
- `POST /api/bids` - Record bid (admin/accountant)
- `GET /api/bids/:id` - Get bid details
- `PUT /api/bids/:id` - Update bid (admin/accountant)

#### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/chit/:id` - Chit report
- `GET /api/reports/customer/:id` - Customer report
- `GET /api/reports/export/payments` - Export payments to Excel

#### Employees
- `GET /api/employees` - List employees (admin)
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee (admin)
- `DELETE /api/employees/:id` - Delete employee (admin)

## Database Schema

See models in `/models` directory for complete schema definitions.

## Role-Based Access

- **admin**: Full access
- **accountant**: Manage chit plans, payments, bids
- **staff**: Basic customer and payment management
