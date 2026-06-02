
import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { Farm } from '../types';
import { MapPin, ChevronDown, Globe, Trash2, Edit } from 'lucide-react';
import { FarmModal } from './FarmModal';

interface FarmSelectorProps {
  selectedFarmId: string | null;
  onSelectFarm: (id: string | null) => void;
}

export const FarmSelector: React.FC<FarmSelectorProps> = ({ selectedFarmId, onSelectFarm }) => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadFarms = async () => {
      try {
        const allFarms = await ApiService.getFarms();
        setFarms(allFarms);
        if (!selectedFarmId && allFarms.length > 0) {
          onSelectFarm(allFarms[0].id);
        }
      } catch (error) {
        console.error('Failed to load farms:', error);
      }
    };
    loadFarms();
  }, [selectedFarmId, onSelectFarm]);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-farm-modal', handleOpenModal);
    return () => window.removeEventListener('open-farm-modal', handleOpenModal);
  }, []);

  const selectedFarm = farms.find(f => f.id === selectedFarmId);

  const handleAddFarm = async (data: { name: string; location: string; image?: string; imageFile?: File }) => {
    try {
      let finalImage = data.image;

      if (data.imageFile) {
        finalImage = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
          reader.readAsDataURL(data.imageFile!);
        });
      }

      const newFarm = await ApiService.createFarm({
        name: data.name,
        location: data.location,
        totalArea: 0,
        image: finalImage
      });
      
      const allFarms = await ApiService.getFarms();
      setFarms(allFarms);
      onSelectFarm(newFarm.id);
      setIsModalOpen(false);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Failed to create farm:', error);
      alert('Failed to create farm: ' + (error.message || 'Unknown error') + '. Please try again.');
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        {selectedFarm?.image ? (
          <img src={selectedFarm.image} alt={selectedFarm.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
        ) : (
          <Globe size={18} className="text-emerald-500 shrink-0" />
        )}
        <div className="text-left">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Current Farm</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
            {selectedFarm ? selectedFarm.name : 'Select Farm'}
          </p>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2 py-1">YOUR FARMS</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {farms.map(farm => (
              <div key={farm.id} className="relative group">
                <button
                  onClick={() => {
                    onSelectFarm(farm.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left ${selectedFarmId === farm.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden mr-3 flex-shrink-0">
                    {farm.image ? (
                      <img src={farm.image} alt={farm.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <MapPin size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{farm.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{farm.location}</p>
                  </div>
                  {selectedFarmId === farm.id && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 ml-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  )}
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${farm.name}"?`)) {
                      try {
                        await ApiService.deleteFarm(farm.id);
                        const allFarms = await ApiService.getFarms();
                        setFarms(allFarms);
                        if (selectedFarmId === farm.id && allFarms.length > 0) {
                          onSelectFarm(allFarms[0].id);
                        } else if (allFarms.length === 0) {
                          onSelectFarm(null);
                        }
                      } catch (error) {
                        console.error('Failed to delete farm:', error);
                        alert('Failed to delete farm. Please try again.');
                      }
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                  title="Delete farm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full p-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 border-t border-slate-100 dark:border-slate-700 transition-colors"
          >
            + Add New Farm
          </button>
        </div>
      )}

      <FarmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddFarm} 
      />
    </div>
  );
};
