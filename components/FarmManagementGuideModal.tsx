import React from 'react';
import { X, Settings, Plus, Camera, Image, Layout, HelpCircle, ChevronRight } from 'lucide-react';

interface FarmManagementGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
}

export const FarmManagementGuideModal: React.FC<FarmManagementGuideModalProps> = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-[85vh] max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Farm Management Guide</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Master the Agrivision platform features</p>
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
              <Plus size={24} className="text-emerald-500" />
              How to Add a New Farm
            </h3>
            <div className="space-y-4 text-base text-slate-600 dark:text-slate-200 leading-relaxed">
              <p>Adding a new farm is the first step to monitoring your crops. To add a farm:</p>
              <ol className="list-decimal list-inside space-y-3 ml-2">
                <li>Navigate to the <span className="font-bold text-slate-900 dark:text-white">Dashboard</span>.</li>
                <li>Click the <span className="font-bold text-slate-900 dark:text-white">+ Add Farm</span> button located in the top-right corner.</li>
                <li>Enter the farm name, location, and total area in hectares or acres.</li>
                <li>Once added, you can select the farm from the dropdown menu to view its specific data.</li>
              </ol>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Camera size={24} className="text-blue-500" />
              Deploying Drones & Cameras
            </h3>
            <div className="space-y-4 text-base text-slate-600 dark:text-slate-200 leading-relaxed">
              <p>Agrivision integrates seamlessly with your hardware. To deploy a drone or camera:</p>
              <ol className="list-decimal list-inside space-y-3 ml-2">
                <li>Go to the <span className="font-bold text-slate-900 dark:text-white">Drones & Sensors</span> page.</li>
                <li>Click <span className="font-bold text-slate-900 dark:text-white">Register New Device</span>.</li>
                <li>Select your device type (Drone or Static Camera) and enter its unique ID.</li>
                <li>Once registered, you can view its status, battery level, and current mission on the map.</li>
                <li>To start a mission, click <span className="font-bold text-slate-900 dark:text-white">Deploy Mission</span> and select the target field.</li>
              </ol>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Image size={24} className="text-purple-500" />
              Analyzing Images with AI
            </h3>
            <div className="space-y-4 text-base text-slate-600 dark:text-slate-200 leading-relaxed">
              <p>Our AI analysis helps you detect issues before they become problems. To analyze an image:</p>
              <ol className="list-decimal list-inside space-y-3 ml-2">
                <li>Navigate to the <span className="font-bold text-slate-900 dark:text-white">AI Analysis</span> tab.</li>
                <li>Upload an image captured by your drone or camera.</li>
                <li>Select the analysis type (e.g., Pest Detection, Water Stress, or Nutrient Deficiency).</li>
                <li>Click <span className="font-bold text-slate-900 dark:text-white">Run Analysis</span>.</li>
                <li>The AI will process the image and highlight any detected anomalies with a confidence score.</li>
              </ol>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Layout size={24} className="text-amber-500" />
              App Features Walkthrough
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
                  <ChevronRight size={18} className="text-amber-500" /> Dashboard
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-200 leading-relaxed">
                  Your mission control. View real-time weather, farm stats, and recent alerts in one place.
                </p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
                  <ChevronRight size={18} className="text-amber-500" /> Field Map
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-200 leading-relaxed">
                  Interactive GIS map. Track crop health layers, monitor drone paths, and manage field boundaries.
                </p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
                  <ChevronRight size={18} className="text-amber-500" /> Livestock
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-200 leading-relaxed">
                  Monitor animal health, location, and breeding cycles using smart collars and cameras.
                </p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
                  <ChevronRight size={18} className="text-amber-500" /> Support Center
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-200 leading-relaxed">
                  Get help from our AI bot or open a ticket with our support team for complex issues.
                </p>
              </div>
            </div>
          </section>

          <section className="p-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5">
              <HelpCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-6 text-left mt-8">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-base mb-2">Q: How often is the data updated?</p>
                <p className="text-sm text-slate-600 dark:text-slate-200 leading-relaxed">A: Weather data updates every 15 minutes. Sensor data is real-time, and AI analysis depends on your upload frequency.</p>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-base mb-2">Q: Can I share my farm data with others?</p>
                <p className="text-sm text-slate-600 dark:text-slate-200 leading-relaxed">A: Yes, you can invite team members with different roles (Admin, Viewer) to your farm via the Settings page.</p>
              </div>
            </div>
          </section>

          {onAction && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-center">
              <button 
                onClick={() => {
                  onClose();
                  onAction();
                }}
                className="flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-200 dark:shadow-none hover:scale-105 active:scale-95"
              >
                <Settings size={20} />
                Manage Farms & Devices
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
