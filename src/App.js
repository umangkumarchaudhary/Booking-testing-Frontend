import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import Dashboard from './pages/Dashboard'; // Ensure this matches the component name

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BookingPage />} />
                <Route path="/dashboard" element={<Dashboard />} /> {/* Use Dashboard here */}
            </Routes>
        </Router>
    );
};

export default App;
