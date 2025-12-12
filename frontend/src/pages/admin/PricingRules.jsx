import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { pricingRuleAPI } from '../../services/api';

const PricingRules = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        ruleType: 'peak',
        startTime: '',
        endTime: '',
        daysOfWeek: [],
        multiplier: 1,
        surcharge: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const response = await pricingRuleAPI.getAll();
            setRules(response.data.rules);
        } catch (error) {
            console.error('Error fetching rules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRule) {
                await pricingRuleAPI.update(editingRule._id, formData);
                alert('Pricing rule updated successfully');
            } else {
                await pricingRuleAPI.create(formData);
                alert('Pricing rule created successfully');
            }
            setShowModal(false);
            resetForm();
            fetchRules();
        } catch (error) {
            console.error('Error saving rule:', error);
            alert('Failed to save pricing rule');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this pricing rule?')) return;

        try {
            await pricingRuleAPI.delete(id);
            alert('Pricing rule deleted successfully');
            fetchRules();
        } catch (error) {
            console.error('Error deleting rule:', error);
            alert('Failed to delete pricing rule');
        }
    };

    const handleEdit = (rule) => {
        setEditingRule(rule);
        setFormData({
            name: rule.name,
            ruleType: rule.ruleType,
            startTime: rule.startTime || '',
            endTime: rule.endTime || '',
            daysOfWeek: rule.daysOfWeek || [],
            multiplier: rule.multiplier,
            surcharge: rule.surcharge,
            isActive: rule.isActive,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingRule(null);
        setFormData({
            name: '',
            ruleType: 'peak',
            startTime: '',
            endTime: '',
            daysOfWeek: [],
            multiplier: 1,
            surcharge: 0,
            isActive: true,
        });
    };

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-white">Pricing Rules</h1>
                    <Button onClick={() => { resetForm(); setShowModal(true); }}>
                        Add New Rule
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rules.map((rule) => (
                            <Card key={rule._id} hover>
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{rule.name}</h3>
                                            <p className="text-white/60 capitalize">{rule.ruleType}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${rule.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                            }`}>
                                            {rule.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="text-white/80 text-sm space-y-1">
                                        {rule.startTime && rule.endTime && (
                                            <div>Time: {rule.startTime} - {rule.endTime}</div>
                                        )}
                                        {rule.daysOfWeek && rule.daysOfWeek.length > 0 && (
                                            <div>Days: {rule.daysOfWeek.map(d => dayNames[d]).join(', ')}</div>
                                        )}
                                        {rule.multiplier > 1 && (
                                            <div>Multiplier: {rule.multiplier}x</div>
                                        )}
                                        {rule.surcharge > 0 && (
                                            <div>Surcharge: ${rule.surcharge}</div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleEdit(rule)}>
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(rule._id)}>
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
                    title={editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
                    size="lg"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-white font-semibold mb-2">Rule Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white font-semibold mb-2">Rule Type</label>
                            <select
                                value={formData.ruleType}
                                onChange={(e) => setFormData({ ...formData, ruleType: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                            >
                                <option value="peak" className="bg-gray-800">Peak Hours</option>
                                <option value="weekend" className="bg-gray-800">Weekend</option>
                                <option value="holiday" className="bg-gray-800">Holiday</option>
                                <option value="custom" className="bg-gray-800">Custom</option>
                            </select>
                        </div>

                        {(formData.ruleType === 'peak' || formData.ruleType === 'custom') && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white font-semibold mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white font-semibold mb-2">End Time</label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {(formData.ruleType === 'weekend' || formData.ruleType === 'custom') && (
                            <div>
                                <label className="block text-white font-semibold mb-2">Days of Week</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {dayNames.map((day, index) => (
                                        <label key={index} className="flex items-center gap-2 text-white text-sm">
                                            <input
                                                type="checkbox"
                                                checked={formData.daysOfWeek.includes(index)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, daysOfWeek: [...formData.daysOfWeek, index] });
                                                    } else {
                                                        setFormData({ ...formData, daysOfWeek: formData.daysOfWeek.filter(d => d !== index) });
                                                    }
                                                }}
                                                className="w-4 h-4"
                                            />
                                            {day.slice(0, 3)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white font-semibold mb-2">Multiplier</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    value={formData.multiplier}
                                    onChange={(e) => setFormData({ ...formData, multiplier: parseFloat(e.target.value) })}
                                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-white font-semibold mb-2">Surcharge ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.surcharge}
                                    onChange={(e) => setFormData({ ...formData, surcharge: parseFloat(e.target.value) })}
                                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-400 outline-none"
                                />
                            </div>
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
                            {editingRule ? 'Update Rule' : 'Create Rule'}
                        </Button>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};

export default PricingRules;
