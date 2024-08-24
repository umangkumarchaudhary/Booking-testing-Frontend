import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingPage.css';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';

const BookingPage = () => {
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get(`https://booking-testing-backend.onrender.com/api/bookings`);
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };
    

    useEffect(() => {
        fetchBookings(); // Fetch bookings when the component mounts
    }, []);

    const handleBookingSuccess = () => {
        fetchBookings(); // Re-fetch bookings when a new booking is made
    };

    return (
        <div className="booking-page">
            <h1 className="title">Book a Test Drive</h1>
            <div className="form-container">
                <BookingForm onBookingSuccess={handleBookingSuccess} />
            </div>
            <div className="list-container">
                <BookingList bookings={bookings} />
            </div>
        </div>
    );
};

export default BookingPage;
