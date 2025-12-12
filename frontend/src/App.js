import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/Dashboard';
import CourtManagement from './pages/admin/CourtManagement';
import PricingRules from './pages/admin/PricingRules';

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/courts" element={<CourtManagement />} />
        <Route path="/admin/coaches" element={<CourtManagement />} />
        <Route path="/admin/equipment" element={<CourtManagement />} />
        <Route path="/admin/pricing-rules" element={<PricingRules />} />
        <Route path="/admin/bookings" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
