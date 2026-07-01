import React, { useState } from 'react';
import { Bell, X, Info, Calendar, CreditCard, MessageSquare, AlertCircle, ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';

const NotificationPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'All' | 'Updates'>('All');

    const notifications = [
        {
            id: 1,
            type: 'appointment',
            title: 'New Appointment',
            message: 'Priya Sharma booked a Balayage session for tomorrow at 2:00 PM.',
            time: '10m ago',
            icon: <Calendar size={18} className="text-rose-500" />,
            bgColor: 'bg-rose-50'
        },
        {
            id: 2,
            type: 'payment',
            title: 'Payment Received',
            message: 'Bill #82415 for ₹4,500 has been paid via UPI.',
            time: '45m ago',
            icon: <CreditCard size={18} className="text-green-500" />,
            bgColor: 'bg-green-50'
        },
        {
            id: 3,
            type: 'system',
            title: 'Inventory Alert',
            message: 'L\'Oréal Professional Shampoo stock is below threshold.',
            time: '2h ago',
            icon: <AlertCircle size={18} className="text-amber-500" />,
            bgColor: 'bg-amber-50'
        }
    ];

    const updates = [
        {
            id: 4,
            type: 'update',
            title: 'System Update v2.4',
            message: 'New tax management features are now live in your settings.',
            time: 'Yesterday',
            icon: <Info size={18} className="text-blue-500" />,
            bgColor: 'bg-blue-50'
        }
    ];

    const sidePanel = isOpen ? createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-300"
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Side Panel */}
            <div className="relative w-full max-w-[420px] bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out border-l border-gray-100">

                {/* Header Style Sync */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="bg-gray-50 border border-gray-100 p-1 rounded-[30px] flex items-center gap-1 h-10">
                        {(['All', 'Updates'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-gray-900'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2.5 hover:bg-gray-50 rounded-full text-gray-400 transition-colors border border-gray-100 shadow-sm bg-white">
                        <X size={16} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                    <div className="space-y-3">
                        {(activeTab === 'All' ? notifications : updates).map((notif) => (
                            <div key={notif.id} className="p-4 bg-white border border-gray-100 rounded-[25px] hover:border-rose-100 transition-all cursor-pointer group group-hover:shadow-sm">
                                <div className="flex gap-4">
                                    <div className={`h-10 w-10 rounded-2xl ${notif.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                        {notif.icon}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notif.title}</p>
                                            <span className="text-[9px] font-medium text-gray-300">{notif.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 font-bold leading-snug group-hover:text-gray-900 transition-colors">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition-all pt-1">
                                            <span>Action Required</span> <ArrowRight size={10} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {activeTab === 'All' && notifications.length === 0 && (
                        <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                <Bell size={32} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">All caught up!</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">No new notifications for now.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Sync */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-50">
                    <button className="w-full py-3 bg-white border border-gray-100 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-900 hover:text-white transition-all shadow-sm">
                        Mark All as Read
                    </button>
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            {sidePanel}
            <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 text-gray-400 hover:bg-gray-50 rounded-full transition-all group"
            >
                <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm ring-2 ring-rose-100 group-hover:scale-110 transition-all"></span>
            </button>
        </>
    );
};

export default NotificationPanel;
