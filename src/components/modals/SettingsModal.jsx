import { Settings, RotateCcw } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, onResetProgress }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Settings className="mr-2" size={20} /> Settings
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Storage</h3>
              <button 
                onClick={onResetProgress}
                className="w-full py-3 px-4 bg-white border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50 transition flex items-center justify-center"
              >
                <RotateCcw size={18} className="mr-2" />
                Reset All Progress
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                This will clear all mastered status and reset you to the beginning.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
