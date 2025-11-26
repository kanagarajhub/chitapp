import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChitPlans, deleteChitPlan } from '../services/api';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ChitPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await getChitPlans();
      setPlans(response.data.data);
    } catch (error) {
      toast.error('Error fetching chit plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this chit plan?')) {
      try {
        await deleteChitPlan(id);
        toast.success('Chit plan deleted successfully');
        fetchPlans();
      } catch (error) {
        toast.error('Error deleting chit plan');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Chit Plans</h1>
        <Link
          to="/chit-plans/new"
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <FiPlus className="mr-2" />
          Create Plan
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  plan.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {plan.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">₹{plan.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{plan.duration} months</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Members Limit:</span>
                <span className="font-semibold">{plan.members_limit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monthly Installment:</span>
                <span className="font-semibold">₹{plan.monthly_installment.toLocaleString()}</span>
              </div>
            </div>

            {plan.description && (
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
            )}

            <div className="flex space-x-2 pt-4 border-t">
              <Link
                to={`/chit-plans/edit/${plan._id}`}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100"
              >
                <FiEdit className="mr-1" size={16} />
                Edit
              </Link>
              <button
                onClick={() => handleDelete(plan._id)}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <FiTrash2 className="mr-1" size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No chit plans found. Create your first plan!</p>
        </div>
      )}
    </div>
  );
};

export default ChitPlans;
