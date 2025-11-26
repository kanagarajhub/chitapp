import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChit, getChitPlans } from '../services/api';
import { toast } from 'react-toastify';

const ChitForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    chit_plan_id: '',
    chit_name: '',
    start_date: '',
    status: 'pending',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await getChitPlans();
      setPlans(response.data.data.filter(p => p.isActive));
    } catch (error) {
      toast.error('Error fetching plans');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createChit(formData);
      toast.success('Chit created successfully');
      navigate('/chits');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating chit');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Chit</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chit Plan *
              </label>
              <select
                name="chit_plan_id"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.chit_plan_id}
                onChange={handleChange}
              >
                <option value="">Select a plan</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.title} - ₹{plan.amount.toLocaleString()} ({plan.duration} months)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chit Name *
              </label>
              <input
                type="text"
                name="chit_name"
                required
                placeholder="e.g., January 2024 Batch"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.chit_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="start_date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/chits')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Chit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChitForm;
