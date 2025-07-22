import React, { useEffect } from "react";
import { useServiceRequestStore } from "../store/serviceRequestStore";

const ServiceRequestList = () => {
  const { requests, isLoading, error, fetchMyServiceRequests } = useServiceRequestStore();

  useEffect(() => {
    fetchMyServiceRequests();
  }, [fetchMyServiceRequests]);

  if (isLoading) return <div className="text-center py-8 text-blue-600 font-semibold">Loading service requests...</div>;
  if (error) return <div className="text-center py-8 text-red-500 font-semibold">{error}</div>;
  if (!requests.length) return <div className="text-center py-8 text-gray-500">No service requests found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Your Service Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700">Service</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700">Date</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-2 font-medium text-blue-900">{req.service}</td>
                <td className="px-4 py-2 text-blue-700">{new Date(req.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 text-green-600 font-semibold">Submitted</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceRequestList; 