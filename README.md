# Chit Fund Management System

A comprehensive Chit Fund Management System built with Node.js, React, and Flutter. Manage customers, chit plans, monthly collections, auctions, and generate detailed reports.

## 🌟 Features

### For Company Staff & Admins:
- **Customer Management**: Add, edit, and manage customer profiles with KYC details
- **Chit Plans**: Create and manage different chit group plans with configurable amounts and durations
- **Monthly Collections**: Record and track monthly payments from members
- **Auction/Bidding**: Record monthly winners and manage auction details
- **Reports & Dashboard**: View comprehensive analytics, export data to Excel/PDF
- **Employee Management**: Admin can add staff with role-based access control

### Tech Stack:
- **Backend**: Node.js + Express + MongoDB
- **Web App**: React + Vite + Tailwind CSS
- **Mobile App**: Flutter
- **Authentication**: JWT-based authentication
- **Export**: Excel (ExcelJS) and PDF (PDFKit) support

## 📁 Project Structure

```
myapp/
├── backend/          # Node.js + Express API
├── web/             # React Web Application
└── mobile/          # Flutter Mobile Application
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Flutter SDK (v3.0 or higher) - for mobile app
- npm or yarn

---

## Backend Setup

### 1. Navigate to backend directory
```powershell
cd backend
```

### 2. Install dependencies
```powershell
npm install
```

### 3. Configure environment
Create `.env` file from `.env.example`:
```powershell
cp .env.example .env
```

Update `.env` with your settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chitfund
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system.

### 5. Start the server
```powershell
npm start
```

For development with auto-reload:
```powershell
npm run dev
```

The API will be available at `http://localhost:5000`

### Default Admin Account
After first run, create an admin account by making a POST request to `/api/auth/register` or use the employee management API.

**Default credentials for testing:**
- Email: admin@chitfund.com
- Password: admin123
- Role: admin

*(You'll need to create this manually in the database or via API)*

---

## Web Application Setup

### 1. Navigate to web directory
```powershell
cd web
```

### 2. Install dependencies
```powershell
npm install
```

### 3. Configure API endpoint (optional)
The web app is configured to proxy to `http://localhost:5000` by default. If your backend runs on a different port, update `vite.config.js`.

### 4. Start the development server
```powershell
npm run dev
```

The web app will be available at `http://localhost:3000`

### 5. Build for production
```powershell
npm run build
```

The build files will be in the `dist` directory.

---

## Mobile Application Setup

### 1. Navigate to mobile directory
```powershell
cd mobile
```

### 2. Install dependencies
```powershell
flutter pub get
```

### 3. Configure API endpoint
Update the `baseUrl` in `lib/config/api_config.dart`:

- **Android Emulator**: Use `http://10.0.2.2:5000/api`
- **iOS Simulator**: Use `http://localhost:5000/api`
- **Physical Device**: Use your computer's IP address, e.g., `http://192.168.1.100:5000/api`

### 4. Run the app

For Android:
```powershell
flutter run
```

For iOS:
```powershell
flutter run -d ios
```

For a specific device:
```powershell
flutter devices
flutter run -d <device-id>
```

### 5. Build for production

Android APK:
```powershell
flutter build apk --release
```

iOS:
```powershell
flutter build ios --release
```

---

## 📊 Database Collections

### Employees
- name, phone, email, password (hashed), role, isActive

### Customers
- name, phone, email, address, kyc_id, kyc_type, joined_date, isActive, notes

### ChitPlans
- title, amount, duration, members_limit, monthly_installment, description, isActive

### Chits
- chit_plan_id, chit_name, start_date, members[], current_month, status, total_amount

### Payments
- chit_id, customer_id, month, amount, payment_date, due_date, status, payment_mode, receipt_number

### Bids
- chit_id, month, winner_id, bid_amount, prize_amount, dividend_amount, auction_date, status

---

## 🔐 API Authentication

All API endpoints (except login) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 👥 User Roles

### Admin
- Full access to all features
- Manage employees
- Delete records

### Accountant
- Create and manage chit plans
- Record auctions/bids
- View all reports

### Staff
- Add and manage customers
- Record payments
- View basic reports

---

## 📱 Features by Platform

| Feature | Web | Mobile |
|---------|-----|--------|
| Dashboard | ✅ | ✅ |
| Customer Management | ✅ | ✅ |
| Chit Plans | ✅ | ✅ |
| Chits | ✅ | ✅ |
| Payments | ✅ | ✅ |
| Auctions/Bids | ✅ | ✅ |
| Reports | ✅ | ⚠️ (View only) |
| Employee Management | ✅ | ❌ |
| Excel Export | ✅ | ❌ |

---

## 🛠️ Development

### Backend API Endpoints

#### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register new employee (admin only)
- GET `/api/auth/me` - Get current user

#### Customers
- GET `/api/customers` - Get all customers
- POST `/api/customers` - Create customer
- GET `/api/customers/:id` - Get customer by ID
- PUT `/api/customers/:id` - Update customer
- DELETE `/api/customers/:id` - Delete customer

#### Chit Plans
- GET `/api/chitplans` - Get all chit plans
- POST `/api/chitplans` - Create chit plan
- GET `/api/chitplans/:id` - Get chit plan by ID
- PUT `/api/chitplans/:id` - Update chit plan
- DELETE `/api/chitplans/:id` - Delete chit plan

#### Chits
- GET `/api/chits` - Get all chits
- POST `/api/chits` - Create chit
- GET `/api/chits/:id` - Get chit by ID
- PUT `/api/chits/:id` - Update chit
- POST `/api/chits/:id/members` - Add member to chit
- DELETE `/api/chits/:id/members/:memberId` - Remove member

#### Payments
- GET `/api/payments` - Get all payments
- POST `/api/payments` - Create payment
- GET `/api/payments/:id` - Get payment by ID
- PUT `/api/payments/:id` - Update payment
- GET `/api/payments/pending/all` - Get pending payments

#### Bids
- GET `/api/bids` - Get all bids
- POST `/api/bids` - Create bid
- GET `/api/bids/:id` - Get bid by ID
- PUT `/api/bids/:id` - Update bid

#### Reports
- GET `/api/reports/dashboard` - Get dashboard statistics
- GET `/api/reports/chit/:id` - Get chit report
- GET `/api/reports/customer/:id` - Get customer report
- GET `/api/reports/export/payments` - Export payments to Excel

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### CORS Errors
- Backend CORS is enabled for all origins in development
- Update CORS settings in `server.js` for production

### Mobile App Not Connecting
- Check API baseUrl in `api_config.dart`
- Ensure backend is accessible from your device
- For physical devices, use your computer's IP address

### Port Already in Use
- Backend: Change PORT in `.env`
- Web: Change port in `vite.config.js`

---

## 📝 License

This project is for internal company use.

---

## 👨‍💻 Support

For issues and questions, contact your system administrator.
