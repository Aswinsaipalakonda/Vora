import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, FileText, ExternalLink, HelpCircle, Book, Shield, Zap, Info } from 'lucide-react';
import { SidePanel } from '../components/SidePanel';

const Help = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [ticketForm, setTicketForm] = useState({ subject: '', description: '' });

    useEffect(() => {
        fetchHelpData();
    }, []);

    const fetchHelpData = async () => {
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            const [catRes, faqRes] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/support/faq-categories/', {
                    headers: { 'Authorization': `Token ${token}` }
                }),
                fetch('http://127.0.0.1:8000/api/support/faqs/', {
                    headers: { 'Authorization': `Token ${token}` }
                })
            ]);

            if (catRes.ok && faqRes.ok) {
                setCategories(await catRes.json());
                setFaqs(await faqRes.json());
            }
        } catch (error) {
            console.error('Failed to fetch help data:', error);
        }
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            const res = await fetch('http://127.0.0.1:8000/api/support/tickets/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ticketForm)
            });

            if (res.ok) {
                setTicketForm({ subject: '', description: '' });
                setIsPanelOpen(false);
                alert("Support ticket created successfully. Our team will get back to you soon!");
            }
        } catch (error) {
            console.error("Failed to create support ticket", error);
        }
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Search Section */}
            <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none opacity-50"></div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 relative z-10">How can we help you today?</h2>
                <div className="max-w-xl mx-auto relative z-10">
                    <div className="relative group">
                        <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-rose-500' : 'text-gray-400'}`} size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for answers..."
                            className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-[30px] pl-14 pr-6 text-sm font-bold shadow-sm focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all outline-none placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Categories */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((cat) => {
                            const IconComponent = (Icons as any)[cat.icon] || Icons.HelpCircle;
                            return (
                                <button key={cat.id} className="bg-white p-6 rounded-[25px] border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group text-left space-y-3">
                                    <div className={`h-10 w-10 rounded-2xl ${cat.bg_color} ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <IconComponent size={20} />
                                    </div>
                                    <span className="block text-xs font-bold text-gray-900">{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* FAQs */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest px-2">Frequently Asked Questions</h3>
                        <div className="space-y-3">
                            {filteredFaqs.map((faq) => (
                                <div key={faq.id} className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-sm transition-all hover:shadow-md">
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full flex items-center justify-between p-5 text-left"
                                    >
                                        <span className="text-sm font-bold text-gray-900">{faq.question}</span>
                                        {openFaq === faq.id ? (
                                            <ChevronUp size={16} className="text-rose-500" />
                                        ) : (
                                            <ChevronDown size={16} className="text-gray-400" />
                                        )}
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === faq.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <p className="px-5 pb-5 text-xs font-medium text-gray-500 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Support Actions */}
                <div className="space-y-8">
                    <div className="bg-gray-900 rounded-[30px] p-8 text-white text-center space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-black opacity-50"></div>
                        <div className="relative z-10">
                            <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                                <MessageCircle size={32} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold">Need instant help?</h3>
                            <p className="text-xs text-gray-400 leading-relaxed max-w-[200px] mx-auto">Our support team is available 24/7 to assist you with any issues.</p>
                            <button
                                onClick={() => setIsPanelOpen(true)}
                                className="w-full py-3 mt-8 bg-white text-gray-900 rounded-[30px] text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
                                Submit Support Ticket
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[30px] p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Other Ways to Connect</h3>

                        <a href="mailto:support@vora.app" className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                            <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Mail size={18} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-900">Email Support</h4>
                                <p className="text-[10px] text-gray-500 font-bold">Response within 24h</p>
                            </div>
                            <ExternalLink size={14} className="ml-auto text-gray-300 group-hover:text-gray-500" />
                        </a>

                        <a href="#" className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                            <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Book size={18} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-900">Documentation</h4>
                                <p className="text-[10px] text-gray-500 font-bold">Guides & Tutorials</p>
                            </div>
                            <ExternalLink size={14} className="ml-auto text-gray-300 group-hover:text-gray-500" />
                        </a>
                    </div>
                </div>
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title="Create Support Ticket"
                subtitle="Describe your issue and our team will get back to you."
                footer={
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsPanelOpen(false)}
                            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateTicket}
                            disabled={!ticketForm.subject || !ticketForm.description}
                            className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50"
                        >
                            Submit Ticket
                        </button>
                    </div>
                }
            >
                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Subject</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
                            placeholder="Briefly describe your issue..."
                            value={ticketForm.subject}
                            onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                        <textarea
                            required
                            className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300 resize-none min-h-[200px]"
                            placeholder="Please provide details to help us investigate..."
                            value={ticketForm.description}
                            onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                        />
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default Help;
