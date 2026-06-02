import React from 'react';
import { X, User, Settings, Shield, Trash2, Key, Edit } from 'lucide-react';

interface AccountProfileGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
}

export const AccountProfileGuideModal: React.FC<AccountProfileGuideModalProps> = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-[85vh] max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account & Profile Guide</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Learn how to manage your identity and security</p>
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
        <div className="p-8 overflow-y-auto space-y-10 bg-white dark:bg-slate-900">
          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Edit size={22} className="text-blue-500" />
              Changing Your Name & Avatar
            </h3>
            <p className="text-slate-600 dark:text-slate-200 text-base leading-relaxed mb-4">
              To update your display name or profile picture, navigate to the <span className="font-bold text-slate-900 dark:text-white">Settings</span> page. 
              Under the "Account & Farm Management" section, click on <span className="font-bold text-slate-900 dark:text-white">Account & Profile</span>. 
              A window will appear where you can click on your current avatar to upload a new image or edit your display name in the text field. 
              Don't forget to click "Save Changes" to apply your updates.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Key size={22} className="text-amber-500" />
              Managing Your Password
            </h3>
            <p className="text-slate-600 dark:text-slate-200 text-base leading-relaxed mb-4">
              Security is paramount. To change your password:
            </p>
            <ol className="list-decimal list-inside text-base text-slate-600 dark:text-slate-200 space-y-3 ml-2">
              <li>Go to the <span className="font-bold text-slate-900 dark:text-white">Settings</span> page.</li>
              <li>Click on <span className="font-bold text-slate-900 dark:text-white">Privacy & Security</span>.</li>
              <li>Select the <span className="font-bold text-slate-900 dark:text-white">Change Password</span> tab on the left sidebar.</li>
              <li>Enter your current password, followed by your new password twice for confirmation.</li>
              <li>Click "Save Changes".</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings size={22} className="text-slate-500" />
              Adjusting Profile Settings
            </h3>
            <p className="text-slate-600 dark:text-slate-200 text-base leading-relaxed mb-4">
              You can adjust your contact details, such as your email and phone number, in the <span className="font-bold text-slate-900 dark:text-white">Privacy & Security</span> section within Settings. 
              Keeping your contact information up to date ensures you receive critical alerts and can recover your account if needed.
            </p>
          </section>

          <section className="p-6 bg-rose-50 dark:bg-rose-900/30 rounded-2xl border border-rose-100 dark:border-rose-800/50">
            <h3 className="text-xl font-bold text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
              <Trash2 size={22} />
              Deleting Your Account
            </h3>
            <p className="text-rose-600 dark:text-rose-200 text-base leading-relaxed mb-4">
              If you wish to permanently remove your account and all associated data:
            </p>
            <ol className="list-decimal list-inside text-base text-rose-600 dark:text-rose-200 space-y-3 ml-2">
              <li>Navigate to the bottom of the <span className="font-bold text-rose-900 dark:text-white">Settings</span> page.</li>
              <li>Locate the <span className="font-bold text-rose-900 dark:text-white">Danger Zone</span> section.</li>
              <li>Click the <span className="font-bold text-rose-900 dark:text-white">Delete Account</span> button.</li>
              <li>You will be asked to type a confirmation phrase to prevent accidental deletion.</li>
              <li>Once confirmed, all your data, including farms and records, will be permanently erased.</li>
            </ol>
          </section>

          {onAction && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              <button 
                onClick={() => {
                  onClose();
                  onAction();
                }}
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 dark:shadow-none hover:scale-105 active:scale-95"
              >
                <Settings size={20} />
                Open Account Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
