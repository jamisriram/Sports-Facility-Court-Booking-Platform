import React from 'react';

const PriceBreakdown = ({ pricing, loading = false }) => {
    if (loading) {
        return (
            <div className="glass-dark rounded-xl p-6">
                <div className="flex items-center justify-center">
                    <div className="spinner" />
                </div>
            </div>
        );
    }

    if (!pricing) {
        return (
            <div className="glass-dark rounded-xl p-6">
                <p className="text-white/60 text-center">Select a time slot to see pricing</p>
            </div>
        );
    }

    const items = [
        { label: 'Base Price', value: pricing.basePrice, show: true },
        { label: 'Peak Hour Fee', value: pricing.peakHourFee, show: pricing.peakHourFee > 0 },
        { label: 'Weekend Fee', value: pricing.weekendFee, show: pricing.weekendFee > 0 },
        { label: 'Equipment Fee', value: pricing.equipmentFee, show: pricing.equipmentFee > 0 },
        { label: 'Coach Fee', value: pricing.coachFee, show: pricing.coachFee > 0 },
    ];

    return (
        <div className="glass-dark rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Price Breakdown</h3>

            <div className="space-y-3">
                {items.map((item, index) =>
                    item.show && (
                        <div key={index} className="flex justify-between items-center text-white/80">
                            <span>{item.label}</span>
                            <span className="font-semibold">${item.value.toFixed(2)}</span>
                        </div>
                    )
                )}

                {pricing.duration && (
                    <div className="flex justify-between items-center text-white/60 text-sm pt-2 border-t border-white/10">
                        <span>Duration</span>
                        <span>{pricing.duration} hour{pricing.duration !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t-2 border-white/20">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">Total</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                        ${pricing.total.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PriceBreakdown;
