import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity">
            <div 
                className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-indigo-50 p-2 rounded-full">
                            <AlertCircle className="w-6 h-6 text-indigo-600" />
                        </div>
                        <button 
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        {message}
                    </p>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-md hover:shadow-lg"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full sm:w-auto px-6 py-2.5 bg-white text-gray-700 font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
