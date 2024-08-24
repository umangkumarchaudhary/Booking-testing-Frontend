import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = ({ onBookingSuccess }) => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [carModel, setCarModel] = useState('');
    const [consultantName, setConsultantName] = useState('');
    const [carOptions, setCarOptions] = useState([
        'A200', 'A200d', 'C200', 'C220d', 'E200', 
        'E220d', 'E350d', 'S350d', 'S450'
    ]);
    const [timeOptions, setTimeOptions] = useState([]);
    const [loading, setLoading] = useState(false); // Added loading state

    useEffect(() => {
        const generateTimeOptions = () => {
            const options = [];
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const selectedDate = new Date(date);

            let startHour = 9; // Start at 9 AM
            let endHour = 19; // End at 7 PM

            if (selectedDate.toDateString() === now.toDateString()) {
                startHour = currentHour;
                if (currentMinute >= 30) {
                    startHour += 1;
                }
            }

            for (let hour = startHour; hour <= endHour; hour++) {
                options.push(`${hour < 10 ? '0' + hour : hour}:00`);
                if (hour !== endHour) {
                    options.push(`${hour < 10 ? '0' + hour : hour}:30`);
                }
            }

            setTimeOptions(options);
        };

        if (date) {
            generateTimeOptions();
        }
    }, [date]);

    useEffect(() => {
        if (date && startTime && endTime) {
            const fetchAvailableCars = async () => {
                try {
                    const { data } = await axios.get('/api/bookings');
                    const bookedCars = data.filter(
                        booking => booking.date === date &&
                        (booking.startTime < endTime && booking.endTime > startTime)
                    ).map(booking => booking.carModel);
                    
                    setCarOptions(prevOptions =>
                        prevOptions.filter(car => !bookedCars.includes(car))
                    );
                } catch (error) {
                    console.error('Error fetching bookings:', error);
                }
            };
            fetchAvailableCars();
        }
    }, [date, startTime, endTime]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (new Date(date) < new Date()) {
            alert('You cannot book a car for a past date.');
            return;
        }

        if (startTime >= endTime) {
            alert('End time must be later than start time.');
            return;
        }

        setLoading(true); // Start loading animation

        try {
            await axios.post('/api/bookings', {
                date,
                startTime,
                endTime,
                carModel,
                consultantName,
            });
            setLoading(false); // Stop loading animation
            alert('Booking successful!');
            onBookingSuccess();  // Trigger the callback to update the booking list
        } catch (error) {
            setLoading(false); // Stop loading animation
            console.error('Error submitting booking:', error);
            alert('Car is already booked for this time.');
        }
    };

    return (
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Date</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                    min={new Date().toISOString().split('T')[0]} // Disable past dates
                />
            </div>
            <div className="form-group">
                <label>Start Time</label>
                <select 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                    required
                    disabled={!date} // Disable until date is selected
                >
                    <option value="">Select Start Time</option>
                    {timeOptions.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>End Time</label>
                <select 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)} 
                    required
                    disabled={!startTime} // Disable until start time is selected
                >
                    <option value="">Select End Time</option>
                    {timeOptions.filter(time => time > startTime).map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Car Model</label>
                <select value={carModel} onChange={(e) => setCarModel(e.target.value)} required>
                    <option value="">Select Car Model</option>
                    {carOptions.map((car) => (
                        <option key={car} value={car}>{car}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Consultant Name</label>
                <select value={consultantName} onChange={(e) => setConsultantName(e.target.value)} required>
                    <option value="">Select Consultant</option>
                    <option value="Umang">Umang</option>
                    <option value="King">King</option>
                    <option value="Harsh">Harsh</option>
                    <option value="Aditya">Aditya</option>
                    <option value="Shefali Jain">Shefali Jain</option>
                    <option value="Amogh">Amogh</option>
                    <option value="Nidhi">Nidhi</option>
                    <option value="Imaad">Imaad</option>
                    <option value="Durgesh">Durgesh</option>
                    <option value="Vaibhav">Vaibhav</option>
                    <option value="Sushil">Sushil</option>
                </select>
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Booking...' : 'Book Test Drive'}
            </button>
            {loading && <div className="spinner"></div>} {/* Loading spinner */}
        </form>
    );
};

export default BookingForm;
