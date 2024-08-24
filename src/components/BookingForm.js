import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = ({ onBookingSuccess }) => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [carModel, setCarModel] = useState('');
    const [consultantName, setConsultantName] = useState('');
    const [location, setLocation] = useState(''); // New state for location
    const [carOptions, setCarOptions] = useState([
        'A200', 'A200d', 'C200', 'C220d', 'E200', 
        'E220d', 'E350d', 'S350d', 'S450'
    ].map(car => ({ name: car, unavailable: false })));
    const [timeOptions, setTimeOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setDate('');
        setStartTime('');
        setEndTime('');
        setCarModel('');
        setConsultantName('');
        setLocation(''); // Reset location
    };

    const fetchAvailableCars = useCallback(async () => {
        try {
            const { data } = await axios.get('https://booking-testing-backend.onrender.com/api/bookings');
            const bookedCars = data.filter(booking => {
                const bookingDate = booking.date;
                const bookingStartTime = booking.startTime;
                const bookingEndTime = booking.endTime;

                const selectedStart = new Date(`${date}T${startTime}`);
                const selectedEnd = new Date(`${date}T${endTime}`);
                const existingStart = new Date(`${bookingDate}T${bookingStartTime}`);
                const existingEnd = new Date(`${bookingDate}T${bookingEndTime}`);

                return bookingDate === date && (
                    (selectedStart >= existingStart && selectedStart < existingEnd) || 
                    (selectedEnd > existingStart && selectedEnd <= existingEnd) || 
                    (selectedStart <= existingStart && selectedEnd >= existingEnd)
                );
            }).map(booking => booking.carModel);

            setCarOptions(prevOptions =>
                prevOptions.map(car => ({
                    name: car.name,
                    unavailable: bookedCars.includes(car.name)
                }))
            );
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }, [date, startTime, endTime]);

    useEffect(() => {
        const generateTimeOptions = () => {
            const options = [];
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const selectedDate = new Date(date);

            let startHour = 1; 
            let endHour = 24; 

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
            fetchAvailableCars();
        }
    }, [date, startTime, endTime, fetchAvailableCars]);

    const submitHandler = async (e) => {
        e.preventDefault();
    
        if (!date || !startTime || !endTime) {
            alert('Please fill in all date and time fields.');
            return;
        }
    
        const selectedDateTime = new Date(`${date}T${startTime}`);
        const currentDateTime = new Date();
        currentDateTime.setSeconds(0, 0);

        if (selectedDateTime <= currentDateTime) {
            alert('You cannot book a car for a past time.');
            return;
        }
    
        if (startTime >= endTime) {
            alert('End time must be later than start time.');
            return;
        }
    
        setLoading(true);
    
        try {
            await axios.post('https://booking-testing-backend.onrender.com/api/bookings', {
                date,
                startTime,
                endTime,
                carModel,
                consultantName,
                location, // Include location in the booking data
            });
            setLoading(false);
            alert('Booking successful!');
            onBookingSuccess();
            resetForm();
            fetchAvailableCars();
        } catch (error) {
            setLoading(false);
            console.error('Error submitting booking:', error.response ? error.response.data : error.message);
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
                    min={new Date().toISOString().split('T')[0]} 
                />
            </div>
            <div className="form-group">
                <label>Start Time</label>
                <select 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                    required
                    disabled={!date}
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
                    disabled={!startTime}
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
                        <option 
                            key={car.name} 
                            value={car.unavailable ? '' : car.name} 
                            disabled={car.unavailable}
                        >
                            {car.name} {car.unavailable ? '(unavailable)' : ''}
                        </option>
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
            <div className="form-group">
                <label>Test Drive Location</label>
                <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="Enter test drive location" 
                    required 
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Booking...' : 'Book Test Drive'}
            </button>
            {loading && <div className="spinner"></div>}
        </form>
    );
};

export default BookingForm;
