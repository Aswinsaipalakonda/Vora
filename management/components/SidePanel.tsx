import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    width = 'max-w-[480px]'
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <div className={`fixed inset-0 z-[9999] flex justify-end overflow-hidden transition-all duration-500 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            {/* Panel Container */}
            <div
                className={`relative w-full ${width} bg-white h-full shadow-2xl flex flex-col transition-transform duration-500 ease-out border-l border-gray-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
                        {subtitle && (
                            <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest mt-0.5">{subtitle}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors border border-gray-100 shadow-sm bg-white hover:text-gray-900"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-6 bg-gray-50/50 border-t border-gray-50 sticky bottom-0 z-10 backdrop-blur-sm">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
