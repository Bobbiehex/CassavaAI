
import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Save, CheckCircle, Shield, Sprout, PawPrint, Smartphone, Database, Server, Wifi, WifiOff, Moon, Sun, Monitor, User, Settings as SettingsIcon } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { getApiBaseUrl } from '../config';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { PrivacySecurityModal } from './PrivacySecurityModal';
import { FarmManagementModal } from './FarmManagementModal';

export const SettingsPage: React.FC = () => {
  const { addNotification } = useNotifications();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'delete my account') return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
         logout();
         navigate('/login');
      } else {
         addNotification({title: "Error", message: "Failed to delete account", type: "CRITICAL"});
         setIsDeleting(false);
      }
    } catch (e) {
      console.error(e);
      addNotification({title: "Error", message: "Failed to delete account", type: "CRITICAL"});
      setIsDeleting(false);
    }
  };

  const [channels, setChannels] = useState({
    email: true,
    sms: false,
    push: true
  });

  const [cropAlerts, setCropAlerts] = useState({
    irrigation: true,
    disease: true,
    nutrients: false,
    equipment: true
  });

  const [livestockAlerts, setLivestockAlerts] = useState({
    health: true,
    estrus: true,
    perimeter: true,
    predator: false
  });

  useEffect(() => {
    // Load saved settings on mount
    const loadSettings = (key: string, setter: any) => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                setter(JSON.parse(saved));
            } catch (e) { console.error(`Error loading ${key}`, e); }
        }
    };

    loadSettings('settings_channels', setChannels);
    loadSettings('settings_cropAlerts', setCropAlerts);
    loadSettings('settings_livestockAlerts', setLivestockAlerts);

  }, []);

  // Generic handler for toggling settings with persistence and specific notifications
  const handleToggle = (
    category: 'channels' | 'cropAlerts' | 'livestockAlerts',
    key: string,
    label: string,
    newValue: boolean
  ) => {
      // 1. Update State
      if (category === 'channels') {
          const updated = { ...channels, [key]: newValue };
          setChannels(updated);
          localStorage.setItem('settings_channels', JSON.stringify(updated));
      } else if (category === 'cropAlerts') {
          const updated = { ...cropAlerts, [key]: newValue };
          setCropAlerts(updated);
          localStorage.setItem('settings_cropAlerts', JSON.stringify(updated));
      } else if (category === 'livestockAlerts') {
          const updated = { ...livestockAlerts, [key]: newValue };
          setLivestockAlerts(updated);
          localStorage.setItem('settings_livestockAlerts', JSON.stringify(updated));
      }

      // 2. Trigger Specific Notification
      addNotification({
          title: 'Setting Updated',
          message: `${label} has been turned ${newValue ? 'ON' : 'OFF'}.`,
          type: 'INFO'
      });
  };

  const Toggle = ({ label, checked, onChange, icon: Icon, description }: any) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-start gap-3">
        {Icon && <div className="mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"><Icon size={18} /></div>}
        <div>
            <span className="font-medium text-slate-700 dark:text-slate-200 block">{label}</span>
            {description && <span className="text-xs text-slate-400">{description}</span>}
        </div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your farm preferences and database connections</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Theme & Display */}
        <div className="lg:col-span-3">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                     <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-700 dark:text-indigo-400">
                         <Monitor size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 dark:text-white">{t('settings_theme')}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <button 
                        onClick={() => {
                            setTheme('light');
                            addNotification({ title: 'Theme Changed', message: 'Switched to Light Mode', type: 'INFO' });
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400'}`}
                    >
                        <Sun size={24} className="mb-2" />
                        <span className="font-medium text-sm">{t('theme_light')}</span>
                    </button>
                    <button 
                        onClick={() => {
                            setTheme('dark-blue');
                            addNotification({ title: 'Theme Changed', message: 'Switched to Dark Blue Mode', type: 'INFO' });
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark-blue' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400'}`}
                    >
                        <Moon size={24} className="mb-2 text-blue-500" />
                        <span className="font-medium text-sm">{t('theme_dark_blue')}</span>
                    </button>
                    <button 
                        onClick={() => {
                            setTheme('dark-black');
                            addNotification({ title: 'Theme Changed', message: 'Switched to Dark Mode', type: 'INFO' });
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark-black' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400'}`}
                    >
                        <Moon size={24} className="mb-2 text-slate-900 dark:text-slate-300" />
                        <span className="font-medium text-sm">{t('theme_dark_black')}</span>
                    </button>
                    <button 
                        onClick={() => {
                            setTheme('dark-green');
                            addNotification({ title: 'Theme Changed', message: 'Switched to Dark Green Mode', type: 'INFO' });
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark-green' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400'}`}
                    >
                        <Moon size={24} className="mb-2 text-emerald-500" />
                        <span className="font-medium text-sm">{t('theme_dark_green')}</span>
                    </button>
                     <button 
                        onClick={() => {
                            setTheme('system');
                            addNotification({ title: 'Theme Changed', message: 'Switched to System Default', type: 'INFO' });
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400'}`}
                    >
                        <Monitor size={24} className="mb-2" />
                        <span className="font-medium text-sm">{t('theme_system')}</span>
                    </button>
                </div>
             </div>
        </div>

        {/* Account & Farm Management Quick Links */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div 
              onClick={() => setIsProfileModalOpen(true)}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Account & Profile</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your account settings, password, and profile details.</p>
            </div>
            
            <div 
              onClick={() => setIsFarmModalOpen(true)}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <SettingsIcon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Farm Management</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Help with adding farms, managing crops, and drone integrations.</p>
            </div>
            
            <div 
              onClick={() => setIsPrivacyModalOpen(true)}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Privacy & Security</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Learn how we protect your data and manage your privacy settings.</p>
            </div>
          </div>
        </div>

        {/* Notification Channels Column */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                    <Bell size={18} className="text-indigo-600 dark:text-indigo-400" /> Notification Channels
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Where should we send your alerts?</p>
                
                <div className="divide-y divide-slate-50 dark:divide-slate-700">
                    <Toggle 
                    label="Email Alerts" 
                    description="Daily digests & critical alerts"
                    checked={channels.email} 
                    onChange={(v: boolean) => handleToggle('channels', 'email', 'Email Alerts', v)} 
                    icon={Mail}
                    />
                    <Toggle 
                    label="SMS Notifications" 
                    description="Instant critical warnings"
                    checked={channels.sms} 
                    onChange={(v: boolean) => handleToggle('channels', 'sms', 'SMS Notifications', v)} 
                    icon={MessageSquare}
                    />
                    <Toggle 
                    label="Mobile Push" 
                    description="Real-time app notifications"
                    checked={channels.push} 
                    onChange={(v: boolean) => handleToggle('channels', 'push', 'Mobile Push', v)} 
                    icon={Smartphone}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={18} className="text-slate-600 dark:text-slate-400" /> Security
                </h3>
                <div className="flex items-center justify-between py-2">
                    <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">Two-Factor Auth</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Extra layer of security</p>
                    </div>
                    <button className="text-emerald-600 dark:text-emerald-400 font-medium text-xs hover:underline bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">Enable</button>
                </div>
            </div>
        </div>

        {/* Specific Alert Config Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Crop Alerts */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-700 dark:text-emerald-400">
                    <Sprout size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Crop Alert Configuration</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Customize sensitivity for field monitoring</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
               <Toggle 
                label="Water Stress & Irrigation" 
                checked={cropAlerts.irrigation} 
                onChange={(v: boolean) => handleToggle('cropAlerts', 'irrigation', 'Irrigation Alerts', v)} 
              />
              <Toggle 
                label="Disease & Pest Detection" 
                checked={cropAlerts.disease} 
                onChange={(v: boolean) => handleToggle('cropAlerts', 'disease', 'Disease Detection', v)} 
              />
               <Toggle 
                label="Nutrient Deficiencies" 
                checked={cropAlerts.nutrients} 
                onChange={(v: boolean) => handleToggle('cropAlerts', 'nutrients', 'Nutrient Alerts', v)} 
              />
              <Toggle 
                label="Drone/Sensor Equipment Status" 
                checked={cropAlerts.equipment} 
                onChange={(v: boolean) => handleToggle('cropAlerts', 'equipment', 'Equipment Status', v)} 
              />
            </div>
          </div>

          {/* Livestock Alerts */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-700 dark:text-amber-400">
                    <PawPrint size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Livestock Alert Configuration</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Customize alerts for animal health and safety</p>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
               <Toggle 
                label="Health Anomalies (Temp/HR)" 
                checked={livestockAlerts.health} 
                onChange={(v: boolean) => handleToggle('livestockAlerts', 'health', 'Health Anomaly Alerts', v)} 
              />
              <Toggle 
                label="Estrus / Breeding Cycle" 
                checked={livestockAlerts.estrus} 
                onChange={(v: boolean) => handleToggle('livestockAlerts', 'estrus', 'Breeding Alerts', v)} 
              />
               <Toggle 
                label="Geofence / Perimeter Breach" 
                checked={livestockAlerts.perimeter} 
                onChange={(v: boolean) => handleToggle('livestockAlerts', 'perimeter', 'Geofence Alerts', v)} 
              />
              <Toggle 
                label="Predator Detection (Wolf/Coyote)" 
                checked={livestockAlerts.predator} 
                onChange={(v: boolean) => handleToggle('livestockAlerts', 'predator', 'Predator Alerts', v)} 
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-rose-200 dark:border-rose-900/50 shadow-sm">
             <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400">
                    <Shield size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Danger Zone</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Irreversible actions for your account</p>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Delete Account</p>
                <p className="text-sm text-slate-500">Permanently delete your account and all of your content.</p>
              </div>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-medium rounded-xl border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors shrink-0"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-md w-full border border-rose-200 dark:border-rose-900">
             <div className="flex items-center gap-3 mb-4 text-rose-600 dark:text-rose-400">
               <Shield size={24} />
               <h3 className="text-xl font-bold">Delete Account</h3>
             </div>
             <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
               This action is irreversible. All of your data, farms, and records will be permanently deleted.
             </p>
             <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">
               To confirm, type <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-rose-600 selection:bg-rose-200">delete my account</span> below:
             </p>
             <input
               type="text"
               value={deleteConfirmation}
               onChange={e => setDeleteConfirmation(e.target.value)}
               className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-700 mb-6"
             />
             <div className="flex gap-3 justify-end">
               <button 
                 onClick={() => setIsDeleteModalOpen(false)}
                 className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleDeleteAccount}
                 disabled={deleteConfirmation !== 'delete my account' || isDeleting}
                 className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
               >
                 {isDeleting ? 'Deleting...' : 'Delete Account'}
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Management Modals */}
      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
      
      <PrivacySecurityModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
      
      <FarmManagementModal 
        isOpen={isFarmModalOpen} 
        onClose={() => setIsFarmModalOpen(false)} 
      />
    </div>
  );
};
