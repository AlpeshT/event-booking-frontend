# Event Booking Frontend

React frontend for the multi-tenant event booking system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

- **Events Management**: Create and manage events with scheduling constraints
- **Resource Management**: Create and allocate resources (exclusive/shareable/consumable)
- **Attendance**: Register users and external attendees for events
- **Reporting**: View complex analytics including:
  - Double-booked users
  - Events violating resource constraints
  - Resource utilization per organization
  - Invalid parent-child event relationships
  - Events with high external attendee counts

## Pages

- `/events` - Event list and creation
- `/resources` - Resource management
- `/attendance` - Registration and attendee management
- `/reporting` - Analytics dashboard
