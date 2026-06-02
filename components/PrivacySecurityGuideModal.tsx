import React from 'react';
import { X, Shield, Lock, Eye, Server, Database, CheckCircle, AlertTriangle } from 'lucide-react';

interface PrivacySecurityGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
}

export const PrivacySecurityGuideModal: React.FC<PrivacySecurityGuideModalProps> = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-[85vh] max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Privacy & Security Guide</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">How we protect your data and privacy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-12 bg-white dark:bg-slate-900">
          
          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Lock size={24} className="text-purple-500" />
              Data Encryption
            </h3>
            <p className="text-slate-600 dark:text-slate-200 text-base leading-relaxed mb-4">
              All data transmitted between your device and our servers is encrypted using industry-standard <span className="font-bold text-slate-900 dark:text-white">TLS 1.3</span>. 
              Additionally, sensitive information like your password and personal details are encrypted at rest in our database using <span className="font-bold text-slate-900 dark:text-white">AES-256</span> encryption. 
              This ensures that even if our servers were compromised, your data remains unreadable.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Eye size={24} className="text-blue-500" />
              Who Can See Your Data?
            </h3>
            <p className="text-slate-600 dark:text-slate-200 text-base leading-relaxed mb-4">
              We follow the principle of <span className="font-bold italic text-slate-900 dark:text-white">least privilege</span>. Only you and the team members you explicitly invite can view your farm data. 
              Our system administrators only access your data when necessary for technical support and only with your explicit permission. 
              We never sell your data to third parties.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Server size={24} className="text-emerald-500" />
              Secure Infrastructure
            </h3>
            <p className="text-slate-600 dark:text-slate-200 text-base leading-relaxed mb-4">
              Agrivision is hosted on world-class cloud infrastructure with 24/7 monitoring and physical security. 
              We perform regular security audits and penetration testing to identify and patch vulnerabilities. 
              Our servers are located in secure data centers with redundant power and network connections.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Database size={24} className="text-amber-500" />
              Data Backups
            </h3>
            <p className="text-slate-600 dark:text-slate-200 text-base leading-relaxed mb-4">
              We perform daily automated backups of all your farm records and settings. 
              These backups are stored in multiple geographically separate locations to ensure data recovery in case of a regional disaster. 
              You can rest assured that your historical farm data is safe and recoverable.
            </p>
          </section>

          <section className="p-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
            <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-5 flex items-center gap-2">
              <CheckCircle size={24} />
              Your Privacy Rights
            </h3>
            <ul className="list-disc list-inside text-base text-emerald-600 dark:text-emerald-200 space-y-3 ml-2">
              <li>Right to access your data at any time.</li>
              <li>Right to correct any inaccuracies in your profile.</li>
              <li>Right to export your farm data in CSV or PDF format.</li>
              <li>Right to permanently delete your account and all associated data.</li>
            </ul>
          </section>

          <section className="p-8 bg-amber-50 dark:bg-amber-900/30 rounded-3xl border border-amber-100 dark:border-amber-800/50">
            <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-5 flex items-center gap-2">
              <AlertTriangle size={24} />
              Security Best Practices
            </h3>
            <p className="text-amber-600 dark:text-amber-200 text-base leading-relaxed">
              While we do our part, you can help keep your account secure by using a strong, unique password and enabling <span className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</span> in your Settings. 
              Never share your login credentials with anyone.
            </p>
          </section>

          {onAction && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              <button 
                onClick={() => {
                  onClose();
                  onAction();
                }}
                className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-200 dark:shadow-none hover:scale-105 active:scale-95"
              >
                <Shield size={20} />
                Manage Privacy Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
