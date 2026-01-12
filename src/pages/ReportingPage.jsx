import React, { useState, useEffect } from 'react';
import {
  getDoubleBookedUsers,
  getViolatingEvents,
  getResourceUtilization,
  getInvalidParentEvents,
  getEventsWithExternalAttendees,
  getUnderutilizedResources,
} from '../api/api';

export default function ReportingPage() {
  const [activeTab, setActiveTab] = useState('double-booked');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threshold, setThreshold] = useState(10);
  const [minUsageHours, setMinUsageHours] = useState(10);

  useEffect(() => {
    loadData();
  }, [activeTab, threshold, minUsageHours]);

  const loadData = async () => {
    setLoading(true);
    try {
      let result;
      switch (activeTab) {
        case 'double-booked':
          result = await getDoubleBookedUsers();
          break;
        case 'violating':
          result = await getViolatingEvents();
          break;
        case 'utilization':
          result = await getResourceUtilization();
          break;
        case 'invalid-parents':
          result = await getInvalidParentEvents();
          break;
        case 'external-attendees':
          result = await getEventsWithExternalAttendees(threshold);
          break;
        case 'underutilized':
          result = await getUnderutilizedResources(minUsageHours);
          break;
        default:
          result = [];
      }
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
      setData([]);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'double-booked', label: 'Double-Booked Users' },
    { id: 'violating', label: 'Violating Events' },
    { id: 'utilization', label: 'Resource Utilization' },
    { id: 'invalid-parents', label: 'Invalid Parent Events' },
    { id: 'external-attendees', label: 'External Attendees' },
    { id: 'underutilized', label: 'Underutilized Resources' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reporting Dashboard</h1>

      <div className="mb-4">
        <div className="flex space-x-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'external-attendees' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Threshold: {threshold}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={threshold}
            onChange={(e) => {
              setThreshold(parseInt(e.target.value));
            }}
            onMouseUp={loadData}
            className="w-full"
          />
        </div>
      )}

      {activeTab === 'underutilized' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Minimum Usage Hours: {minUsageHours}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={minUsageHours}
            onChange={(e) => {
              setMinUsageHours(parseInt(e.target.value));
            }}
            onMouseUp={loadData}
            className="w-full"
          />
        </div>
      )}

      {loading ? (
        <div className="p-6 text-center">Loading...</div>
      ) : (
        <div className="bg-white shadow rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    {Object.values(row).map((value, colIdx) => (
                      <td key={colIdx} className="px-4 py-2">
                        {value instanceof Date
                          ? value.toLocaleString()
                          : value?.toString() || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && (
              <div className="p-6 text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
