import React, { useState, useRef } from 'react';
import { X, Upload, MapPin } from 'lucide-react';

interface FarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; location: string; image?: string }) => void;
}

export const FarmModal: React.FC<FarmModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && location) {
      onSubmit({ name, location, image });
      setName('');
      setLocation('');
      setImage(undefined);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New Farm</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center">
            <div 
              className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer group relative"
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <>
                  <img src={image} alt="Farm Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload size={20} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                  <Upload size={24} className="mb-1" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">Upload</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            <p className="text-xs text-slate-500 mt-2">Farm Profile Picture (Optional)</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Farm Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="e.g. Sunrise Valley Farm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="e.g. California, USA"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-500 transition-colors shadow-sm shadow-emerald-500/20"
            >
              Create Farm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
