import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './Dashboard.css';

const Dashboard = ({ refreshTrigger }) => {
    const [bookings, setBookings] = useState([]);

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

    // Get today's date in 'YYYY-MM-DD' format
    const today = new Date().toISOString().split('T')[0];

    // Filter bookings for today
    const todaysBookings = bookings.filter(booking => 
        new Date(booking.date).toISOString().split('T')[0] === today
    );

    // Prepare data for the graph
    const graphData = todaysBookings.map(booking => {
        const startTime = new Date(`1970-01-01T${booking.startTime}:00`);
        const endTime = new Date(`1970-01-01T${booking.endTime}:00`);
        const startMinutes = startTime.getHours() * 60 + startTime.getMinutes(); // Convert to minutes
        const endMinutes = endTime.getHours() * 60 + endTime.getMinutes(); // Convert to minutes
        const duration = endMinutes - startMinutes; // Duration in minutes

        return {
            carModel: booking.carModel,
            startTimeMinutes: startMinutes,
            duration, // Duration in minutes
            startTimeLabel: startTime.toTimeString().slice(0, 5), // 24-hour format
            endTimeLabel: endTime.toTimeString().slice(0, 5), // 24-hour format
        };
    });

    return (
        <div className="dashboard">
            <h2>Today's Bookings</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={graphData} layout="vertical" barCategoryGap="20%">
                    <XAxis 
                        type="number" 
                        domain={[0, 24 * 60]} // This sets the domain from 0 to 1440 minutes (24 hours)
                        tickFormatter={(tick) => {
                            const hours = Math.floor(tick / 60);
                            const minutes = tick % 60;
                            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; // 24-hour format
                        }}
                        label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }}
                        ticks={Array.from({ length: 25 }, (_, i) => i * 60)} // Ticks every hour from 0 to 24
                    />
                    <YAxis type="category" dataKey="carModel" />
                    <Tooltip 
                        labelFormatter={(label) => {
                            if (label === undefined) return '';
                            const hours = Math.floor(label / 60);
                            const minutes = label % 60;
                            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; // 24-hour format
                        }}
                        formatter={(value, name, props) => {
                            if (!props.payload || props.payload.startTimeLabel === undefined || props.payload.endTimeLabel === undefined) {
                                return '';
                            }
                            const timeLabel = `${props.payload.startTimeLabel} - ${props.payload.endTimeLabel}`;
                            return timeLabel;
                        }}
                    />
                    <Bar 
                        dataKey="duration" 
                        fill="#8884d8"
                        background={{ fill: '#eee' }}
                        isAnimationActive={false}
                    >
                        {graphData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill="#8884d8"
                                x={entry.startTimeMinutes} // Adjust the x position by the start time
                                width={entry.duration} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Dashboard;
