import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { courtAPI } from '../../services/api';

const CourtManagement = () => {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCourt, setEditingCourt] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'indoor',
        basePrice: '',
        isActive: true,
    });

    useEffect(() => {
        fetchCourts();
    }, []);

    const fetchCourts = async () => {
        try {
            const response = await courtAPI.getAll();
            setCourts(response.data.courts);
        } catch (error) {
            console.error('Error fetching courts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCourt) {
                await courtAPI.update(editingCourt._id, formData);
                alert('Court updated successfully');
            } else {
                await courtAPI.create(formData);
                alert('Court created successfully');
            }
            setShowModal(false);
            resetForm();
            fetchCourts();
        } catch (error) {
            console.error('Error saving court:', error);
            alert('Failed to save court');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this court?')) return;

        try {
            await courtAPI.delete(id);
            alert('Court deleted successfully');
            fetchCourts();
        } catch (error) {
            console.error('Error deleting court:', error);
            alert('Failed to delete court');
        }
    };

    const handleEdit = (court) => {
        setEditingCourt(court);
        setFormData({
            name: court.name,
            type: court.type,
            basePrice: court.basePrice,
            isActive: court.isActive,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingCourt(null);
        setFormData({
            name: '',
            type: 'indoor',
            basePrice: '',
            isActive: true,
        });
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-white">Court Management</h1>
                    <Button onClick={() => { resetForm(); setShowModal(true); }}>
                        Add New Court
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courts.map((court) => (
                            <Card key={court._id} hover>
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{court.name}</h3>
                                            <p className="text-white/60 capitalize">{court.type}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${court.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                            }`}>
                                            {court.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="text-2xl font-bold text-white">
                                        ${court.basePrice}/hour
                                    </div>

                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleEdit(court)}>
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(court._id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={() => { setShowModal(false); resetForm(); }}
                    title={editingCourt ? 'Edit Court' : 'Add New Court'}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-white font-semibold mb-2">Court Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white font-semibold mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                            >
                                <option value="indoor" className="bg-gray-800">Indoor</option>
                                <option value="outdoor" className="bg-gray-800">Outdoor</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-white font-semibold mb-2">Base Price (per hour)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.basePrice}
                                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5"
                            />
                            <label className="text-white">Active</label>
                        </div>

                        <Button type="submit" className="w-full">
                            {editingCourt ? 'Update Court' : 'Create Court'}
                        </Button>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};

export default CourtManagement;
