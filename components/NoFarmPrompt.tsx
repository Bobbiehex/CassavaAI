import React from 'react';
import { Sprout } from 'lucide-react';

export const NoFarmPrompt: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full mb-6">
        <Sprout size={48} className="text-emerald-600 dark:text-emerald-400" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
        Welcome to AgriVision AI
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-8">
        To get started, you need to create your first farm profile. This will help us organize your crops, livestock, and AI insights.
      </p>
      <button 
        onClick={() => window.dispatchEvent(new CustomEvent('open-farm-modal'))}
        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
      >
        Create Your First Farm
      </button>
    </div>
  );
};
