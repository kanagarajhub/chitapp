import { useState } from 'react';
import { exportPayments } from '../services/api';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Reports = () => {
  const [loading, setLoading] = useState(false);

  const handleExportPayments = async () => {
    setLoading(true);
    try {
      const response = await exportPayments();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Payments exported successfully');
    } catch (error) {
      toast.error('Error exporting payments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Export Payments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiDownload className="text-green-600" size={24} />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-800">Export Payments</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Download all payment records in Excel format
          </p>
          <button
            onClick={handleExportPayments}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Exporting...' : 'Export to Excel'}
          </button>
        </div>

        {/* Dashboard Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiDownload className="text-blue-600" size={24} />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-800">Dashboard Summary</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            View overall business statistics
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Dashboard
          </button>
        </div>

        {/* Chit Reports */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiDownload className="text-purple-600" size={24} />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-800">Chit Reports</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            View detailed reports for each chit
          </p>
          <button
            onClick={() => window.location.href = '/chits'}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            View Chits
          </button>
        </div>

        {/* Customer Reports */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiDownload className="text-yellow-600" size={24} />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-800">Customer Reports</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            View individual customer payment history
          </p>
          <button
            onClick={() => window.location.href = '/customers'}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            View Customers
          </button>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FiDownload className="text-red-600" size={24} />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-800">Pending Payments</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            View all pending and overdue payments
          </p>
          <button
            onClick={() => window.location.href = '/payments'}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            View Payments
          </button>
        </div>

        {/* Auction History */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FiDownload className="text-indigo-600" size={24} />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-800">Auction History</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            View all auction and bidding records
          </p>
          <button
            onClick={() => window.location.href = '/bids'}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            View Auctions
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Report Information</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• All reports are generated in real-time based on current data</p>
          <p>• Exported files include complete records with all available fields</p>
          <p>• Payment reports can be filtered by status, date range, and chit</p>
          <p>• Customer reports show complete payment history and chit participation</p>
          <p>• Auction reports include bid amounts, winners, and dividend distributions</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
