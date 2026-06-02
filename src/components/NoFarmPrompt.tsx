import React from 'react';
import { MapPin, Plus } from 'lucide-react';

export const NoFarmPrompt: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
        <MapPin size={48} className="text-emerald-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Welcome to Agrivision!</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mb-8">
        To get started, you need to create your first farm profile. This will be your command center for all agricultural operations.
      </p>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-md w-full">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
          Click below to add your first farm.
        </p>
        <button 
          onClick={() => window.dispatchEvent(new Event('open-farm-modal'))}
          className="flex items-center justify-center gap-2 text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl font-bold w-full transition-colors shadow-sm shadow-emerald-500/20"
        >
          <Plus size={20} />
          <span>Add New Farm</span>
        </button>
      </div>
    </div>
  );
};
