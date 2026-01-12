import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import ResourcesPage from './pages/ResourcesPage';
import AttendancePage from './pages/AttendancePage';
import ReportingPage from './pages/ReportingPage';

function App() {
  const [selectedOrg, setSelectedOrg] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold">Event Booking System</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/events"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Events
                  </Link>
                  <Link
                    to="/resources"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Resources
                  </Link>
                  <Link
                    to="/attendance"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Attendance
                  </Link>
                  <Link
                    to="/reporting"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Reporting
                  </Link>
                </div>
              </div>
              {/* <div className="flex items-center">
                <select
                  value={selectedOrg || ''}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="">Select Organization</option>
                  <option value="org1">Organization 1</option>
                  <option value="org2">Organization 2</option>
                </select>
              </div> */}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<EventsPage organizationId={selectedOrg} />} />
            <Route path="/events" element={<EventsPage organizationId={selectedOrg} />} />
            <Route path="/resources" element={<ResourcesPage organizationId={selectedOrg} />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/reporting" element={<ReportingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
