# Chit Fund Web Application

React web application built with Vite and Tailwind CSS.

## Setup

1. Install dependencies:
```powershell
npm install
```

2. Start development server:
```powershell
npm run dev
```

The app will be available at `http://localhost:3000`

3. Build for production:
```powershell
npm run build
```

## Features

- **Dashboard**: Overview of collections, dues, active chits
- **Customer Management**: Add, edit, view customers
- **Chit Plans**: Create and manage chit plans
- **Chits**: Create chit groups and manage members
- **Payments**: Record and track monthly payments
- **Auctions/Bids**: Record auction winners and bid amounts
- **Reports**: View statistics and export data
- **Employee Management**: Admin can manage staff accounts

## Configuration

### API Endpoint

The app proxies API requests to `http://localhost:5000` by default. To change this, update `vite.config.js`:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://your-backend-url:5000',
      changeOrigin: true,
    }
  }
}
```

### Environment Variables

Create `.env` file (optional):
```
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.jsx
│   └── PrivateRoute.jsx
├── context/         # React Context providers
│   └── AuthContext.jsx
├── pages/           # Page components
│   ├── Dashboard.jsx
│   ├── Customers.jsx
│   ├── ChitPlans.jsx
│   ├── Payments.jsx
│   └── ...
├── services/        # API service layer
│   └── api.js
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Login

Default admin credentials (if created):
- Email: admin@chitfund.com
- Password: admin123

## Technologies

- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios
- React Icons
- React Toastify
- Recharts (for charts)
