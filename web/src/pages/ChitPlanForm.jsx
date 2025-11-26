import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createChitPlan, updateChitPlan, getChitPlan } from '../services/api';
import { toast } from 'react-toastify';

const ChitPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    duration: '',
    members_limit: '',
    monthly_installment: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      fetchPlan();
    }
  }, [id]);

  const fetchPlan = async () => {
    try {
      const response = await getChitPlan(id);
      setFormData(response.data.data);
    } catch (error) {
      toast.error('Error fetching chit plan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await updateChitPlan(id, formData);
        toast.success('Chit plan updated successfully');
      } else {
        await createChitPlan(formData);
        toast.success('Chit plan created successfully');
      }
      navigate('/chit-plans');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving chit plan');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {id ? 'Edit Chit Plan' : 'Create Chit Plan'}
      </h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Title *
              </label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount (₹) *
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
                Duration (Months) *
              </label>
              <input
                type="number"
                name="duration"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Members Limit *
              </label>
              <input
                type="number"
                name="members_limit"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.members_limit}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Installment (₹) *
              </label>
              <input
                type="number"
                name="monthly_installment"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.monthly_installment}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/chit-plans')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChitPlanForm;
