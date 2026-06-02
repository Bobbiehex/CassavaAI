import React, { useState } from 'react';
import { Shield, Smartphone, Mail, Key, CheckCircle, AlertTriangle, Lock, Bell, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiBaseUrl } from '../config';

interface PrivacySecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginSession {
  id: string;
  os: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export const PrivacySecurityModal: React.FC<PrivacySecurityModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'CONTACT' | 'NOTIFICATIONS' | 'PASSWORD' | '2FA' | 'ACTIVITY'>('CONTACT');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
  const [showSignOutOptions, setShowSignOutOptions] = useState(false);

  React.useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const token = localStorage.getItem('agrivision_token');
        const API_BASE_URL = getApiBaseUrl();
        
        const res = await fetch(`${API_BASE_URL}/auth/sessions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          // Format lastActive date
          const formattedData = data.map((session: any) => ({
            ...session,
            lastActive: new Date(session.lastActive).toLocaleString()
          }));
          setLoginSessions(formattedData);
        } else {
          throw new Error('Failed to fetch sessions');
        }
      } catch (error) {
        console.error("Failed to fetch session data", error);
      }
    };

    if (isOpen && activeTab === 'ACTIVITY') {
      fetchSessionData();
    }
  }, [isOpen, activeTab]);

  const handleSignOutSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('agrivision_token');
      const API_BASE_URL = getApiBaseUrl();
      
      const res = await fetch(`${API_BASE_URL}/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        setLoginSessions(prev => prev.filter(s => s.id !== sessionId));
        setSuccessMessage('Session signed out successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error("Failed to sign out session", error);
    }
  };

  const handleSignOutAllOther = async () => {
    try {
      const token = localStorage.getItem('agrivision_token');
      const API_BASE_URL = getApiBaseUrl();
      
      const res = await fetch(`${API_BASE_URL}/auth/sessions`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        setLoginSessions(prev => prev.filter(s => s.isCurrent));
        setShowSignOutOptions(false);
        setSuccessMessage('All other sessions signed out successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error("Failed to sign out other sessions", error);
    }
  };

  const handleSignOutAll = async () => {
    try {
      const token = localStorage.getItem('agrivision_token');
      const API_BASE_URL = getApiBaseUrl();
      
      const res = await fetch(`${API_BASE_URL}/auth/sessions/all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        logout();
      }
    } catch (error) {
      console.error("Failed to sign out all sessions", error);
    }
  };

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Settings updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Privacy & Security</h2>
              <p className="text-sm text-slate-500">Manage your contact details and security preferences</p>
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
              onClick={() => setActiveTab('CONTACT')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'CONTACT' 
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Mail size={18} />
              Contact Details
            </button>
            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mt-2 ${
                activeTab === 'NOTIFICATIONS' 
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bell size={18} />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('PASSWORD')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mt-2 ${
                activeTab === 'PASSWORD' 
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Key size={18} />
              Change Password
            </button>
            <button
              onClick={() => setActiveTab('2FA')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mt-2 ${
                activeTab === '2FA' 
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Lock size={18} />
              Two-Factor Auth
            </button>
            <button
              onClick={() => setActiveTab('ACTIVITY')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mt-2 ${
                activeTab === 'ACTIVITY' 
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Clock size={18} />
              Login Activity
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
              {activeTab === 'CONTACT' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Contact Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        defaultValue={user?.email}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">We'll send notifications and security alerts to this address.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Used for account recovery and SMS alerts.</p>
                  </div>
                </div>
              )}

              {activeTab === 'NOTIFICATIONS' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">Email Notifications</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Receive emails about your account and new features.</p>
                      </div>
                      <button type="button" className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-purple-500">
                        <span className="inline-block w-4 h-4 transform bg-white rounded-full transition-transform translate-x-6" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">System Alerts</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Receive notifications about system updates and security alerts.</p>
                      </div>
                      <button type="button" className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-purple-500">
                        <span className="inline-block w-4 h-4 transform bg-white rounded-full transition-transform translate-x-6" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'PASSWORD' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Change Password</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === '2FA' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Two-Factor Authentication</h3>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock size={32} />
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-2">Protect your account</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                      Add an extra layer of security to your account. Once enabled, you'll be prompted to enter a code from your authenticator app or SMS when signing in.
                    </p>
                    <button type="button" className="px-6 py-2.5 bg-slate-800 dark:bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'ACTIVITY' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Login Activity</h3>
                  
                  <div className="space-y-4">
                    {loginSessions.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        Loading session data...
                      </div>
                    ) : (
                      loginSessions.map((session, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm font-medium text-slate-900 dark:text-white">{session.os} • {session.browser}</h4>
                              {session.isCurrent && (
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">Current Session</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{session.location} • IP: {session.ip}</p>
                            <p className="text-xs text-slate-400 mt-1">{session.isCurrent ? 'Active now' : `Last active: ${session.lastActive}`}</p>
                          </div>
                          {!session.isCurrent && (
                            <button 
                              type="button"
                              onClick={() => handleSignOutSession(session.id)}
                              className="text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
                            >
                              Sign out
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {loginSessions.length > 1 && (
                    <div className="mt-6 relative">
                      {showSignOutOptions ? (
                        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 space-y-3 animate-fade-in">
                          <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-2">Choose sign out option:</p>
                          <button 
                            type="button" 
                            onClick={handleSignOutAllOther}
                            className="w-full py-2 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-200 dark:border-red-900/30"
                          >
                            Sign out all other sessions (keep current)
                          </button>
                          <button 
                            type="button" 
                            onClick={handleSignOutAll}
                            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                          >
                            Sign out ALL sessions
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setShowSignOutOptions(false)}
                            className="w-full py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="button" 
                          onClick={() => setShowSignOutOptions(true)}
                          className="w-full py-2.5 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors border border-red-200 dark:border-red-900/30"
                        >
                          Sign out of other sessions
                        </button>
                      )}
                    </div>
                  )}
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
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
