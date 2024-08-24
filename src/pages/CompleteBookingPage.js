import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompleteBookingPage.css';

const CompleteBookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [filter, setFilter] = useState('today');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get('https://booking-testing-backend.onrender.com/api/bookings');
                setBookings(data);
                filterBookings(data, 'today'); // Default filter to today's bookings
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    const filterBookings = (bookings, filterType) => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        let filtered;

        switch (filterType) {
            case 'today':
                filtered = bookings.filter(booking => booking.date === today);
                break;
            case 'ongoing':
                filtered = bookings.filter(booking => {
                    const bookingStart = new Date(`${booking.date}T${booking.startTime}`);
                    const bookingEnd = new Date(`${booking.date}T${booking.endTime}`);
                    return now >= bookingStart && now <= bookingEnd;
                });
                break;
            case 'upcoming':
                filtered = bookings.filter(booking => new Date(`${booking.date}T${booking.startTime}`) > now);
                break;
            default:
                filtered = [];
        }

        setFilteredBookings(filtered);
    };

    const handleFilterClick = (filterType) => {
        setFilter(filterType);
        filterBookings(bookings, filterType);
    };

    const handleSearch = () => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const searchedBookings = bookings.filter(booking =>
            booking.carModel.toLowerCase().includes(lowercasedSearchTerm) ||
            booking.consultantName.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredBookings(searchedBookings);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        filterBookings(bookings, filter); // Reapply current filter without search
    };

    return (
        <div className="complete-booking-page">
            <div className="filter-buttons">
                <button 
                    onClick={() => handleFilterClick('today')} 
                    className={filter === 'today' ? 'active' : ''}
                >
                    Today's Test Drive
                </button>
                <button 
                    onClick={() => handleFilterClick('ongoing')} 
                    className={filter === 'ongoing' ? 'active' : ''}
                >
                    Ongoing Test Drive
                </button>
                <button 
                    onClick={() => handleFilterClick('upcoming')} 
                    className={filter === 'upcoming' ? 'active' : ''}
                >
                    Upcoming Test Drive
                </button>
                <button 
                    onClick={() => alert('Updatation feature will be implemented later.')}
                >
                    Updatation
                </button>
            </div>
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search by car model or consultant" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <button onClick={handleSearch}>Search</button>
                {searchTerm && <button onClick={handleClearSearch} className="clear-search">Clear Search</button>}
            </div>
            <div className="booking-table-container">
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Car Model</th>
                            <th>Sales Consultant</th>
                            <th>Location</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map(booking => (
                                <tr key={booking._id}>
                                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                                    <td>{booking.carModel}</td>
                                    <td>{booking.consultantName}</td>
                                    <td>{booking.location}</td>
                                    <td>{booking.startTime} - {booking.endTime}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No bookings available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompleteBookingPage;
