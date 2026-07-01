
import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Info,
  CheckCircle,
  Clock,
  Zap,
  MoreHorizontal,
  ChevronRight,
  Download,
  Plus,
  Search,
  ChevronDown,
  RefreshCcw,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
  UserPlus,
  ShoppingBag,
  Star,
  X,
  Bot
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import PremiumLoader from '../components/PremiumLoader';
import { useNavigate } from 'react-router-dom';

const API_DASHBOARD_URL = 'http://127.0.0.1:8000/api/reports/dashboard/';

const SummaryCard = ({ title, mainValue, breakdown, type = 'sales', selectedRange, onRangeChange }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to top on mount removed - handled globally in App.tsx

  const ranges = [
    'Today', 'Yesterday', 'Current Week', 'Current Month',
    'Last Week', 'Last Month', 'Past 3 Months', 'All', 'Custom'
  ];

  return (
    <div className="relative flex-1 min-w-[280px] duration-300 rounded-[30px] z-20 group transition-all">
      {/* Background with clipped blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#1e1b4b] to-[#581c87] rounded-[30px] overflow-hidden border border-white/5 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
      </div>

      {/* Content Container (Overflow Visible) */}
      <div className="relative p-6 z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 relative z-30">
          <h3 className="text-[10px] font-black text-indigo-200/60 uppercase tracking-widest">{title}</h3>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white rounded-full text-[9px] font-bold hover:bg-white/20 transition-colors uppercase tracking-widest border border-white/10 backdrop-blur-md"
            >
              {selectedRange} <ChevronDown size={10} />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                {ranges.map((range, index) => (
                  <button
                    key={range}
                    onClick={() => {
                      if (onRangeChange) onRangeChange(range);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[10px] font-bold hover:bg-gray-50 transition-colors ${index !== ranges.length - 1 ? 'border-b border-gray-50' : ''
                      } ${selectedRange === range ? 'text-indigo-600' : 'text-gray-600'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-center py-3 relative z-10 flex flex-col items-center">
          <div className="flex flex-col items-center gap-1 mb-1">
            <p className="text-3xl font-black text-white tracking-tight">₹{mainValue.toLocaleString()}</p>
            <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded-md border border-white/5">
              <TrendingUp size={10} className="text-emerald-400" />
              <span className="text-[9px] font-bold text-emerald-400">+12.5%</span>
            </div>
          </div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total {type} {selectedRange.toLowerCase()}</p>
        </div>
        <div className="mt-6 space-y-2.5 relative z-10 flex-1">
          {breakdown.map((item: any) => (
            <div key={item.label} className="flex justify-between items-center group/item p-1 rounded-lg transition-colors -mx-1 px-2">
              <span className="text-[10px] font-bold text-gray-400 group-hover/item:text-white transition-colors">{item.label}</span>
              <span className="text-xs font-black text-white">₹{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EngagementCard = ({ title, count, icon: Icon, color, subtext }: any) => (
  <div className="bg-white p-5 border border-gray-100 shadow-sm flex flex-col group hover:border-gray-200 transition-all cursor-pointer duration-300 rounded-[30px]">
    <div className="flex items-center justify-between mb-4">
      <div className={`h-10 w-10 rounded-xl ${color} bg-opacity-10 flex items-center justify-center text-opacity-100`}>
        <Icon size={18} className={color.replace('bg-', 'text-')} />
      </div>
      <button className="text-gray-300 hover:text-gray-900 transition-colors">
        <RefreshCcw size={14} />
      </button>
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-2 mb-1">
      <span className="text-2xl font-black text-gray-900">{count}</span>
      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
        <ArrowUpRight size={8} /> +8%
      </span>
    </div>
    <p className="text-[10px] text-gray-400 font-bold mb-6">{subtext || 'Today vs Last Week'}</p>

    <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
      <div>
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">This Week</p>
        <p className="text-[11px] font-bold text-gray-900">24 <span className="text-emerald-600 text-[9px]">+2</span></p>
      </div>
      <div>
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">This Month</p>
        <p className="text-[11px] font-bold text-gray-900">86 <span className="text-emerald-600 text-[9px]">+14</span></p>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAIActive, setIsAIActive] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartDropdownOpen, setChartDropdownOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('Current Month');
  const [invoiceDropdownOpen, setInvoiceDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getComparisonText = (range: string) => {
    switch (range) {
      case 'Today': return 'Today vs Yesterday';
      case 'Yesterday': return 'Yesterday vs Previous Day';
      case 'Current Week': return 'This Week vs Last Week';
      case 'Current Month': return 'This Month vs Last Month';
      case 'Last Week': return 'Last Week vs Previous Week';
      case 'Last Month': return 'Last Month vs Previous Month';
      case 'Past 3 Months': return 'Past 3 Months vs Previous 3 Months';
      case 'All': return 'All Time Setup Status';
      default: return `${range} vs Previous`;
    }
  };

  const [metrics, setMetrics] = useState({
    totalSales: 0,
    paidSales: 0,
    cashReceived: 0,
    upiReceived: 0,
    cardReceived: 0,
    invoiceCount: 0,
    customerCount: 0,
    appointmentCount: 0
  });

  const [topStaff, setTopStaff] = useState<any[]>([]);
  const [topServices, setTopServices] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([
    { name: 'New', value: 0, color: '#6366f1' },
    { name: 'Repeat', value: 0, color: '#f59e0b' },
  ]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('vora_token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const dbRes = await fetch(`${API_DASHBOARD_URL}?range=${encodeURIComponent(timeRange)}`, { headers: { 'Authorization': `Token ${token}` } });

      if (dbRes.ok) {
        const data = await dbRes.json();
        setMetrics(data.metrics);
        setTopStaff(data.topStaff);
        setTopServices(data.topServices);
        setChartData(data.chartData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchAIInsight = async () => {
    setLoadingAI(true);
    setIsAIActive(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Act as a luxury salon business consultant. Based on today's data (Sales: ₹0, New Customers: 35%, Repeat: 65%), give me 3 very short, actionable strategic tips to increase evening bookings and upsell bridal packages. Be concise.",
      });
      setAiInsight(response.text || "Insight unavailable at the moment.");
    } catch (error) {
      setAiInsight("Consider targeting repeat customers for a 'Happy Hour' 20% discount on hair services to fill afternoon slots.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700 relative" style={{ paddingBottom: '0' }}>

      {/* Top Banner: Payment Alert */}
      <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg shadow-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center">
            <Info size={16} />
          </div>
          <p className="text-xs font-bold">We have not yet received the payment. Please clear the payment for uninterrupted services.</p>
        </div>
        <button className="bg-white text-gray-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-md">
          Pay Now
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8 min-w-0">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setInvoiceDropdownOpen(!invoiceDropdownOpen)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-[30px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                >
                  New Invoice
                  <ChevronDown size={12} />
                </button>

                {invoiceDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {['Enquiry', 'Invoice', 'Appointment', 'Membership'].map((option, index) => (
                      <button
                        key={option}
                        onClick={() => setInvoiceDropdownOpen(false)}
                        className={`w-full text-left px-5 py-3 text-[11px] font-bold text-gray-600 hover:bg-gray-50 hover:text-rose-600 transition-colors ${index !== 3 ? 'border-b border-gray-50' : ''
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SummaryCard
              title="Sales Summary"
              mainValue={metrics.totalSales}
              type="sales"
              selectedRange={timeRange}
              onRangeChange={setTimeRange}
              breakdown={[
                { label: 'Total Invoiced', value: metrics.totalSales },
                { label: 'Total Paid', value: metrics.paidSales },
                { label: 'Total Pending', value: metrics.totalSales - metrics.paidSales },
                { label: 'Invoices Issued', value: metrics.invoiceCount },
              ]}
            />
            <SummaryCard
              title="Payment Summary"
              mainValue={metrics.paidSales}
              type="received"
              selectedRange={timeRange}
              onRangeChange={setTimeRange}
              breakdown={[
                { label: 'Cash', value: metrics.cashReceived },
                { label: 'UPI/Online', value: metrics.upiReceived },
                { label: 'Card', value: metrics.cardReceived },
                { label: 'Other', value: metrics.paidSales - (metrics.cashReceived + metrics.upiReceived + metrics.cardReceived) },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EngagementCard title="Purchase" count={metrics.invoiceCount} icon={ShoppingBag} color="bg-indigo-500" subtext={getComparisonText(timeRange)} />
            <EngagementCard title="Clients" count={metrics.customerCount} icon={Users} color="bg-blue-500" subtext={getComparisonText(timeRange)} />
            <EngagementCard title="Invoices" count={metrics.invoiceCount} icon={Zap} color="bg-amber-500" subtext={getComparisonText(timeRange)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-[30px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Repeat vs New Customers</h3>
                <div className="relative">
                  <button
                    onClick={() => setChartDropdownOpen(!chartDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[9px] font-bold hover:bg-gray-100 transition-colors uppercase tracking-widest"
                  >
                    {timeRange} <ChevronDown size={10} />
                  </button>

                  {chartDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      {['Today', 'Yesterday', 'Current Week', 'Current Month', 'Last Week', 'Last Month', 'Past 3 Months', 'All', 'Custom'].map((range, index) => (
                        <button
                          key={range}
                          onClick={() => {
                            setTimeRange(range);
                            setChartDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[10px] font-bold hover:bg-gray-50 transition-colors ${index !== 8 ? 'border-b border-gray-50' : ''
                            } ${timeRange === range ? 'text-indigo-600' : 'text-gray-600'}`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 pl-6">
                  {chartData.map(item => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[10px] font-bold text-gray-500">{item.name}</span>
                      <span className="text-xs font-black text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-5 border border-gray-100 shadow-sm rounded-[30px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Top Staff (Sales)</h3>
                  <button className="text-[9px] font-bold text-indigo-600 hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {topStaff.length > 0 ? topStaff.map((staff, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-7 w-7 rounded-full text-white flex items-center justify-center text-[9px] font-black ${staff.color || 'bg-gray-900'}`}>{staff.name.charAt(0)}</div>
                        <p className="text-xs font-bold text-gray-900">{staff.name}</p>
                      </div>
                      <p className="text-xs font-black text-emerald-600">{staff.amount}</p>
                    </div>
                  )) : (
                    <p className="text-[10px] font-bold text-gray-400 text-center py-4">No staff sales data available</p>
                  )}
                  <div className="text-center pt-2">
                    <p className="text-[9px] font-bold text-gray-300 italic">No more performance data available</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 border border-gray-100 shadow-sm rounded-[30px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Top Services</h3>
                  <button className="text-[9px] font-bold text-indigo-600 hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {topServices.length > 0 ? topServices.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg bg-gray-50 flex items-center justify-center text-indigo-600"><Star size={12} /></div>
                        <p className="text-xs font-bold text-gray-900">{service.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900">{service.count}</p>
                        <p className="text-[7px] font-black text-emerald-500">{service.trend}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-[10px] font-bold text-gray-400 text-center py-4">No service data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden sticky top-8">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900 mb-6">Appointments</h3>
              <div className="flex items-center justify-between mb-4">
                <div className="relative group cursor-pointer">
                  <p className="text-sm font-bold text-gray-400 group-hover:text-rose-600 transition-colors flex items-center gap-2">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(selectedDate)}
                    <ChevronDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <input
                    type="date"
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    value={selectedDate.toISOString().split('T')[0]}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker();
                      } catch (err) {
                        // Fallback or ignore if not supported
                      }
                    }}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedDate(new Date(e.target.value));
                      }
                    }}
                  />
                </div>
                <button className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline">All Appointments</button>
              </div>

              <div className="flex items-center justify-between mb-4 px-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  // Generate dates centered around selectedDate
                  const date = new Date(selectedDate);
                  date.setDate(selectedDate.getDate() - 3 + i);

                  const isCenter = i === 3;
                  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date).slice(0, 2); // Mo, Tu, etc.
                  const dayNumber = date.getDate();

                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest text-center">
                        {dayName}
                      </span>
                      <button
                        onClick={() => setSelectedDate(date)}
                        className={`h-8 w-8 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all duration-300 cursor-pointer ${isCenter ? 'bg-rose-500 text-white shadow-lg scale-110' : 'text-gray-400 hover:bg-gray-50'}`}
                      >
                        {dayNumber}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100/50">
                <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                  <Calendar size={20} className="text-gray-300" />
                </div>
                <h4 className="text-xs font-black text-gray-900 mb-1">No Appointments for {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(selectedDate)}</h4>
                <p className="text-[10px] text-gray-400 font-bold max-w-[180px] mx-auto leading-relaxed">The schedule is clear. Perfect time for walk-ins or admin work.</p>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">Notifications Summary</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">No user notified today</p>
                  <p className="text-xs font-bold text-gray-900 mb-4 italic">You have not sent any notifications today</p>
                  <button className="w-full py-3 bg-rose-500 text-white rounded-[30px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 transition-all">
                    <Plus size={12} /> Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
