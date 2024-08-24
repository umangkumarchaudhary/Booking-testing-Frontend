import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingList.css';

const BookingList = ({ refreshTrigger }) => {
    const [bookings, setBookings] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get('/api/bookings');
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
        fetchBookings();
    }, [refreshTrigger]);

    const sortedBookings = [...bookings].sort((a, b) => {
        if (sortOrder === 'asc') {
            return new Date(a.date) - new Date(b.date);
        }
        return new Date(b.date) - new Date(a.date);
    });

    const filteredBookings = sortedBookings.filter(booking =>
        booking.carModel.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="booking-list">
            <h2>Current Bookings</h2>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Filter by car model"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-input"
                />
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="sort-button">
                    Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </button>
            </div>
            <ul>
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <li key={booking._id}>
                            <div className="booking-details">
                                <span className="booking-date">{booking.date}</span> - 
                                <span className="booking-car">{booking.carModel}</span> booked by 
                                <span className="booking-consultant">{booking.consultantName}</span> 
                                from <span className="booking-time">{booking.startTime}</span> to 
                                <span className="booking-time">{booking.endTime}</span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>No bookings available</li>
                )}
            </ul>
        </div>
    );
};

export default BookingList;
