import React, { useState, useEffect } from 'react';
import { fetchEvents, registerForEvent, getEventAttendees, fetchUsers, getUserAttendances } from '../api/api';

export default function AttendancePage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventData, setSelectedEventData] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [users, setUsers] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    eventId: '',
    userId: '',
    email: '',
    name: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadAttendees(selectedEvent);
      // Find the event data to get organizationId
      const event = events.find(e => e.id === selectedEvent);
      setSelectedEventData(event);
      if (event && event.organizationId) {
        loadUsers(event.organizationId);
      } else {
        setUsers([]);
      }
    }
  }, [selectedEvent, events]);

  const loadEvents = async () => {
    setLoading(true);
    const data = await fetchEvents();
    setEvents(data);
    setLoading(false);
  };

  const loadAttendees = async (eventId) => {
    const data = await getEventAttendees(eventId);
    console.log(data,' DATA GET EVENT ATTENDEES');
    
    setAttendees(data);
  };

  const loadUsers = async (organizationId) => {
    setLoadingUsers(true);
    try {
      const data = await fetchUsers(organizationId);
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
    setLoadingUsers(false);
  };

  const loadUserEvents = async (userId) => {
    if (!userId) {
      setUserEvents([]);
      return;
    }
    try {
      const data = await getUserAttendances(userId);
      setUserEvents(data);
    } catch (error) {
      console.error('Error loading user events:', error);
      setUserEvents([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerForEvent(
        formData.eventId,
        formData.userId || undefined,
        formData.email || undefined,
        formData.name || undefined,
      );
      console.log(formData,' FORM DATA REGISTER FOR EVENT');
      
      const eventId = formData.eventId;
      setFormData({
        eventId: '',
        userId: '',
        email: '',
        name: '',
      });
      setSelectedEvent(null);
      setSelectedEventData(null);
      setUsers([]);
      if (eventId) {
        loadAttendees(eventId);
      }
      alert('Registration successful!');
    } catch (error) {
      alert('Error registering: ' + error.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Register for Event</h2>
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event</label>
              <select
                value={formData.eventId}
                onChange={(e) => {
                  setFormData({ ...formData, eventId: e.target.value });
                  setSelectedEvent(e.target.value);
                }}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {new Date(event.startTime).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">User (optional)</label>
              <select
                value={formData.userId}
                onChange={(e) => {
                  const userId = e.target.value;
                  setFormData({ 
                    ...formData, 
                    userId: userId || '',
                    email: '', // Clear external fields when user is selected
                    name: ''
                  });
                  setSelectedUserId(userId || '');
                  loadUserEvents(userId || '');
                }}
                className="w-full border rounded px-3 py-2"
                disabled={!formData.eventId || loadingUsers}
              >
                <option value="">Select User (or leave empty for external attendee)</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {loadingUsers && (
                <p className="text-sm text-gray-500 mt-1">Loading users...</p>
              )}
              {selectedUserId && userEvents.length > 0 && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                  <p className="font-medium mb-1">User is registered for:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {userEvents.map((attendee) => (
                      <li key={attendee.id}>
                        {attendee.event?.title} - {new Date(attendee.event?.startTime).toLocaleString()} to {new Date(attendee.event?.endTime).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {!formData.userId && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email (for external)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter email for external attendee"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name (for external)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter name for external attendee"
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Register
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Event Attendees</h2>
          {selectedEvent ? (
            <div className="bg-white p-4 rounded shadow">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((attendee) => (
                    <tr key={attendee.id} className="border-b">
                      <td className="px-4 py-2">
                        {attendee.user?.name || attendee.name}
                      </td>
                      <td className="px-4 py-2">
                        {attendee.user?.email || attendee.email}
                      </td>
                      <td className="px-4 py-2">
                        {attendee.userId ? 'User' : 'External'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-4 rounded shadow text-gray-500">
              Select an event to view attendees
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
