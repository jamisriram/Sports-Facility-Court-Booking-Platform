import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { courtAPI, coachAPI, equipmentAPI, pricingRuleAPI, bookingAPI } from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        courts: 0,
        coaches: 0,
        equipment: 0,
        rules: 0,
        bookings: 0,
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [courtsRes, coachesRes, equipmentRes, rulesRes, bookingsRes] = await Promise.all([
                courtAPI.getAll(),
                coachAPI.getAll(),
                equipmentAPI.getAll(),
                pricingRuleAPI.getAll(),
                bookingAPI.getAll(),
            ]);

            setStats({
                courts: courtsRes.data.count,
                coaches: coachesRes.data.count,
                equipment: equipmentRes.data.count,
                rules: rulesRes.data.count,
                bookings: bookingsRes.data.count,
            });

            setRecentBookings(bookingsRes.data.bookings.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Courts', value: stats.courts, icon: '🏟️', color: 'from-blue-500 to-blue-600' },
        { label: 'Total Coaches', value: stats.coaches, icon: '👨‍🏫', color: 'from-green-500 to-green-600' },
        { label: 'Equipment Items', value: stats.equipment, icon: '🎾', color: 'from-purple-500 to-purple-600' },
        { label: 'Pricing Rules', value: stats.rules, icon: '💰', color: 'from-yellow-500 to-yellow-600' },
        { label: 'Total Bookings', value: stats.bookings, icon: '📅', color: 'from-pink-500 to-pink-600' },
    ];

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="spinner" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Admin Dashboard
                    </h1>
                    <p className="text-white/80 text-lg">
                        Manage your sports facility
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {statCards.map((stat, index) => (
                        <Card key={index} hover>
                            <div className="text-center">
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                                    {stat.value}
                                </div>
                                <div className="text-white/70 text-sm">{stat.label}</div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <Card>
                    <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button onClick={() => window.location.href = '/admin/courts'}>
                            Add Court
                        </Button>
                        <Button onClick={() => window.location.href = '/admin/coaches'}>
                            Add Coach
                        </Button>
                        <Button onClick={() => window.location.href = '/admin/equipment'}>
                            Add Equipment
                        </Button>
                        <Button onClick={() => window.location.href = '/admin/pricing-rules'}>
                            Add Rule
                        </Button>
                    </div>
                </Card>

                {/* Recent Bookings */}
                <Card>
                    <h2 className="text-2xl font-bold text-white mb-4">Recent Bookings</h2>
                    {recentBookings.length === 0 ? (
                        <p className="text-white/60 text-center py-8">No bookings yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentBookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                                >
                                    <div>
                                        <div className="text-white font-semibold">{booking.court?.name}</div>
                                        <div className="text-white/60 text-sm">{booking.user?.name}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-semibold">${booking.pricingBreakdown?.total.toFixed(2)}</div>
                                        <div className="text-white/60 text-sm capitalize">{booking.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
