import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';  // Assuming you're using 'react-calendar' package
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [date, setDate] = useState(new Date());
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
                const { data } = await axios.get(`/api/bookings?date=${formattedDate}`);
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
        fetchBookings();
    }, [date]);

    const carModels = ['A200', 'C200', 'E350']; // Add all your car models here
    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00']; // 30-minute intervals

    const isTimeSlotBooked = (slot, booking) => {
        const slotTime = parseInt(slot.replace(':', ''), 10);
        const startTime = parseInt(booking.startTime.replace(':', ''), 10);
        const endTime = parseInt(booking.endTime.replace(':', ''), 10);

        return slotTime >= startTime && slotTime < endTime;
    };

    return (
        <div className="dashboard">
            <Calendar onChange={setDate} value={date} />
            <div className="graph">
                <table className="calendar">
                    <thead>
                        <tr>
                            <th>Car Model</th>
                            {timeSlots.map((slot, index) => (
                                <th key={index}>{slot}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {carModels.map((model, i) => (
                            <tr key={i}>
                                <td>{model}</td>
                                {timeSlots.map((slot, j) => (
                                    <td key={j} className="time-slot">
                                        {bookings.map((booking, k) => (
                                            booking.carModel === model && 
                                            isTimeSlotBooked(slot, booking) ? (
                                                <div key={k} className="booking-block"></div>
                                            ) : null
                                        ))}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
