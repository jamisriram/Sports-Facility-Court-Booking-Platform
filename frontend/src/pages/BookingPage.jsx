import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import TimeSlotGrid from '../components/TimeSlotGrid';
import PriceBreakdown from '../components/PriceBreakdown';
import { courtAPI, coachAPI, utilsAPI, bookingAPI, userAPI } from '../services/api';

const BookingPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [courts, setCourts] = useState([]);
    const [coaches, setCoaches] = useState([]);

    const [selectedCourt, setSelectedCourt] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [rackets, setRackets] = useState(0);
    const [shoes, setShoes] = useState(0);
    const [pricing, setPricing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pricingLoading, setPricingLoading] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });

    // Generate time slots (6 AM to 10 PM, 1-hour slots)
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 6; hour <= 21; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            slots.push({ time, available: true }); // We'll check availability later
        }
        return slots;
    };

    const [timeSlots] = useState(generateTimeSlots());

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [courtsRes, coachesRes] = await Promise.all([
                courtAPI.getAll(),
                coachAPI.getAll(),
            ]);
            setCourts(courtsRes.data.courts.filter(c => c.isActive));
            setCoaches(coachesRes.data.coaches.filter(c => c.isAvailable));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        calculatePrice(slot);
    };

    const calculatePrice = async (slot) => {
        if (!selectedCourt || !slot) return;

        setPricingLoading(true);
        try {
            const startTime = new Date(selectedDate);
            const [hour] = slot.time.split(':');
            startTime.setHours(parseInt(hour), 0, 0, 0);

            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + 1);

            const response = await utilsAPI.calculatePrice({
                courtId: selectedCourt._id,
                coachId: selectedCoach?._id,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                rackets,
                shoes,
            });

            setPricing(response.data.pricing);
        } catch (error) {
            console.error('Error calculating price:', error);
        } finally {
            setPricingLoading(false);
        }
    };

    useEffect(() => {
        if (selectedSlot && selectedCourt) {
            calculatePrice(selectedSlot);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCoach, rackets, shoes]);

    const handleBooking = async () => {
        if (!userInfo.name || !userInfo.email || !userInfo.phone) {
            alert('Please fill in all user information');
            return;
        }

        setLoading(true);
        try {
            // Create or find user
            const userRes = await userAPI.createOrFind(userInfo);
            const userId = userRes.data.user._id;

            // Prepare booking data
            const startTime = new Date(selectedDate);
            const [hour] = selectedSlot.time.split(':');
            startTime.setHours(parseInt(hour), 0, 0, 0);

            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + 1);

            const bookingData = {
                userId,
                courtId: selectedCourt._id,
                coachId: selectedCoach?._id,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                rackets,
                shoes,
                pricingBreakdown: pricing,
            };

            await bookingAPI.create(bookingData);

            alert('Booking confirmed successfully!');
            setShowBookingModal(false);
            resetForm();
        } catch (error) {
            console.error('Booking error:', error);
            alert(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedSlot(null);
        setSelectedCoach(null);
        setRackets(0);
        setShoes(0);
        setPricing(null);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Book Your Court
                    </h1>
                    <p className="text-white/80 text-lg">
                        Select a court, choose your time slot, and book instantly
                    </p>
                </div>

                {/* Court Selection */}
                <Card>
                    <h2 className="text-2xl font-bold text-white mb-4">Select Court</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {courts.map((court) => (
                            <button
                                key={court._id}
                                onClick={() => {
                                    setSelectedCourt(court);
                                    resetForm();
                                }}
                                className={`p-4 rounded-lg border-2 transition-all ${selectedCourt?._id === court._id
                                    ? 'border-blue-400 bg-blue-500/20 ring-2 ring-blue-300'
                                    : 'border-white/20 hover:border-white/40 bg-white/5'
                                    }`}
                            >
                                <h3 className="text-lg font-semibold text-white">{court.name}</h3>
                                <p className="text-white/60 text-sm capitalize">{court.type}</p>
                                <p className="text-white/80 mt-2">${court.basePrice}/hour</p>
                            </button>
                        ))}
                    </div>
                </Card>

                {selectedCourt && (
                    <>
                        {/* Date Selection */}
                        <Card>
                            <h2 className="text-2xl font-bold text-white mb-4">Select Date</h2>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                                    const date = addDays(new Date(), offset);
                                    const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

                                    return (
                                        <button
                                            key={offset}
                                            onClick={() => {
                                                setSelectedDate(date);
                                                setSelectedSlot(null);
                                            }}
                                            className={`flex-shrink-0 p-4 rounded-lg border-2 transition-all min-w-[100px] ${isSelected
                                                ? 'border-blue-400 bg-blue-500/20'
                                                : 'border-white/20 hover:border-white/40 bg-white/5'
                                                }`}
                                        >
                                            <div className="text-white/60 text-xs">{format(date, 'EEE')}</div>
                                            <div className="text-white font-bold text-xl">{format(date, 'dd')}</div>
                                            <div className="text-white/60 text-xs">{format(date, 'MMM')}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Time Slots */}
                        <Card>
                            <TimeSlotGrid
                                date={selectedDate}
                                slots={timeSlots}
                                onSlotSelect={handleSlotSelect}
                                selectedSlot={selectedSlot}
                            />
                        </Card>

                        {selectedSlot && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Resources */}
                                <Card>
                                    <h2 className="text-2xl font-bold text-white mb-6">Add Resources</h2>

                                    {/* Coach Selection */}
                                    <div className="mb-6">
                                        <label className="block text-white font-semibold mb-3">Coach (Optional)</label>
                                        <select
                                            value={selectedCoach?._id || ''}
                                            onChange={(e) => {
                                                const coach = coaches.find(c => c._id === e.target.value);
                                                setSelectedCoach(coach || null);
                                            }}
                                            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                                        >
                                            <option value="">No coach</option>
                                            {coaches.map((coach) => (
                                                <option key={coach._id} value={coach._id} className="bg-gray-800">
                                                    {coach.name} - {coach.specialization} (${coach.hourlyRate}/hr)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Equipment */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-white font-semibold mb-2">Rackets</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                value={rackets}
                                                onChange={(e) => setRackets(parseInt(e.target.value) || 0)}
                                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white font-semibold mb-2">Shoes</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                value={shoes}
                                                onChange={(e) => setShoes(parseInt(e.target.value) || 0)}
                                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                                            />
                                        </div>
                                    </div>
                                </Card>

                                {/* Price Breakdown */}
                                <div className="space-y-4">
                                    <PriceBreakdown pricing={pricing} loading={pricingLoading} />

                                    <Button
                                        variant="success"
                                        size="lg"
                                        className="w-full"
                                        onClick={() => setShowBookingModal(true)}
                                        disabled={!pricing}
                                    >
                                        Proceed to Book
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Booking Modal */}
                <Modal
                    isOpen={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                    title="Complete Your Booking"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white font-semibold mb-2">Name</label>
                            <input
                                type="text"
                                value={userInfo.name}
                                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                value={userInfo.email}
                                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">Phone</label>
                            <input
                                type="tel"
                                value={userInfo.phone}
                                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        <div className="pt-4">
                            <PriceBreakdown pricing={pricing} />
                        </div>

                        <Button
                            variant="success"
                            size="lg"
                            className="w-full"
                            onClick={handleBooking}
                            loading={loading}
                        >
                            Confirm Booking
                        </Button>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
};

export default BookingPage;
