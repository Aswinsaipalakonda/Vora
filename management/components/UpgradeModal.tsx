import React, { useState, useEffect } from 'react';
import { X, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const UpgradeModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feature, setFeature] = useState('');

    useEffect(() => {
        const handleShow = (e: any) => {
            setFeature(e.detail.feature);
            setIsOpen(true);
        };

        window.addEventListener('show-upgrade-modal', handleShow);
        return () => window.removeEventListener('show-upgrade-modal', handleShow);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-white rounded-[30px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X size={20} className="text-gray-400" />
                </button>

                {/* Top Header Section with Sparkles/Zap */}
                <div className="bg-gradient-to-br from-rose-50 to-white px-8 pt-12 pb-8 text-center">
                    <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-200 animate-bounce-slow">
                        <Zap size={32} className="text-white fill-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Your Plan</h2>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        The <span className="text-rose-600 font-bold uppercase tracking-tight">{feature.replace('_', ' ')}</span> feature is available in our <span className="font-bold text-gray-900">Professional</span> and <span className="font-bold text-gray-900">Business</span> plans.
                    </p>
                </div>

                {/* Feature List Preview */}
                <div className="px-10 py-6 space-y-4">
                    <div className="flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Unlock advanced business tools</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Higher usage limits and priority support</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Smart AI insights to grow your salon</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-8 pt-2 flex flex-row gap-3">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-4 bg-white hover:bg-gray-50 text-gray-500 font-bold rounded-[30px] transition-all text-sm"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            // Smooth scroll to pricing on parent or redirect
                            window.location.href = '/#pricing';
                        }}
                        className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-[30px] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-gray-200"
                    >
                        View Pricing Plans
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
