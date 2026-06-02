import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';

interface FarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; location: string; image?: string; imageFile?: File }) => void;
}

export const FarmModal: React.FC<FarmModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, location, image: imageMode === 'url' ? image : undefined, imageFile: imageMode === 'file' && imageFile ? imageFile : undefined });
    setName('');
    setLocation('');
    setImage('');
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Farm</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Farm Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g., Sunny Valley Farm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
            <input 
              type="text" 
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g., California, USA"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Farm Image (Optional)</label>
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-2 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-colors ${imageMode === 'url' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <LinkIcon size={12} /> URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`px-2 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-colors ${imageMode === 'file' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <Upload size={12} /> Upload
                </button>
              </div>
            </div>
            
            {imageMode === 'url' ? (
              <input 
                type="url" 
                value={image}
                onChange={e => setImage(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="https://example.com/farm.jpg"
              />
            ) : (
              <div 
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Upload size={24} className="text-slate-400 mb-2" />
                <span className="text-sm text-slate-600 dark:text-slate-400 text-center">
                  {imageFile ? imageFile.name : 'Click to select an image from your device'}
                </span>
              </div>
            )}
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!name || !location}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              Add Farm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
