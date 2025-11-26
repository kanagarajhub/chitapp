import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerForm from './pages/CustomerForm';
import ChitPlans from './pages/ChitPlans';
import ChitPlanForm from './pages/ChitPlanForm';
import Chits from './pages/Chits';
import ChitForm from './pages/ChitForm';
import ChitDetails from './pages/ChitDetails';
import Payments from './pages/Payments';
import PaymentForm from './pages/PaymentForm';
import Bids from './pages/Bids';
import BidForm from './pages/BidForm';
import Reports from './pages/Reports';
import Employees from './pages/Employees';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/new" element={<CustomerForm />} />
            <Route path="customers/edit/:id" element={<CustomerForm />} />
            <Route path="chit-plans" element={<ChitPlans />} />
            <Route path="chit-plans/new" element={<ChitPlanForm />} />
            <Route path="chit-plans/edit/:id" element={<ChitPlanForm />} />
            <Route path="chits" element={<Chits />} />
            <Route path="chits/new" element={<ChitForm />} />
            <Route path="chits/:id" element={<ChitDetails />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payments/new" element={<PaymentForm />} />
            <Route path="bids" element={<Bids />} />
            <Route path="bids/new" element={<BidForm />} />
            <Route path="reports" element={<Reports />} />
            <Route path="employees" element={<Employees />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
