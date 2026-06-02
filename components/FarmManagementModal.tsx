import React, { useState } from 'react';
import { Settings, Bell, Map, Droplets, Leaf, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface FarmManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmManagementModal: React.FC<FarmManagementModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'NOTIFICATIONS' | 'ALERTS' | 'PREFERENCES'>('NOTIFICATIONS');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { measurementUnit, setMeasurementUnit } = useSettings();

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Farm preferences updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Farm Management</h2>
              <p className="text-sm text-slate-500">Configure notifications, alerts, and farm preferences</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <AlertTriangle size={24} className="hidden" /> {/* Just to import it */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-full sm:w-64 border-r border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900 overflow-y-auto shrink-0">
            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'NOTIFICATIONS' 
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bell size={18} />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('ALERTS')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mt-2 ${
                activeTab === 'ALERTS' 
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <AlertTriangle size={18} />
              Weather Alerts
            </button>
            <button
              onClick={() => setActiveTab('PREFERENCES')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mt-2 ${
                activeTab === 'PREFERENCES' 
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Map size={18} />
              Map Preferences
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                <CheckCircle size={20} />
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSave}>
              {activeTab === 'NOTIFICATIONS' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                          <Droplets size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white text-sm">Irrigation Reminders</p>
                          <p className="text-xs text-slate-500">Get notified when it's time to water crops</p>
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500" />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                          <Leaf size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white text-sm">Crop Health Updates</p>
                          <p className="text-xs text-slate-500">Weekly summaries of your crop health</p>
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500" />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'ALERTS' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Weather & Critical Alerts</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white text-sm">Severe Weather Warnings</p>
                        <p className="text-xs text-slate-500">Frost, extreme heat, or heavy rain alerts</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500" />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white text-sm">Pest Outbreak Alerts</p>
                        <p className="text-xs text-slate-500">Notifications about pests in your region</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500" />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'PREFERENCES' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Map & Display Preferences</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Map View</label>
                    <select className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                      <option value="satellite">Satellite</option>
                      <option value="terrain">Terrain</option>
                      <option value="standard">Standard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Measurement Units</label>
                    <select 
                      value={measurementUnit}
                      onChange={(e) => setMeasurementUnit(e.target.value as 'metric' | 'imperial')}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="metric">Metric (Hectares, Celsius)</option>
                      <option value="imperial">Imperial (Acres, Fahrenheit)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-6 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
