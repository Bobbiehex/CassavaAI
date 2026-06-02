import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Edit } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <header className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={48} />
                    )}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user?.name || 'User Name'}</h1>
                  <p className="text-md text-slate-500 dark:text-slate-400">{user?.role?.toLowerCase().replace('_', ' ') || 'Role'}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition-colors">
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-700">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full">
                   <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email Address</h3>
                  <p className="text-md font-medium text-slate-900 dark:text-white">{user?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-700">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full">
                    <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Phone Number</h3>
                  <p className="text-md font-medium text-slate-900 dark:text-white">{user?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Membership & Billing</h2>
              <div className="p-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-md font-semibold text-slate-900 dark:text-white">Pro Plan</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Next payment of $29 on July 25, 2024</p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    <span>Manage Billing</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Connected Accounts</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-100 dark:bg-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-slate-900 dark:text-white">Google</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Connect your Google account to sign in with one click.</p>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition-colors">
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
