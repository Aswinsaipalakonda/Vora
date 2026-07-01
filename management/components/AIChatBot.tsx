import React, { useState } from 'react';
import { Bot, X, Palette, Users, Sparkles, LogOut, Info, ArrowUpRight, Command, Send, Image as ImageIcon, Map, Search } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PremiumLoader from './PremiumLoader';
import { createPortal } from 'react-dom';

const AIChatBot: React.FC = () => {
    const [isAIActive, setIsAIActive] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [activeTab, setActiveTab] = useState<'Chat' | 'History'>('Chat');

    const fetchAIInsight = async () => {
        setLoadingAI(true);
        setIsAIActive(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setAiInsight("Based on your sales data, Indiranagar branch is seeing a 15% increase in high-value bridal treatments this month.");
        } catch (error) {
            setAiInsight("Consider targeting repeat customers for a 'Happy Hour' 20% discount on hair services.");
        } finally {
            setLoadingAI(false);
        }
    };

    const sidePanel = isAIActive ? createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-500"
                onClick={() => setIsAIActive(false)}
            ></div>

            {/* Side Panel */}
            <div className="relative w-full max-w-[480px] bg-[#F9FAFB] h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out border-l border-gray-100">

                {/* Global Header Style Header */}
                <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
                    <div className="bg-white border border-gray-100 p-1 rounded-[30px] flex items-center gap-1 h-10 shadow-sm">
                        {(['Chat', 'History'] as const).map((tab) => (
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
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsAIActive(false)} className="p-2.5 hover:bg-gray-50 rounded-full text-gray-400 transition-colors border border-gray-100 shadow-sm bg-white">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 select-none custom-scrollbar flex justify-center flex-col">


                    {/* Unified Page Header Style Greeting */}
                    <div className="space-y-1 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Hello Harshavardhan 👋</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">How can I help you today?</p>
                    </div>

                    {/* Suggestion Section */}
                    <div className="space-y-6">

                        {/* Category Pills System Style */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['Sales', 'Inventory', 'Staff', 'Customers', 'Marketing', 'Billing'].map((cat) => (
                                <button key={cat} className="px-5 py-2.5 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm">
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {aiInsight && (
                        <div className="p-8 bg-white rounded-[30px] border border-gray-100 shadow-xl shadow-rose-50/50 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
                            <p className="text-sm text-gray-800 font-medium leading-relaxed italic relative z-10 text-center">
                                "{aiInsight}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Sticky Input Footer Style Sync */}
                <div className="p-6 pt-0 pb-2">
                    <div className="relative bg-white border border-gray-200 rounded-[25px] p-3 flex flex-col gap-2 focus-within:bg-white focus-within:border-rose-100 transition-all">
                        <textarea
                            placeholder="Ask Vora Intelligence anything..."
                            className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-900 resize-none min-h-[60px] placeholder:text-gray-400 placeholder:font-medium"
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-0.5">
                                <button className="p-2 text-gray-400 hover:bg-white hover:text-rose-600 rounded-full transition-all border border-transparent hover:border-gray-100">
                                    <ImageIcon size={14} />
                                </button>
                                <button className="p-2 text-gray-400 hover:bg-white hover:text-rose-600 rounded-full transition-all border border-transparent hover:border-gray-100">
                                    <Map size={14} />
                                </button>
                                <button className="p-2 text-gray-400 hover:bg-white hover:text-rose-600 rounded-full transition-all border border-transparent hover:border-gray-100">
                                    <Search size={14} />
                                </button>
                            </div>
                            <button
                                onClick={fetchAIInsight}
                                className="h-10 w-10 bg-rose-600 text-white rounded-full flex items-center justify-center hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-200"
                            >
                                <Send className="text-[10px] rotate-45" size={16} />
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[6px] font-black text-gray-300 mt-4 tracking-widest uppercase">
                        Vora Intelligence • Powered by AI
                    </p>
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            {sidePanel}

            <button
                onClick={fetchAIInsight}
                className={`relative p-1.5 rounded-full transition-all duration-300 group overflow-hidden ${isAIActive
                    ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg scale-110'
                    : 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 hover:shadow-md'
                    }`}
            >
                <div className="relative z-10 w-[26px] h-[26px] flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                        <style>
                            {`
                                @keyframes twinkle {
                                    0%, 100% { transform: scale(1); opacity: 1; }
                                    50% { transform: scale(0.85); opacity: 0.8; }
                                }
                                .gemini-icon { transform-origin: center; }
                                .group-hover .gemini-icon { animation: twinkle 1.5s ease-in-out infinite; }
                            `}
                        </style>
                        <path
                            d="M12 2C12 8 8 12 2 12C8 12 12 16 12 22C12 16 16 12 22 12C16 12 12 8 12 2Z"
                            fill="currentColor"
                            className="gemini-icon transition-all duration-300"
                        />
                    </svg>
                </div>
            </button>
        </>
    );
};

export default AIChatBot;
