import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment, getChits, getCustomers } from '../services/api';
import { toast } from 'react-toastify';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chits, setChits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedChit, setSelectedChit] = useState(null);
  const [formData, setFormData] = useState({
    chit_id: '',
    customer_id: '',
    month: '',
    amount: '',
    due_date: '',
    payment_date: new Date().toISOString().split('T')[0],
    status: 'paid',
    payment_mode: 'cash',
    transaction_id: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.chit_id) {
      const chit = chits.find(c => c._id === formData.chit_id);
      setSelectedChit(chit);
      // Filter customers who are members of this chit
      if (chit) {
        const memberIds = chit.members.map(m => m.customer_id._id);
        setCustomers(chit.members.map(m => m.customer_id));
      }
    }
  }, [formData.chit_id, chits]);

  const fetchData = async () => {
    try {
      const chitsRes = await getChits();
      setChits(chitsRes.data.data.filter(c => c.status === 'active'));
    } catch (error) {
      toast.error('Error fetching data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPayment(formData);
      toast.success('Payment recorded successfully');
      navigate('/payments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error recording payment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Record Payment</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chit *
              </label>
              <select
                name="chit_id"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.chit_id}
                onChange={handleChange}
              >
                <option value="">Select Chit</option>
                {chits.map((chit) => (
                  <option key={chit._id} value={chit._id}>
                    {chit.chit_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer *
              </label>
              <select
                name="customer_id"
                required
                disabled={!formData.chit_id}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                value={formData.customer_id}
                onChange={handleChange}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month *
              </label>
              <input
                type="number"
                name="month"
                required
                min="1"
                max={selectedChit?.chit_plan_id?.duration || 100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.month}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                name="amount"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                name="due_date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                name="payment_date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.payment_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="partial">Partial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Mode *
              </label>
              <select
                name="payment_mode"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.payment_mode}
                onChange={handleChange}
              >
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID
              </label>
              <input
                type="text"
                name="transaction_id"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.transaction_id}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/payments')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
