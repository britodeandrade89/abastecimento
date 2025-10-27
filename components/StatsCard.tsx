
import React from 'react';

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value }) => (
    <div className="stats-card bg-[var(--theme-card-bg)] p-4 rounded-xl flex items-center gap-4">
        <div className="bg-black/30 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);
