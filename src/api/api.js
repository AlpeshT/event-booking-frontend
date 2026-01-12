const API_URL = 'http://localhost:3000';

export async function fetchOrganizations() {
  const res = await fetch(`${API_URL}/organizations`);
  return res.json();
}

export async function fetchUsers(organizationId) {
  const url = organizationId
    ? `${API_URL}/users?organizationId=${organizationId}`
    : `${API_URL}/users`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchEvents(organizationId) {
  const url = organizationId
    ? `${API_URL}/events?organizationId=${organizationId}`
    : `${API_URL}/events`;
  const res = await fetch(url);
  return res.json();
}

export async function createEvent(data) {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateEvent(id, data) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteEvent(id) {
  await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchResources(organizationId) {
  const url = organizationId
    ? `${API_URL}/resources?organizationId=${organizationId}`
    : `${API_URL}/resources`;
  const res = await fetch(url);
  return res.json();
}

export async function createResource(data) {
  const res = await fetch(`${API_URL}/resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function allocateResource(eventId, resourceId, quantity = 1) {
  const res = await fetch(`${API_URL}/events/${eventId}/resources/${resourceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to allocate resource');
  }
  return res.json();
}

export async function registerForEvent(eventId, userId, email, name) {
  const res = await fetch(`${API_URL}/attendance/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId, userId, email, name }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to register for event');
  }
  return res.json();
}

export async function getEventAttendees(eventId) {
  const res = await fetch(`${API_URL}/attendance/event/${eventId}`);
  return res.json();
}

export async function getUserAttendances(userId) {
  const res = await fetch(`${API_URL}/attendance/user/${userId}`);
  return res.json();
}

export async function getDoubleBookedUsers() {
  const res = await fetch(`${API_URL}/reporting/double-booked-users`);
  return res.json();
}

export async function getViolatingEvents() {
  const res = await fetch(`${API_URL}/reporting/violating-events`);
  return res.json();
}

export async function getResourceUtilization() {
  const res = await fetch(`${API_URL}/reporting/resource-utilization`);
  return res.json();
}

export async function getInvalidParentEvents() {
  const res = await fetch(`${API_URL}/reporting/invalid-parent-events`);
  return res.json();
}

export async function getEventsWithExternalAttendees(threshold = 10) {
  const res = await fetch(`${API_URL}/reporting/external-attendees?threshold=${threshold}`);
  return res.json();
}

export async function getUnderutilizedResources(minUsageHours = 10) {
  const res = await fetch(`${API_URL}/reporting/underutilized-resources?minUsageHours=${minUsageHours}`);
  return res.json();
}
