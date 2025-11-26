import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBid, getChits } from '../services/api';
import { toast } from 'react-toastify';

const BidForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chits, setChits] = useState([]);
  const [selectedChit, setSelectedChit] = useState(null);
  const [formData, setFormData] = useState({
    chit_id: '',
    month: '',
    winner_id: '',
    bid_amount: '',
    prize_amount: '',
    dividend_amount: '',
    auction_date: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    fetchChits();
  }, []);

  useEffect(() => {
    if (formData.chit_id) {
      const chit = chits.find(c => c._id === formData.chit_id);
      setSelectedChit(chit);
    }
  }, [formData.chit_id, chits]);

  const fetchChits = async () => {
    try {
      const response = await getChits();
      setChits(response.data.data.filter(c => c.status === 'active'));
    } catch (error) {
      toast.error('Error fetching chits');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createBid(formData);
      toast.success('Bid recorded successfully');
      navigate('/bids');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error recording bid');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Record Auction/Bid</h1>

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
                    {chit.chit_name} - Month {chit.current_month}
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
                Winner *
              </label>
              <select
                name="winner_id"
                required
                disabled={!formData.chit_id}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                value={formData.winner_id}
                onChange={handleChange}
              >
                <option value="">Select Winner</option>
                {selectedChit?.members.map((member) => (
                  <option key={member._id} value={member.customer_id._id}>
                    {member.customer_id.name} - Ticket #{member.ticket_number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bid Amount (₹) *
              </label>
              <input
                type="number"
                name="bid_amount"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.bid_amount}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prize Amount (₹) *
              </label>
              <input
                type="number"
                name="prize_amount"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.prize_amount}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dividend Amount (₹)
              </label>
              <input
                type="number"
                name="dividend_amount"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.dividend_amount}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auction Date *
              </label>
              <input
                type="date"
                name="auction_date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.auction_date}
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
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="disbursed">Disbursed</option>
              </select>
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
              onClick={() => navigate('/bids')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Record Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidForm;
