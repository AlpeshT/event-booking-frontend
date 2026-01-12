import React, { useState, useEffect } from 'react';
import { fetchResources, createResource, fetchOrganizations } from '../api/api';

export default function ResourcesPage({ organizationId }) {
  const [resources, setResources] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'exclusive',
    organizationId: organizationId || null,
    maxConcurrent: null,
    totalQuantity: null,
  });

  useEffect(() => {
    loadOrganizations();
    loadData();
  }, [organizationId]);

  const loadOrganizations = async () => {
    try {
      const orgs = await fetchOrganizations();
      setOrganizations(orgs);
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    const data = await fetchResources(organizationId);
    setResources(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Explicitly handle organizationId - if it's a valid UUID string, use it; otherwise null
      const orgId = formData.organizationId && formData.organizationId.trim() !== '' 
        ? formData.organizationId 
        : null;
      
      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        organizationId: orgId,
        maxConcurrent: formData.maxConcurrent,
        totalQuantity: formData.totalQuantity,
      };
      await createResource(payload);
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        type: 'exclusive',
        organizationId: organizationId || null,
        maxConcurrent: null,
        totalQuantity: null,
      });
      loadData();
    } catch (error) {
      alert('Error creating resource: ' + error.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Resources</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Create Resource'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Organization</label>
              <select
                value={formData.organizationId ? formData.organizationId : 'global'}
                onChange={(e) => {
                  const value = e.target.value;
                  const newOrgId = value === 'global' ? null : value;
                  setFormData({ 
                    ...formData, 
                    organizationId: newOrgId
                  });
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="global">Global (Shared across all organizations)</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="exclusive">Exclusive</option>
                <option value="shareable">Shareable</option>
                <option value="consumable">Consumable</option>
              </select>
            </div>
            {formData.type === 'shareable' && (
              <div>
                <label className="block text-sm font-medium mb-1">Max Concurrent</label>
                <input
                  type="number"
                  value={formData.maxConcurrent || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, maxConcurrent: parseInt(e.target.value) || null })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}
            {formData.type === 'consumable' && (
              <div>
                <label className="block text-sm font-medium mb-1">Total Quantity</label>
                <input
                  type="number"
                  value={formData.totalQuantity || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, totalQuantity: parseInt(e.target.value) || null })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows="3"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Resource
          </button>
        </form>
      )}

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Organization</th>
              <th className="px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-b">
                <td className="px-4 py-2">{resource.name}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 bg-blue-100 rounded text-sm">
                    {resource.type}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {resource.organization?.name || 'Global'}
                </td>
                <td className="px-4 py-2">
                  {resource.type === 'shareable' && resource.maxConcurrent && (
                    <span>Max: {resource.maxConcurrent}</span>
                  )}
                  {resource.type === 'consumable' && resource.totalQuantity && (
                    <span>Total: {resource.totalQuantity}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
