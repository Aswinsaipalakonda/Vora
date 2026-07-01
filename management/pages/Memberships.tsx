
import React, { useState, useEffect, useMemo } from 'react';
import {
    Users,
    CreditCard,
    Crown,
    ChevronRight,
    TrendingUp,
    Plus,
    Check,
    Star,
    Zap,
    Shield,
    Search,
    Filter,
    SlidersHorizontal,
    MoreHorizontal,
    X,
    Clock,
    Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidePanel } from '../components/SidePanel';
import { usePlan } from '../components/PlanContext';

const API_PLANS_URL = 'http://127.0.0.1:8000/api/memberships/plans';
const API_SUBSCRIPTIONS_URL = 'http://127.0.0.1:8000/api/memberships/subscriptions';

const ICON_MAP: { [key: string]: any } = {
    'Crown': Crown,
    'Star': Star,
    'Shield': Shield,
    'Zap': Zap,
    'TrendingUp': TrendingUp,
    'Users': Users,
    'CreditCard': CreditCard
};

// --- Reusable UI Components ---

const InputGroup = ({ label, type = "text", placeholder, defaultValue, icon: Icon, className = "", value, onChange }: any) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="text-[11px] font-black text-gray-500">{label}</label>
        <div className="relative group">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                    <Icon size={16} />
                </div>
            )}
            <input
                type={type}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-white border border-gray-200 text-sm font-bold text-gray-900 rounded-xl ${Icon ? 'pl-11 pr-4' : 'px-4'} py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400`}
            />
        </div>
    </div>
);

const SelectGroup = ({ label, options, value, onChange, icon: Icon, className = "" }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find((o: any) => o.value === value) || options[0];

    return (
        <div className={`space-y-1.5 relative ${className}`}>
            <label className="text-[11px] font-black text-gray-500">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full bg-white border border-gray-200 text-sm font-bold text-gray-900 rounded-xl ${Icon ? 'pl-11' : 'px-4'} pr-10 py-3 flex items-center justify-between focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all shadow-sm hover:border-rose-200`}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        {Icon && <Icon size={16} className="text-gray-400 flex-shrink-0" />}
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{selected?.label || 'Select...'}</span>
                    </div>
                    <ChevronRight size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? '-rotate-90' : 'rotate-90'}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="max-h-60 overflow-y-auto py-2">
                            {options.map((opt: any) => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`px-4 py-3 text-[11px] font-black uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-between ${value === opt.value ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900'}`}
                                >
                                    {opt.label}
                                    {value === opt.value && <Check size={12} strokeWidth={3} />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {isOpen && <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

const Memberships: React.FC = () => {
    const navigate = useNavigate();
    const { checkPermission } = usePlan();
    const [viewMode, setViewMode] = useState<'tiers' | 'members'>('tiers');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

    // State
    const [plans, setPlans] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        period: 'Month',
        description: '',
        features: [] as string[],
        color: 'bg-amber-400',
        gradient: 'from-amber-400 to-amber-600',
        icon_name: 'Crown'
    });

    const [subscriptionForm, setSubscriptionForm] = useState({
        customer: '',
        plan: '',
        start_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        status: 'Active'
    });

    const fetchMembershipData = async () => {
        const token = localStorage.getItem('vora_token');
        if (!token) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            const [plansRes, subsRes, custRes] = await Promise.all([
                fetch(`${API_PLANS_URL}/`, { headers: { 'Authorization': `Token ${token}` } }),
                fetch(`${API_SUBSCRIPTIONS_URL}/`, { headers: { 'Authorization': `Token ${token}` } }),
                fetch('http://127.0.0.1:8000/api/customers/customers/', { headers: { 'Authorization': `Token ${token}` } })
            ]);

            if (plansRes.ok) setPlans(await plansRes.json());
            if (subsRes.ok) setSubscriptions(await subsRes.json());
            if (custRes.ok) setCustomers(await custRes.json());
        } catch (error) {
            console.error('Error fetching membership data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembershipData();
    }, []);

    const handleCreatePlan = async () => {
        const token = localStorage.getItem('vora_token');
        try {
            const response = await fetch(`${API_PLANS_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsCreateOpen(false);
                fetchMembershipData();
            }
        } catch (error) {
            console.error('Error creating plan:', error);
        }
    };

    const handleSubscribeCustomer = async () => {
        const token = localStorage.getItem('vora_token');
        try {
            const response = await fetch(`${API_SUBSCRIPTIONS_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(subscriptionForm)
            });

            if (response.ok) {
                setIsAddMemberOpen(false);
                fetchMembershipData();
            }
        } catch (error) {
            console.error('Error subscribing customer:', error);
        }
    };

    const metrics = useMemo(() => {
        const totalMRR = subscriptions
            .filter(s => s.status === 'Active')
            .reduce((acc, s) => {
                const plan = plans.find(p => p.id === s.plan);
                return acc + (plan ? Number(plan.price) : 0);
            }, 0);

        return {
            mrr: `₹${(totalMRR / 100000).toFixed(1)}L`,
            memberCount: subscriptions.length,
            activeSubs: subscriptions.filter(s => s.status === 'Active').length,
            growth: '+5%' // Mock trend for now
        };
    }, [plans, subscriptions]);

    const MetricHighlight = ({ label, value, trend, icon: Icon }: any) => {
        return (
            <div className="p-5 border border-white/5 shadow-xl flex flex-col group transition-all duration-300 rounded-[30px] relative overflow-hidden bg-gradient-to-br from-gray-900 via-[#1e1b4b] to-[#581c87]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <Icon size={18} className="text-white" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border bg-emerald-400/20 text-emerald-300 border-emerald-400/20">{trend}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 relative z-10 text-indigo-200/60">{label}</p>
                <div className="flex items-baseline gap-2 relative z-10">
                    <span className="text-2xl font-black text-white">{value}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Memberships & Loyalty</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage tiers, rewards, and subscriber growth</p>
                </div>
                <div className="bg-white border border-gray-100 p-1 rounded-[30px] flex items-center gap-1 h-10 shadow-sm">
                    <button
                        onClick={() => setViewMode('tiers')}
                        className={`px-8 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'tiers'
                            ? 'bg-gray-900 text-white shadow-lg'
                            : 'text-gray-400 hover:text-gray-900'
                            }`}
                    >
                        Tiers
                    </button>
                    <button
                        onClick={() => setViewMode('members')}
                        className={`px-8 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'members'
                            ? 'bg-gray-900 text-white shadow-lg'
                            : 'text-gray-400 hover:text-gray-900'
                            }`}
                    >
                        Members
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricHighlight label="Monthly Recurring Revenue" value={metrics.mrr} trend="+12%" icon={CreditCard} />
                <MetricHighlight label="Total Members" value={metrics.memberCount} trend="+5%" icon={Users} />
                <MetricHighlight label="Active Memberships" value={metrics.activeSubs} trend="+2%" icon={Shield} />
                <MetricHighlight label="Growth" value="23 New" trend="+8%" icon={TrendingUp} />
            </div>

            <div className="flex-1 min-h-0 w-full overflow-hidden">
                {viewMode === 'tiers' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <button
                            onClick={() => checkPermission('memberships') && setIsCreateOpen(true)}
                            className="bg-white/50 rounded-[30px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-5 text-center group cursor-pointer hover:border-rose-300 hover:bg-white transition-all duration-300 border-opacity-50 min-h-[300px]"
                        >
                            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:text-rose-500 transition-all mb-4 border border-gray-100 shadow-sm group-hover:scale-110">
                                <Plus size={24} />
                            </div>
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">New Membership</h3>
                            <p className="text-[9px] font-bold text-gray-400 mt-1 max-w-[140px] leading-relaxed">Create a custom loyalty plan.</p>
                        </button>

                        {plans.map((tier) => {
                            const Icon = ICON_MAP[tier.icon_name] || Star;
                            const tierSubs = subscriptions.filter(s => s.plan === tier.id);
                            const revenue = tierSubs.filter(s => s.status === 'Active').length * Number(tier.price);

                            return (
                                <div key={tier.id} className="group relative flex flex-col bg-white rounded-[30px] p-6 border border-gray-100 shadow-sm hover:border-gray-200 transition-all duration-300 overflow-hidden h-full">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${tier.gradient} opacity-10 rounded-bl-[50px] transition-transform group-hover:scale-150 duration-500`}></div>

                                    <div className="flex items-start justify-between mb-6 relative z-10">
                                        <div className={`h-12 w-12 rounded-2xl ${tier.color} bg-opacity-10 flex items-center justify-center text-gray-900 transition-transform duration-500 shadow-sm border border-gray-100`}>
                                            <Icon size={20} className="text-gray-900" />
                                        </div>
                                        <button className="h-8 w-8 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-300 hover:text-gray-900 transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">{tier.name}</h3>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-2xl font-black text-gray-900">₹{Number(tier.price).toLocaleString()}</span>
                                            <span className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">/ {tier.period}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-3 mb-8">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-2">Benefits</p>
                                        {(tier.features || []).map((benefit: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="h-4 w-4 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                    <Check size={8} className="text-emerald-500" strokeWidth={4} />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-600 truncate">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-50">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Members</p>
                                                <p className="text-xs font-black text-gray-900">{tierSubs.length}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Revenue</p>
                                                <p className="text-xs font-black text-emerald-600">₹{revenue.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button className="w-full py-3 bg-rose-500 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2">
                                            Manage Tier <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative group w-full md:w-96">
                                <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-rose-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 bg-white border border-gray-100 rounded-[30px] pl-14 pr-6 text-xs font-bold shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-5 h-10 bg-white border border-gray-100 text-gray-700 rounded-[30px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                                    <SlidersHorizontal size={14} /> Filter
                                </button>
                                <button
                                    onClick={() => {
                                        if (checkPermission('memberships')) {
                                            setSubscriptionForm(prev => ({ ...prev, plan: plans[0]?.id || '' }));
                                            setIsAddMemberOpen(true);
                                        }
                                    }}
                                    className="flex items-center gap-2 px-6 h-10 bg-gray-900 text-white rounded-[30px] text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                                >
                                    <Plus size={14} /> Add Member
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Member</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tier</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Lifetime Spend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {subscriptions.map(sub => (
                                        <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                            <td className="px-8 py-5 text-xs font-black text-gray-900">
                                                {typeof sub.id === 'string' ? sub.id.split('-')[0] : sub.id}
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-gray-800">{sub.customer_name}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border bg-gray-50 text-gray-600 border-gray-100`}>
                                                    {sub.plan_name}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-bold text-gray-500">{sub.start_date}</td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${sub.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    sub.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-rose-50 text-rose-600 border-rose-100'
                                                    }`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-gray-900">₹0</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <SidePanel
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Create Membership"
                subtitle="Design a new loyalty tier"
                width="max-w-[560px]"
                footer={
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsCreateOpen(false)}
                            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreatePlan}
                            className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors"
                        >
                            Create Membership
                        </button>
                    </div>
                }
            >
                {/* General Details */}
                <div className="space-y-5">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">General Details</p>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Plan Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Gold Tier"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Price (₹)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Period</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowPeriodDropdown(v => !v)}
                                    onBlur={() => setTimeout(() => setShowPeriodDropdown(false), 150)}
                                    className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-700 text-left flex items-center justify-between transition-all outline-none focus:bg-white focus:ring-1 focus:ring-rose-100"
                                >
                                    <span>{formData.period}</span>
                                    <ChevronRight size={13} className={`text-gray-400 transition-transform duration-200 ${showPeriodDropdown ? 'rotate-90' : ''}`} />
                                </button>
                                {showPeriodDropdown && (
                                    <div className="absolute left-0 top-full w-full bg-white border border-gray-100 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                        {['Month', 'Year', 'Custom'].map(opt => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onMouseDown={() => {
                                                    setFormData({ ...formData, period: opt });
                                                    setShowPeriodDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 text-xs font-bold flex items-center justify-between transition-colors ${formData.period === opt
                                                    ? 'bg-[#f5f6fa] text-gray-900'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {opt}
                                                {formData.period === opt && (
                                                    <Check size={12} className="text-rose-500" strokeWidth={3} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                        <textarea
                            placeholder="Describe the benefits of this tier..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full h-20 bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none resize-none"
                        />
                    </div>
                </div>

                <div className="h-px bg-gray-50 my-6" />

                {/* Icon */}
                <div className="space-y-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Icon</p>
                    <div className="flex gap-3 flex-wrap">
                        {Object.entries(ICON_MAP).map(([name, Icon]) => (
                            <button
                                key={name}
                                onClick={() => setFormData({ ...formData, icon_name: name })}
                                className={`w-10 h-10 flex items-center justify-center transition-all ${formData.icon_name === name ? 'bg-gray-900 text-white' : 'bg-[#f5f6fa] text-gray-400 hover:text-gray-700'}`}
                            >
                                <Icon size={16} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-gray-50 my-6" />

                {/* Color Theme */}
                <div className="space-y-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Color Theme</p>
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { color: 'bg-amber-400', gradient: 'from-amber-400 to-amber-600' },
                            { color: 'bg-rose-500', gradient: 'from-rose-500 to-rose-700' },
                            { color: 'bg-emerald-500', gradient: 'from-emerald-500 to-emerald-700' },
                            { color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-700' },
                            { color: 'bg-purple-500', gradient: 'from-purple-500 to-purple-700' },
                            { color: 'bg-gray-900', gradient: 'from-gray-700 to-gray-900' },
                        ].map((c) => (
                            <button
                                key={c.color}
                                onClick={() => setFormData({ ...formData, color: c.color, gradient: c.gradient })}
                                className={`w-8 h-8 ${c.color} transition-all ${formData.color === c.color ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'opacity-60 hover:opacity-100'}`}
                            />
                        ))}
                    </div>
                </div>
            </SidePanel>

            <SidePanel
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                title="Add New Member"
                subtitle="Subscribe a customer to a tier"
                footer={
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsAddMemberOpen(false)}
                            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubscribeCustomer}
                            className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors"
                        >
                            Subscribe Member
                        </button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <SelectGroup
                        label="Select Customer"
                        icon={Users}
                        value={subscriptionForm.customer}
                        onChange={(val: any) => setSubscriptionForm({ ...subscriptionForm, customer: val })}
                        options={customers.map(c => ({ label: c.name, value: c.id }))}
                    />

                    <SelectGroup
                        label="Select Membership Plan"
                        icon={Shield}
                        value={subscriptionForm.plan}
                        onChange={(val: any) => setSubscriptionForm({ ...subscriptionForm, plan: val })}
                        options={plans.map(p => ({ label: p.name, value: p.id }))}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup
                            label="Start Date"
                            type="date"
                            icon={Clock}
                            value={subscriptionForm.start_date}
                            onChange={(e: any) => setSubscriptionForm({ ...subscriptionForm, start_date: e.target.value })}
                        />
                        <InputGroup
                            label="Expiry Date"
                            type="date"
                            icon={Clock}
                            value={subscriptionForm.expiry_date}
                            onChange={(e: any) => setSubscriptionForm({ ...subscriptionForm, expiry_date: e.target.value })}
                        />
                    </div>

                    <div className="pt-2">
                        <label className="text-[11px] font-black text-gray-500 mb-3 block uppercase tracking-widest">Status</label>
                        <div className="flex bg-gray-50 p-1 rounded-xl">
                            {['Active', 'Pending', 'Expired'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setSubscriptionForm({ ...subscriptionForm, status })}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${subscriptionForm.status === status ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default Memberships;
