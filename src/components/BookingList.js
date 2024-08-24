import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingList.css';

const BookingList = ({ refreshTrigger }) => {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get('https://booking-testing-backend.onrender.com/api/bookings');
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [refreshTrigger]);

    const sortedBookings = [...bookings].sort((a, b) => new Date(b.date) - new Date(a.date));

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
            </div>
            <ul>
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <li key={booking._id} className="booking-item">
                            <div className="booking-details">
                                <div className="booking-detail">
                                    <span className="detail-label">Date:</span> 
                                    <span className="detail-value">{new Date(booking.date).toLocaleDateString()}</span>
                                </div>
                                <div className="booking-detail">
                                    <span className="detail-label">Car Model:</span> 
                                    <span className="detail-value">{booking.carModel}</span>
                                </div>
                                <div className="booking-detail">
                                    <span className="detail-label">Sales Consultant:</span> 
                                    <span className="detail-value">{booking.consultantName}</span>
                                </div>
                                <div className="booking-detail">
                                    <span className="detail-label">Location:</span> 
                                    <span className="detail-value">{booking.location}</span>
                                </div>
                                <div className="booking-detail booking-time-box">
                                    <span className="detail-label">Time:</span> 
                                    <span className="detail-value">{booking.startTime} - {booking.endTime}</span>
                                </div>
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
