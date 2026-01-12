import React, { useState, useEffect } from 'react';
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchResources,
  allocateResource,
  fetchOrganizations,
} from '../api/api';

export default function EventsPage({ organizationId }) {
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState(organizationId || '');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    capacity: 10,
    organizationId: organizationId || '',
    parentEventId: null,
  });

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    loadResources(); // Always load resources (includes global)
    if (selectedOrgId) {
      loadEvents();
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [selectedOrgId]);

  const loadOrganizations = async () => {
    try {
      const orgs = await fetchOrganizations();
      setOrganizations(orgs);
      if (orgs.length > 0 && !selectedOrgId) {
        setSelectedOrgId(orgs[0].id);
        setFormData({ ...formData, organizationId: orgs[0].id });
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const loadResources = async () => {
    try {
      // Load all resources (including global) regardless of organization
      const resourcesData = await fetchResources(selectedOrgId);
      setResources(resourcesData);
    } catch (error) {
      console.error('Error loading resources:', error);
    }
  };

  const loadEvents = async () => {
    if (!selectedOrgId) {
      setEvents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const eventsData = await fetchEvents(selectedOrgId);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    }
    setLoading(false);
  };

  const loadData = async () => {
    await Promise.all([loadResources(), loadEvents()]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.organizationId || formData.organizationId.trim() === '') {
      alert('Please select an organization');
      return;
    }
    try {
      const eventPayload = {
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        capacity: formData.capacity,
        organizationId: formData.organizationId,
      };
      if (formData.parentEventId) {
        eventPayload.parentEventId = formData.parentEventId;
      }
      await createEvent(eventPayload);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        capacity: 10,
        organizationId: selectedOrgId,
        parentEventId: null,
      });
      await loadData();
    } catch (error) {
      alert('Error creating event: ' + error.message);
    }
  };

  const handleAllocateResource = async (eventId, resourceId) => {
    try {
      await allocateResource(eventId, resourceId);
      await loadData();
    } catch (error) {
      alert('Error allocating resource: ' + error.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Create Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Organization</label>
              <select
                value={formData.organizationId}
                onChange={(e) => {
                  const orgId = e.target.value;
                  setFormData({ ...formData, organizationId: orgId });
                  setSelectedOrgId(orgId);
                }}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
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
            Create Event
          </button>
        </form>
      )}

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Start</th>
              <th className="px-4 py-2 text-left">End</th>
              <th className="px-4 py-2 text-left">Capacity</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b">
                <td className="px-4 py-2">{event.title}</td>
                <td className="px-4 py-2">
                  {new Date(event.startTime).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {new Date(event.endTime).toLocaleString()}
                </td>
                <td className="px-4 py-2">{event.capacity}</td>
                <td className="px-4 py-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAllocateResource(event.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="">Allocate Resource</option>
                    {resources.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.type})
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
