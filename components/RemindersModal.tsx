import React, { useState, useEffect } from 'react';
import { Reminder } from '../types';
import { CloseIcon, PlusIcon } from './Icons';

interface RemindersModalProps {
    isOpen: boolean;
    onClose: () => void;
    reminders: Reminder[];
    onSave: (reminders: Reminder[]) => void;
    currentMileage: number;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

export const RemindersModal: React.FC<RemindersModalProps> = ({ isOpen, onClose, reminders, onSave, currentMileage }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

    const handleSaveReminder = (reminderData: Omit<Reminder, 'id'>) => {
        let updatedReminders;
        if (editingReminder) {
            updatedReminders = reminders.map(r => r.id === editingReminder.id ? { ...editingReminder, ...reminderData } : r);
        } else {
            updatedReminders = [...reminders, { ...reminderData, id: Date.now().toString() }];
        }
        onSave(updatedReminders);
        setEditingReminder(null);
        setIsFormVisible(false);
    };
    
    const handleDeleteReminder = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este lembrete?')) {
            onSave(reminders.filter(r => r.id !== id));
        }
    };
    
    const handleCompleteReminder = (id: string) => {
        const reminderToComplete = reminders.find(r => r.id === id);
        if (!reminderToComplete) return;

        if (!reminderToComplete.isRecurring) {
            handleDeleteReminder(id);
        } else {
            const updatedReminders = reminders.map(r => {
                if (r.id === id) {
                    return {
                        ...r,
                        lastCompletionKm: r.type === 'km' ? currentMileage : r.lastCompletionKm,
                        lastCompletionDate: r.type === 'date' ? getTodayString() : r.lastCompletionDate,
                    };
                }
                return r;
            });
            onSave(updatedReminders);
        }
    };

    const handleEditClick = (reminder: Reminder) => {
        setEditingReminder(reminder);
        setIsFormVisible(true);
    }
    
    const handleAddNewClick = () => {
        setEditingReminder(null);
        setIsFormVisible(true);
    }
    
    const handleBackToList = () => {
        setEditingReminder(null);
        setIsFormVisible(false);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-[var(--theme-card-bg)] text-gray-200 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg m-4 modal-content overflow-y-auto max-h-[95vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {isFormVisible ? (editingReminder ? 'Editar Lembrete' : 'Novo Lembrete') : 'Lembretes'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                </div>
                
                {!isFormVisible ? (
                    <ReminderList 
                        reminders={reminders} 
                        onAddClick={handleAddNewClick} 
                        onDelete={handleDeleteReminder} 
                        onComplete={handleCompleteReminder}
                        onEdit={handleEditClick}
                    />
                ) : (
                    <ReminderForm 
                        onSave={handleSaveReminder} 
                        onCancel={handleBackToList}
                        initialData={editingReminder}
                        currentMileage={currentMileage}
                    />
                )}
            </div>
        </div>
    );
};

// --- ReminderList Sub-component ---
const ReminderList: React.FC<any> = ({ reminders, onAddClick, onDelete, onComplete, onEdit }) => (
    <div className="space-y-4">
        {reminders.length === 0 ? (
             <div className="text-center text-gray-400 py-8">
                 <p>Nenhum lembrete personalizado.</p>
                 <p>Clique abaixo para adicionar um.</p>
             </div>
        ) : (
            reminders.map(r => (
                <div key={r.id} className="bg-black/20 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold text-white">{r.name}</p>
                        <p className="text-sm text-gray-400">
                           {r.type === 'km' ? `A cada ${r.recurringKmInterval} km` : `A cada ${r.recurringDaysInterval} dias`}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                         <button onClick={() => onComplete(r.id)} className="text-xs bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-md">Concluir</button>
                         <button onClick={() => onEdit(r)} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md">Editar</button>
                        <button onClick={() => onDelete(r.id)} className="text-xs bg-red-800 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md">Excluir</button>
                    </div>
                </div>
            ))
        )}
        <button onClick={onAddClick} className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-br from-[var(--theme-gradient-start)] to-[var(--theme-gradient-end)] text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:opacity-90 transition-all">
           <PlusIcon/> Adicionar Novo Lembrete
        </button>
    </div>
);

// --- ReminderForm Sub-component ---
const ReminderForm: React.FC<any> = ({ onSave, onCancel, initialData, currentMileage }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'km' | 'date'>('km');
    const [isRecurring, setIsRecurring] = useState(true); // Default to recurring
    const [recurringKmInterval, setRecurringKmInterval] = useState('');
    const [recurringDaysInterval, setRecurringDaysInterval] = useState('');
    const [lastCompletionKm, setLastCompletionKm] = useState('');
    const [lastCompletionDate, setLastCompletionDate] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setType(initialData.type);
            setIsRecurring(initialData.isRecurring);
            setRecurringKmInterval(initialData.recurringKmInterval || '');
            setRecurringDaysInterval(initialData.recurringDaysInterval || '');
            setLastCompletionKm(initialData.lastCompletionKm || '');
            setLastCompletionDate(initialData.lastCompletionDate || '');
        } else {
            setLastCompletionKm(String(currentMileage));
            setLastCompletionDate(getTodayString());
        }
    }, [initialData, currentMileage]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            type,
            isRecurring,
            recurringKmInterval: type === 'km' ? parseInt(recurringKmInterval) : undefined,
            recurringDaysInterval: type === 'date' ? parseInt(recurringDaysInterval) : undefined,
            lastCompletionKm: type === 'km' ? parseInt(lastCompletionKm) : undefined,
            lastCompletionDate: type === 'date' ? lastCompletionDate : undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300">Nome do Lembrete</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Trocar filtro de ar" required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md"/>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-300">Tipo</label>
                <select value={type} onChange={e => setType(e.target.value as any)} className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md">
                    <option value="km">Quilometragem</option>
                    <option value="date">Data</option>
                </select>
            </div>
            
            {type === 'km' ? (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Repetir a cada (km)</label>
                        <input type="number" value={recurringKmInterval} onChange={e => setRecurringKmInterval(e.target.value)} placeholder="5000" required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Última conclusão (km)</label>
                        <input type="number" value={lastCompletionKm} onChange={e => setLastCompletionKm(e.target.value)} placeholder={`${currentMileage}`} required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md"/>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Repetir a cada (dias)</label>
                        <input type="number" value={recurringDaysInterval} onChange={e => setRecurringDaysInterval(e.target.value)} placeholder="180" required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Última conclusão (data)</label>
                        <input type="date" value={lastCompletionDate} onChange={e => setLastCompletionDate(e.target.value)} required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md"/>
                    </div>
                </>
            )}

            <div className="flex justify-end pt-4 gap-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg">Cancelar</button>
                <button type="submit" className="bg-gradient-to-br from-[var(--theme-gradient-start)] to-[var(--theme-gradient-end)] text-white font-semibold py-2 px-4 rounded-lg">Salvar</button>
            </div>
        </form>
    );
};
