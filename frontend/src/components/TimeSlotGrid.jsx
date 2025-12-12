import React from 'react';
import { format } from 'date-fns';

const TimeSlotGrid = ({ date, slots, onSlotSelect, selectedSlot }) => {
    const getSlotStatus = (slot) => {
        if (!slot.available) return 'unavailable';
        if (selectedSlot && selectedSlot.time === slot.time) return 'selected';
        return 'available';
    };

    const statusStyles = {
        available: 'bg-green-500/20 hover:bg-green-500/30 border-green-500/50 text-green-100 cursor-pointer',
        selected: 'bg-blue-500 border-blue-400 text-white ring-2 ring-blue-300',
        unavailable: 'bg-red-500/20 border-red-500/50 text-red-200 cursor-not-allowed opacity-50',
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
                Available Time Slots - {format(date, 'MMMM dd, yyyy')}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {slots.map((slot, index) => {
                    const status = getSlotStatus(slot);

                    return (
                        <button
                            key={index}
                            onClick={() => status === 'available' || status === 'selected' ? onSlotSelect(slot) : null}
                            disabled={status === 'unavailable'}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${statusStyles[status]}`}
                        >
                            <div className="text-lg font-semibold">{slot.time}</div>
                            <div className="text-xs mt-1 opacity-80">
                                {status === 'unavailable' ? 'Booked' : status === 'selected' ? 'Selected' : 'Available'}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/50" />
                    <span className="text-white/80">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500 border border-blue-400" />
                    <span className="text-white/80">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500/50" />
                    <span className="text-white/80">Booked</span>
                </div>
            </div>
        </div>
    );
};

export default TimeSlotGrid;
