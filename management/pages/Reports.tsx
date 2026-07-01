import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Calendar,
    Download,
    Users,
    CreditCard,
    Package,
    ArrowRight,
    ChevronDown,
    Printer,
    PieChart,
    Activity,
    DollarSign,
    Star,
    ArrowDown,
    ArrowUp
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { SidePanel } from '../components/SidePanel';

// --- Reusable UI Components ---

const SelectGroup = ({ label, options, value, onChange, icon: Icon, className = "" }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find((o: any) => o.value === value) || options[0];

    return (
        <div className={`space-y-1.5 relative ${className}`}>
            {label && <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{label}</label>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-900 rounded-xl ${Icon ? 'pl-11' : 'px-4'} pr-10 py-2.5 flex items-center justify-between focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all shadow-sm hover:border-gray-200`}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        {Icon && <Icon size={14} className="text-gray-400 flex-shrink-0" />}
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{selected?.label || 'Select...'}</span>
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? '-rotate-180' : 'rotate-0'}`} />
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
                                    className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-between ${value === opt.value ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900'}`}
                                >
                                    {opt.label}
                                    {value === opt.value && <Check size={12} strokeWidth={3} className="text-rose-500" />}
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

const Check = ({ size, strokeWidth, className }: any) => (
    <Activity size={size} strokeWidth={strokeWidth} className={className} />
);

const API_REPORTS_URL = 'http://127.0.0.1:8000/api/reports';

const MetricHighlight = ({ label, value, trend, icon: Icon, color = 'emerald' }: any) => {
    const isNegative = trend.toString().startsWith('-');
    return (
        <div className="p-5 border border-white/5 shadow-xl flex flex-col group transition-all duration-300 rounded-[30px] relative overflow-hidden bg-gradient-to-br from-gray-900 via-[#1e1b4b] to-[#581c87]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <Icon size={18} className="text-white" />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${isNegative ? 'bg-rose-400/20 text-rose-300 border-rose-400/20' : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/20'}`}>
                    {trend}
                </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 relative z-10 text-indigo-200/60">{label}</p>
            <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-2xl font-black text-white">{value}</span>
            </div>
        </div>
    );
};

const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'sales' | 'staff' | 'inventory' | 'all_reports'>('sales');
    const [dateRange, setDateRange] = useState('7'); // days
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [isReportLoading, setIsReportLoading] = useState(false);
    const [reportCategories, setReportCategories] = useState<any[]>([]);

    const [salesData, setSalesData] = useState<any>({
        metrics: { total_revenue: 0, total_bookings: 0, avg_ticket: 0, retention_rate: 0 },
        trends: [],
        categories: []
    });

    const [staffData, setStaffData] = useState<any>({
        metrics: { active_staff: 0, avg_utilization: 0, rev_per_staff: 0, satisfaction: 0 },
        performance: []
    });

    const [inventoryData, setInventoryData] = useState<any>({
        metrics: { total_products: 0, low_stock_count: 0, total_stock_value: 0, stock_health: 0 },
        movement: [],
        top_products: []
    });

    useEffect(() => {
        fetchReportsData();
        fetchReportCategories(); // Fetch categories on mount
    }, [dateRange]); // Keep dateRange dependency for main reports data

    const fetchReportCategories = async () => {
        const token = localStorage.getItem('vora_token');
        if (!token) return;
        try {
            const res = await fetch(`${API_REPORTS_URL}/categories/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReportCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch report categories:', error);
        }
    };

    const fetchReportsData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            // Fetch Sales
            const salesRes = await fetch(`${API_REPORTS_URL}/sales/?days=${dateRange}`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (salesRes.ok) {
                const sData = await salesRes.json();
                setSalesData(sData);
            }

            // Fetch Staff
            const staffRes = await fetch(`${API_REPORTS_URL}/staff/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (staffRes.ok) {
                const stData = await staffRes.json();
                setStaffData(stData);
            }

            // Fetch Inventory
            const invRes = await fetch(`${API_REPORTS_URL}/inventory/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (invRes.ok) {
                const iData = await invRes.json();
                setInventoryData(iData);
            }
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSpecificReport = async (reportType: string) => {
        setIsReportLoading(true);
        setSelectedReport(reportType);
        const token = localStorage.getItem('vora_token');
        try {
            const res = await fetch(`${API_REPORTS_URL}/generic/?type=${reportType}`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReportData(data);
            }
        } catch (error) {
            console.error('Failed to fetch specific report:', error);
        } finally {
            setIsReportLoading(false);
        }
    };

    const ReportSidePanel = () => {
        if (!selectedReport) return null;

        const footer = reportData && !isReportLoading ? (
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={() => setSelectedReport(null)}
                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                >
                    Close
                </button>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-900 text-[10px] font-black uppercase tracking-widest hover:border-gray-900 transition-all flex items-center justify-center gap-2">
                        <Printer size={14} /> Print
                    </button>
                    <button className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>
        ) : null;

        return (
            <SidePanel
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                title={reportData?.title || selectedReport.replace('-', ' ')}
                subtitle="Detailed Report View"
                width="max-w-[800px]"
                footer={footer}
            >
                <div className="space-y-8">
                    {isReportLoading ? (
                        <div className="h-[40vh] flex flex-col items-center justify-center space-y-4">
                            <div className="w-8 h-8 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Generating Report...</p>
                        </div>
                    ) : reportData ? (
                        <>
                            {/* Summary Metrics */}
                            <div className="grid grid-cols-3 gap-4">
                                {reportData.summary.map((s: any, i: number) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                                        <p className="text-sm font-black text-gray-900">{s.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Main Data Table */}
                            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            {reportData.columns.map((col: string, i: number) => (
                                                <th key={i} className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {reportData.rows.map((row: any[], i: number) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                                {row.map((cell: any, j: number) => (
                                                    <td key={j} className="px-6 py-4 text-xs font-bold text-gray-600">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 text-gray-400">Failed to load report data.</div>
                    )}
                </div>
            </SidePanel>
        );
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 relative min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Reports & Analytics</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Deep dive into your salon's performance</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white border border-gray-100 p-1 rounded-[30px] h-10 shadow-sm">
                        <button
                            onClick={() => setActiveTab('sales')}
                            className={`px-6 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'sales'
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'text-gray-400 hover:text-gray-900'
                                }`}
                        >
                            Sales
                        </button>
                        <button
                            onClick={() => setActiveTab('staff')}
                            className={`px-6 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'staff'
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'text-gray-400 hover:text-gray-900'
                                }`}
                        >
                            Staff
                        </button>
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={`px-6 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory'
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'text-gray-400 hover:text-gray-900'
                                }`}
                        >
                            Inventory
                        </button>
                        <button
                            onClick={() => setActiveTab('all_reports')}
                            className={`px-6 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all_reports'
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'text-gray-400 hover:text-gray-900'
                                }`}
                        >
                            All Reports
                        </button>
                    </div>

                    <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>

                    <button className="flex items-center gap-2 px-5 h-10 bg-rose-500 text-white rounded-[30px] text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-100">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Sales Tab */}
            {activeTab === 'sales' && (
                <div className={`space-y-6 transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <MetricHighlight label="Total Revenue" value={`₹${salesData.metrics.total_revenue.toLocaleString()}`} trend="+12.5%" icon={DollarSign} />
                        <MetricHighlight label="Total Bookings" value={salesData.metrics.total_bookings} trend="+8.2%" icon={Calendar} />
                        <MetricHighlight label="Avg. Ticket Value" value={`₹${salesData.metrics.avg_ticket.toLocaleString()}`} trend="+3.1%" icon={CreditCard} />
                        <MetricHighlight label="Retention Rate" value={`${salesData.metrics.retention_rate}%`} trend="+1.5%" icon={Users} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Revenue Chart */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Revenue Trends</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gross Sales Over Time</p>
                                </div>
                                <SelectGroup
                                    value={dateRange}
                                    onChange={(val: any) => setDateRange(val)}
                                    options={[
                                        { label: 'Last 7 Days', value: '7' },
                                        { label: 'Last 14 Days', value: '14' },
                                        { label: 'Last Month', value: '30' }
                                    ]}
                                    className="w-40"
                                />
                            </div>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesData.trends}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#111827' }}
                                            labelStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Category Breakdown */}
                        <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Top Categories</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue by Service Metrics</p>
                            </div>
                            <div className="flex-1 relative">
                                <div className="space-y-6 mt-4">
                                    {salesData.categories.map((cat: any, i: number) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-gray-700 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                                                    {cat.name}
                                                </span>
                                                <span className="font-black text-gray-900">{cat.value}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${cat.value}%`, backgroundColor: cat.color }}></div>
                                            </div>
                                        </div>
                                    ))}
                                    {salesData.categories.length === 0 && (
                                        <div className="text-center py-8 text-gray-400 text-xs font-bold">No Category Data</div>
                                    )}
                                </div>

                                <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Insight</p>
                                    <p className="text-xs font-medium text-gray-600 leading-relaxed">
                                        <span className="text-rose-500 font-bold">Haircuts</span> are driving nearly half of your revenue this week. Consider promoting <span className="text-emerald-500 font-bold">Facials</span> to balance service mix.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Staff Tab */}
            {activeTab === 'staff' && (
                <div className={`space-y-6 transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <MetricHighlight label="Active Staff" value={staffData.metrics.active_staff} trend="0" icon={Users} color="violet" />
                        <MetricHighlight label="Avg Utilization" value={`${staffData.metrics.avg_utilization}%`} trend="+4%" icon={Activity} color="violet" />
                        <MetricHighlight label="Revenue / Staff" value={`₹${staffData.metrics.rev_per_staff.toLocaleString()}`} trend="+5.2%" icon={DollarSign} color="violet" />
                        <MetricHighlight label="Satisfaction" value={staffData.metrics.satisfaction} trend="+0.1" icon={Star} color="violet" />
                    </div>

                    <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Staff Member</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Bookings</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Rating</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Revenue Generated</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {staffData.performance.map((staff: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs">
                                                    {staff.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{staff.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center font-bold text-gray-600">{staff.bookings}</td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black">
                                                {staff.rating} <Star size={10} className="fill-current" />
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-gray-900">₹{staff.revenue.toLocaleString()}</td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-colors">Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
                <div className={`space-y-6 transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <MetricHighlight label="Total Products" value={inventoryData.metrics.total_products} trend="0" icon={Package} color="amber" />
                        <MetricHighlight label="Low Stock Items" value={inventoryData.metrics.low_stock_count} trend={inventoryData.metrics.low_stock_count > 0 ? `-${inventoryData.metrics.low_stock_count}` : '0'} icon={Activity} color="rose" />
                        <MetricHighlight label="Stock Value" value={`₹${inventoryData.metrics.total_stock_value.toLocaleString()}`} trend="+2.4%" icon={CreditCard} color="emerald" />
                        <MetricHighlight label="Stock Health" value={`${inventoryData.metrics.stock_health}%`} trend="+5%" icon={Star} color="emerald" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Stock Movement</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Units Sold Over Time</p>
                                </div>
                            </div>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={inventoryData.movement}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                                            cursor={{ fill: '#f8fafc' }}
                                        />
                                        <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-6">Top Value Stock</h3>
                            <div className="space-y-4">
                                {inventoryData.top_products.map((prod: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-rose-50 transition-colors group">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-900">{prod.name}</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{prod.sku}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-900">₹{prod.value.toLocaleString()}</p>
                                            <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{prod.stock} Units</p>
                                        </div>
                                    </div>
                                ))}
                                {inventoryData.top_products.length === 0 && (
                                    <div className="text-center py-12">
                                        <Package className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Products Found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* All Reports Tab */}
            {activeTab === 'all_reports' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 px-4">
                    {reportCategories.map((cat, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-base font-bold text-gray-400 uppercase tracking-widest text-[10px]">{cat.title}</h3>
                            <div className="space-y-1">
                                {cat.items.map((item: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => fetchSpecificReport(item)}
                                        className="flex items-center gap-3 group w-full text-left p-2 rounded-xl hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-rose-500 transition-colors"></div>
                                        <span className="text-[11px] font-bold text-gray-500 group-hover:text-rose-600 transition-colors">{item}</span>
                                        <ArrowRight size={10} className="ml-auto opacity-0 group-hover:opacity-100 text-rose-500 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {reportCategories.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-10 h-10 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Report Directory...</p>
                        </div>
                    )}
                </div>
            )}

            <ReportSidePanel />
        </div>
    );
};

export default Reports;
