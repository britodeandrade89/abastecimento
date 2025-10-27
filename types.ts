import { Timestamp } from 'firebase/firestore';

export enum FuelType {
    ETHANOL = 'ETANOL',
    GASOLINE = 'GASOLINA',
}

export interface RawFuelEntry {
    id: string;
    date: Timestamp;
    totalValue: number;
    pricePerLiter: number;
    kmEnd: number;
    fuelType: FuelType;
    notes: string;
}

export interface ProcessedFuelEntry extends RawFuelEntry {
    date: Date;
    liters: number;
    kmStart: number;
    distance: number;
    avgKmpl: number;
}

export interface MaintenanceData {
    oil: number;
    tires: number;
    engine: number;
}

export interface Reminder {
    id: string;
    name: string;
    type: 'km' | 'date';
    // One-time reminder values
    kmValue?: number;
    dateValue?: string; // 'YYYY-MM-DD'
    // Recurrence config
    isRecurring: boolean;
    recurringKmInterval?: number;
    recurringDaysInterval?: number;
    // Anchor point for recurrence
    lastCompletionKm?: number;
    lastCompletionDate?: string; // 'YYYY-MM-DD'
}
