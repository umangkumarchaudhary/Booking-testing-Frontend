// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import Dashboard from './pages/Dashboard';
import CompleteBookingPage from './pages/CompleteBookingPage';
import Header from './components/Header'; // Import Header component

const App = () => {
    return (
        <Router>
            <Header /> {/* Add the Header here */}
            <Routes>
                <Route path="/" element={<BookingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/complete-booking" element={<CompleteBookingPage />} />
            </Routes>
        </Router>
    );
};

export default App;
