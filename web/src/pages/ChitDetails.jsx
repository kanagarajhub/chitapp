import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChit, getCustomers, addMember, removeMember } from '../services/api';
import { FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ChitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chit, setChit] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ customer_id: '', ticket_number: '' });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [chitRes, customersRes] = await Promise.all([
        getChit(id),
        getCustomers()
      ]);
      setChit(chitRes.data.data);
      setCustomers(customersRes.data.data.filter(c => c.isActive));
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await addMember(id, newMember);
      toast.success('Member added successfully');
      setShowAddMember(false);
      setNewMember({ customer_id: '', ticket_number: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await removeMember(id, memberId);
        toast.success('Member removed successfully');
        fetchData();
      } catch (error) {
        toast.error('Error removing member');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!chit) {
    return <div>Chit not found</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/chits')}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Back to Chits
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">{chit.chit_name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chit Info */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Chit Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="font-semibold">{chit.chit_plan_id?.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold">₹{chit.total_amount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-semibold">{new Date(chit.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Month</p>
              <p className="font-semibold">{chit.current_month} / {chit.chit_plan_id?.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                chit.status === 'active' ? 'bg-green-100 text-green-800' :
                chit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {chit.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Members</p>
              <p className="font-semibold">
                {chit.members?.length || 0} / {chit.chit_plan_id?.members_limit}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Total Members</p>
              <p className="text-2xl font-bold text-blue-700">{chit.members?.length || 0}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Progress</p>
              <p className="text-2xl font-bold text-green-700">
                {Math.round((chit.current_month / chit.chit_plan_id?.duration) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Members</h2>
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FiPlus className="mr-2" />
            Add Member
          </button>
        </div>

        {showAddMember && (
          <form onSubmit={handleAddMember} className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newMember.customer_id}
                  onChange={(e) => setNewMember({ ...newMember, customer_id: e.target.value })}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                required
                placeholder="Ticket Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={newMember.ticket_number}
                onChange={(e) => setNewMember({ ...newMember, ticket_number: e.target.value })}
              />
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddMember(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ticket No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chit.members?.map((member) => (
                <tr key={member._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {member.ticket_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.customer_id?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.customer_id?.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.joined_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChitDetails;
