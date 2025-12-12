import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { bookingAPI, userAPI } from '../services/api';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    const fetchUserBookings = async (email) => {
        setLoading(true);
        try {
            // Find user by email
            const usersRes = await userAPI.getAll();
            const user = usersRes.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (user) {
                const bookingsRes = await bookingAPI.getUserBookings(user._id);
                setBookings(bookingsRes.data.bookings);
            } else {
                setBookings([]);
                alert('No user found with this email');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await bookingAPI.cancel(bookingId);
            alert('Booking cancelled successfully');
            fetchUserBookings(userEmail);
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500/20 text-green-300 border-green-500/50';
            case 'cancelled':
                return 'bg-red-500/20 text-red-300 border-red-500/50';
            case 'completed':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        My Bookings
                    </h1>
                    <p className="text-white/80 text-lg">
                        View and manage your court bookings
                    </p>
                </div>

                {/* Email Input */}
                <Card>
                    <div className="flex gap-4">
                        <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="Enter your email to view bookings"
                            className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                        />
                        <Button onClick={() => fetchUserBookings(userEmail)} disabled={!userEmail}>
                            View Bookings
                        </Button>
                    </div>
                </Card>

                {/* Bookings List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner" />
                    </div>
                ) : bookings.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-white/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-white/60 text-lg">No bookings found</p>
                            <Button className="mt-4" onClick={() => navigate('/')}>
                                Book a Court
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <Card key={booking._id} hover>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">
                                                {booking.court?.name || 'Court'}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/80">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{format(new Date(booking.startTime), 'MMM dd, yyyy')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>
                                                    {format(new Date(booking.startTime), 'HH:mm')} - {format(new Date(booking.endTime), 'HH:mm')}
                                                </span>
                                            </div>
                                        </div>

                                        {booking.resources?.coach && (
                                            <div className="mt-2 text-white/70 text-sm">
                                                Coach: {booking.resources.coach.name}
                                            </div>
                                        )}

                                        {(booking.resources?.rackets > 0 || booking.resources?.shoes > 0) && (
                                            <div className="mt-1 text-white/70 text-sm">
                                                Equipment:
                                                {booking.resources.rackets > 0 && ` ${booking.resources.rackets} Racket(s)`}
                                                {booking.resources.rackets > 0 && booking.resources.shoes > 0 && ', '}
                                                {booking.resources.shoes > 0 && ` ${booking.resources.shoes} Shoe(s)`}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-white">
                                                ${booking.pricingBreakdown?.total.toFixed(2)}
                                            </div>
                                            <div className="text-white/60 text-sm">Total Price</div>
                                        </div>

                                        {booking.status === 'confirmed' && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleCancelBooking(booking._id)}
                                            >
                                                Cancel Booking
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyBookings;
