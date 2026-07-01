
import React, { useState, useRef, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  MoreHorizontal,
  ChevronDown,
  Star,
  TrendingUp,
  Mail,
  Phone,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCcw,
  Zap,
  Layers,
  ShieldCheck,
  X,
  CreditCard,
  Calendar,
  AlertCircle,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { Segment, SegmentCriteria } from '../types';
import { useNavigate } from 'react-router-dom';
import { SidePanel } from '../components/SidePanel';

const API_CUSTOMERS_URL = 'http://127.0.0.1:8000/api/customers';
const API_BILLING_URL = 'http://127.0.0.1:8000/api/billing';

const INITIAL_CUSTOMERS = [
  { id: '1', name: 'Amit Shah', phone: '+91 98273 12345', email: 'amit.s@gmail.com', lastCheckin: '2h ago', status: 'Active', totalSpend: '₹12,500', visits: 14, type: 'VIP' },
  { id: '2', name: 'Deepa Madhuri', phone: '+91 90021 55432', email: 'deepa.m@outlook.com', lastCheckin: '1d ago', status: 'Active', totalSpend: '₹45,200', visits: 32, type: 'VIP' },
  { id: '3', name: 'Rahul Khanna', phone: '+91 88212 99012', email: 'rahul.k@gmail.com', lastCheckin: '45d ago', status: 'Inactive', totalSpend: '₹2,100', visits: 2, type: 'Regular' },
  { id: '4', name: 'Sana Sheikh', phone: '+91 77601 23456', email: 'sana.s@yahoo.com', lastCheckin: '12h ago', status: 'Active', totalSpend: '₹18,900', visits: 8, type: 'Regular' },
  { id: '5', name: 'Vikram Singh', phone: '+91 99001 88776', email: 'v.singh@gmail.com', lastCheckin: '5d ago', status: 'Active', totalSpend: '₹3,500', visits: 12, type: 'Regular' },
];

const INITIAL_SEGMENTS: Segment[] = [
  { id: 's1', name: 'High Spenders', criteria: 'Spent > ₹20k', memberCount: 2, rules: { minSpend: 20000 }, icon: Zap },
  { id: 's2', name: 'Loyal Clients', criteria: 'Visits > 10', memberCount: 3, rules: { minVisits: 10 }, icon: Trophy },
  { id: 's3', name: 'At Risk', criteria: '30d+ Inactive', memberCount: 1, rules: { lastCheckInDays: 30 }, icon: AlertCircle },
];

const MetricHighlight = ({ label, value, trend, icon: Icon }: any) => {
  const isNegative = trend.toString().startsWith('-');
  return (
    <div className={`p-5 border border-white/5 shadow-xl flex flex-col group transition-all cursor-pointer duration-300 rounded-[30px] relative overflow-hidden ${isNegative
      ? 'bg-gradient-to-br from-[#330a12] via-[#7f1d2e] to-[#330a12]'
      : 'bg-gradient-to-br from-gray-900 via-[#1e1b4b] to-[#581c87]'
      }`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
          <Icon size={18} className="text-white" />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${isNegative
          ? 'bg-rose-500/20 text-rose-200 border-rose-500/20'
          : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/20'
          }`}>{trend}</span>
      </div>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 relative z-10 ${isNegative ? 'text-rose-200/70' : 'text-indigo-200/60'}`}>{label}</p>
      <div className="flex items-baseline gap-2 relative z-10">
        <span className="text-2xl font-black text-white">{value}</span>
      </div>
    </div>
  );
};

// SegmentBuilderModal is now replaced by SidePanel in the main component

// AddCustomerModal is now replaced by SidePanel in the main component

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('CUSTOMERS');
  const [customers, setCustomers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [activeSegmentFilter, setActiveSegmentFilter] = useState<string | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({ name: '', phone: '', email: '', gender: 'FEMALE' });
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(new Set());
  const [isBatchMenuOpen, setIsBatchMenuOpen] = useState(false);
  const [isNotifyPanelOpen, setIsNotifyPanelOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  const fetchCustomerData = async () => {
    const token = localStorage.getItem('vora_token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const [custRes, invRes] = await Promise.all([
        fetch(`${API_CUSTOMERS_URL}/customers/`, { headers: { 'Authorization': `Token ${token}` } }),
        fetch(`${API_BILLING_URL}/invoices/`, { headers: { 'Authorization': `Token ${token}` } })
      ]);

      if (custRes.ok) setCustomers(await custRes.json());
      if (invRes.ok) setInvoices(await invRes.json());
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleSaveCustomer = async (data: any) => {
    const token = localStorage.getItem('vora_token');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_CUSTOMERS_URL}/customers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setIsAddPanelOpen(false);
        setNewCustomerData({ name: '', phone: '', email: '', gender: 'FEMALE' });
        fetchCustomerData();
      }
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to top on mount removed - handled globally in App.tsx

  const customersWithMetrics = useMemo(() => {
    return customers.map(c => {
      const customerInvoices = invoices.filter(inv => inv.customer === c.id);
      const totalSpend = customerInvoices.reduce((acc, inv) => acc + (Number(inv.total_amount) || 0), 0);
      return {
        ...c,
        totalSpend: `₹${totalSpend.toLocaleString()}`,
        visits: customerInvoices.length,
        lastCheckin: customerInvoices.length > 0 ? 'Recently' : 'No visits',
        status: 'Active'
      };
    });
  }, [customers, invoices]);

  const filteredCustomers = useMemo(() => {
    if (!activeSegmentFilter) return customersWithMetrics;
    const segment = segments.find(s => s.id === activeSegmentFilter);
    if (!segment || !segment.rules) return customersWithMetrics;

    return customersWithMetrics.filter(c => {
      const spend = parseInt(c.totalSpend.replace(/[^0-9]/g, '')) || 0;
      const visits = c.visits || 0;
      // Recency logic simplified as we don't have accurate last visit date yet

      let match = true;
      if (segment.rules?.minSpend !== undefined && spend < segment.rules.minSpend) match = false;
      if (segment.rules?.minVisits !== undefined && visits < segment.rules.minVisits) match = false;
      return match;
    });
  }, [customersWithMetrics, activeSegmentFilter, segments]);

  const getCustomerBadges = (customer: typeof INITIAL_CUSTOMERS[0]) => {
    const badges = [];
    const spend = parseInt(customer.totalSpend.replace(/[^0-9]/g, '')) || 0;
    const visits = customer.visits || 0;
    const lastCheckin = customer.lastCheckin.toLowerCase();

    if (spend >= 30000) badges.push({ label: 'Power Spender', color: 'bg-amber-100 text-amber-700 border-amber-200' });
    else if (spend >= 10000) badges.push({ label: 'Premium', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' });

    if (visits >= 20) badges.push({ label: 'Loyal Native', color: 'bg-blue-100 text-blue-700 border-blue-200' });
    else if (visits < 3) badges.push({ label: 'New Client', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' });

    if (lastCheckin.includes('d') && parseInt(lastCheckin) > 30) {
      badges.push({ label: 'At Risk', color: 'bg-rose-100 text-rose-700 border-rose-200' });
    } else if (lastCheckin.includes('h')) {
      badges.push({ label: 'Active Now', color: 'bg-emerald-500 text-white border-transparent' });
    }

    return badges;
  };

  const handleSaveSegment = (newSegment: Segment) => {
    setSegments([newSegment, ...segments]);
    setIsBuilderOpen(false);
  };

  const handleExport = () => {
    const listToExport = selectedCustomerIds.size > 0
      ? customers.filter(c => selectedCustomerIds.has(c.id))
      : filteredCustomers;

    if (listToExport.length === 0) return;
    const headers = ['id', 'name', 'phone', 'email', 'lastCheckin', 'status', 'totalSpend', 'visits', 'type'];
    const csvContent = [headers.join(','), ...listToExport.map(row => headers.map(header => `"${String(row[header as keyof typeof row] || '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.setAttribute('download', `vora_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(row => row.trim() !== '');
      if (rows.length < 2) return;
      const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const newCustomers = rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
        const obj: any = {};
        headers.forEach((header, i) => obj[header] = values[i] || '');
        if (!obj.id) obj.id = Math.random().toString(36).substr(2, 9);
        return obj;
      });
      setCustomers(prev => [...prev, ...newCustomers]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-700">
      <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />

      <div className="flex items-end justify-between px-2 pt-0 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Intelligence</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deep dive into client lifetime value</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsBuilderOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-100 text-gray-900 px-6 py-2.5 rounded-[30px] font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
          >
            <Layers size={14} /> Segment Builder
          </button>
          <button
            onClick={() => setIsAddPanelOpen(true)}
            className="flex items-center gap-2 bg-rose-500 text-white px-6 py-2.5 rounded-[30px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-100"
          >
            <Plus size={14} /> New Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricHighlight label="Total Database" value={customers.length.toLocaleString()} trend="+0%" icon={Users} />
        <MetricHighlight label="Matched Reach" value={filteredCustomers.length} trend="Live" icon={Trophy} />
        <MetricHighlight label="Active" value={customers.length.toString()} trend="+0%" icon={TrendingUp} />
        <MetricHighlight label="New Today" value="0" trend="+0%" icon={Zap} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between pt-6">
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          <input
            type="text"
            placeholder="Find by name, phone, or email..."
            className="w-full h-10 bg-white border border-gray-100 rounded-[30px] pl-14 pr-6 text-xs font-bold shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-gray-300 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0 pb-2 md:pb-0">
          <div className="relative shrink-0">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-3 px-5 h-10 bg-white border border-gray-100 rounded-[30px] font-black text-[10px] uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-all shadow-sm min-w-[140px] justify-between group"
            >
              <div className="flex items-center gap-2">
                <div className="text-rose-500">
                  {activeSegmentFilter ? (
                    (() => {
                      const Icon = segments.find(s => s.id === activeSegmentFilter)?.icon;
                      return Icon ? <Icon size={14} /> : <Filter size={14} />;
                    })()
                  ) : (
                    <Users size={14} />
                  )}
                </div>
                <span>
                  {activeSegmentFilter ? segments.find(s => s.id === activeSegmentFilter)?.name : 'All Clients'}
                </span>
              </div>
              <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => { setActiveSegmentFilter(null); setIsFilterDropdownOpen(false); }}
                  className={`w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-rose-600 transition-all border-b border-gray-100/50 flex items-center gap-3 ${activeSegmentFilter === null ? 'text-rose-600 bg-gray-100' : 'text-gray-600'}`}
                >
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center ${activeSegmentFilter === null ? 'bg-white text-rose-600 border border-rose-100' : 'bg-gray-100 text-gray-400'}`}>
                    <Users size={12} />
                  </div>
                  All Clients
                </button>
                {segments.map((seg, index) => {
                  const Icon = seg.icon;
                  return (
                    <button
                      key={seg.id}
                      onClick={() => { setActiveSegmentFilter(seg.id); setIsFilterDropdownOpen(false); }}
                      className={`w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-rose-600 transition-all flex items-center gap-3 ${index !== segments.length - 1 ? 'border-b border-gray-100/50' : ''} ${activeSegmentFilter === seg.id ? 'text-rose-600 bg-gray-100' : 'text-gray-600'}`}
                    >
                      <div className={`h-6 w-6 rounded-lg flex items-center justify-center ${activeSegmentFilter === seg.id ? 'bg-white text-rose-600 border border-rose-100' : 'bg-gray-100 text-gray-400'}`}>
                        {Icon && <Icon size={12} />}
                      </div>
                      {seg.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsBatchMenuOpen(!isBatchMenuOpen)}
              className="flex items-center gap-2 px-5 h-10 bg-white border border-gray-200 rounded-[30px] text-[10px] font-black uppercase tracking-widest text-gray-700 whitespace-nowrap hover:bg-gray-50 transition-colors shadow-sm"
            >
              Batch <ChevronDown size={12} className={`text-gray-400 transition-transform ${isBatchMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isBatchMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => {
                    handleExport();
                    setIsBatchMenuOpen(false);
                  }}
                  disabled={selectedCustomerIds.size === 0}
                  className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-rose-600 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  <Download size={14} /> Export Selected ({selectedCustomerIds.size})
                </button>
                <button
                  onClick={() => {
                    setCustomers(prev => prev.filter(c => !selectedCustomerIds.has(c.id)));
                    setSelectedCustomerIds(new Set());
                    setIsBatchMenuOpen(false);
                  }}
                  disabled={selectedCustomerIds.size === 0}
                  className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  <X size={14} /> Delete Selected
                </button>
              </div>
            )}
          </div>

          <button
            onClick={fetchCustomerData}
            className={`flex items-center gap-2 px-5 h-10 bg-white border border-gray-200 text-gray-700 rounded-[30px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:text-rose-600 transition-colors shadow-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCcw size={14} className={isLoading ? 'animate-spin' : ''} /> Sync
          </button>

          <button onClick={handleExport} className="flex items-center gap-2 px-5 h-10 bg-white border border-gray-200 text-gray-700 rounded-[30px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm">
            Export
          </button>

          <button
            onClick={() => setIsNotifyPanelOpen(true)}
            className="flex items-center gap-2 px-5 h-10 bg-white border border-gray-200 text-[10px] font-black uppercase tracking-widest text-rose-600 rounded-[30px] whitespace-nowrap hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Bell size={14} /> Notify
          </button>
        </div>
      </div>

      {filteredCustomers.length > 0 ? (
        <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto min-h-[400px]">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 w-10">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    checked={filteredCustomers.length > 0 && selectedCustomerIds.size === filteredCustomers.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCustomerIds(new Set(filteredCustomers.map(c => c.id)));
                      } else {
                        setSelectedCustomerIds(new Set());
                      }
                    }}
                  />
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Engagement</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Visit</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lifetime Value</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((customer, index) => {
                const badges = getCustomerBadges(customer);
                const isLastFew = index >= filteredCustomers.length - 2 && filteredCustomers.length > 2;
                return (
                  <tr key={customer.id} className={`hover:bg-gray-50/80 transition-colors group ${selectedCustomerIds.has(customer.id) ? 'bg-rose-50/30' : ''}`}>
                    <td className="px-8 py-5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                        checked={selectedCustomerIds.has(customer.id)}
                        onChange={(e) => {
                          const newSelection = new Set(selectedCustomerIds);
                          if (e.target.checked) {
                            newSelection.add(customer.id);
                          } else {
                            newSelection.delete(customer.id);
                          }
                          setSelectedCustomerIds(newSelection);
                        }}
                      />
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="h-10 w-10 bg-gray-900 rounded-[14px] flex items-center justify-center text-white font-black text-xs shadow-md">
                            {customer.name?.charAt(0) || '?'}
                          </div>
                          {customer.type === 'VIP' && (
                            <div className="absolute -top-1 -right-1 bg-[#ffd600] p-0.5 rounded-md border-2 border-white text-black shadow-sm">
                              <ShieldCheck size={8} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-black text-gray-900">{customer.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold tracking-wider">{customer.phone}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {badges.map((seg, idx) => (
                              <span key={idx} className={`px-2 py-0.5 rounded-[6px] text-[8px] font-black uppercase tracking-widest border ${seg.color}`}>
                                {seg.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${customer.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                        }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-gray-300" />
                        <span className="text-xs font-bold text-gray-600">{customer.lastCheckin}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-gray-900 tracking-tight">{customer.totalSpend}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-1 w-1 bg-indigo-400 rounded-full"></div>
                        <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-widest">{customer.visits} Total Visits</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === customer.id ? null : customer.id);
                        }}
                        className={`p-2 rounded-xl transition-all ${openMenuId === customer.id ? 'bg-rose-50 text-rose-600' : 'text-gray-300 hover:text-gray-900 hover:bg-white'}`}
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {openMenuId === customer.id && (
                        <div
                          className={`absolute right-8 ${isLastFew ? 'bottom-full mb-1 origin-bottom-right' : 'top-full mt-1 origin-top-right'} w-48 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all flex items-center gap-3">
                            <Layers size={14} /> View Profile
                          </button>
                          <button className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all flex items-center gap-3">
                            <TrendingUp size={14} /> Edit Details
                          </button>
                          <div className="h-px bg-gray-100 my-1 mx-2"></div>
                          <button
                            className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-3"
                            onClick={() => {
                              // Perform delete (could call an API later)
                              setCustomers(prev => prev.filter(c => c.id !== customer.id));
                              setOpenMenuId(null);
                            }}
                          >
                            <X size={14} /> Delete Client
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-16 flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-gray-50 rounded-[24px] flex items-center justify-center mb-6">
            <Users size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight mb-2">Segment is currently empty</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Try adjusting your segment filters to reach more clients.</p>
        </div>
      )}

      {/* Reusable Side Panels */}

      {/* Segment Builder SidePanel */}
      <SidePanel
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        title="Segment Builder"
        subtitle="Design target audience rules"
        width="max-w-[800px]"
      >
        <SegmentBuilderContent
          onSave={handleSaveSegment}
          customers={customersWithMetrics}
          onClose={() => setIsBuilderOpen(false)}
        />
      </SidePanel>

      {/* New Client SidePanel */}
      <SidePanel
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
        title="New Client"
        subtitle="Add a new client to your database"
        footer={
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsAddPanelOpen(false)}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveCustomer(newCustomerData)}
              disabled={isLoading || !newCustomerData.name || !newCustomerData.phone}
              className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
              placeholder="Enter client name"
              value={newCustomerData.name}
              onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
            <input
              type="text"
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
              placeholder="+91 XXXXX XXXXX"
              value={newCustomerData.phone}
              onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
              placeholder="client@email.com"
              value={newCustomerData.email}
              onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gender</label>
            <div className="flex bg-[#f5f6fa] p-1 gap-1 rounded-[30px]">
              {['MALE', 'FEMALE', 'OTHERS'].map((g) => (
                <button
                  key={g}
                  onClick={() => setNewCustomerData({ ...newCustomerData, gender: g })}
                  className={`flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest rounded-[30px] transition-all ${newCustomerData.gender === g ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SidePanel>


      {/* Notification SidePanel */}
      <SidePanel
        isOpen={isNotifyPanelOpen}
        onClose={() => setIsNotifyPanelOpen(false)}
        title="Send Notification"
        subtitle={`Reach out to ${selectedCustomerIds.size || filteredCustomers.length} clients`}
        width="max-w-[500px]"
      >
        <NotifyPanelContent
          recipients={selectedCustomerIds.size > 0
            ? customers.filter(c => selectedCustomerIds.has(c.id))
            : filteredCustomers
          }
          onClose={() => setIsNotifyPanelOpen(false)}
        />
      </SidePanel>
    </div>
  );
};

// Refactored SegmentBuilderContent to be used inside SidePanel
const SegmentBuilderContent = ({ onSave, customers, onClose }: any) => {
  const [name, setName] = useState('');
  const [activeRules, setActiveRules] = useState({ spend: false, visits: false, recency: false });
  const [rules, setRules] = useState<SegmentCriteria>({ minSpend: 15000, minVisits: 5, lastCheckInDays: 30 });

  const matchingCount = useMemo(() => {
    return customers.filter((c: any) => {
      const rawSpend = c.totalSpend ? c.totalSpend.toString().replace(/[^0-9]/g, '') : '0';
      const spend = parseInt(rawSpend) || 0;
      const visits = c.visits || 0;
      const lastCheckinStr = c.lastCheckin || '';
      const lastCheckinDays = parseInt(lastCheckinStr) || 0;

      let match = true;
      if (activeRules.spend && spend < (rules.minSpend || 0)) match = false;
      if (activeRules.visits && visits < (rules.minVisits || 0)) match = false;
      if (activeRules.recency) {
        if (!lastCheckinStr.toLowerCase().includes('d')) match = false;
        else if (lastCheckinDays < (rules.lastCheckInDays || 0)) match = false;
      }
      return match;
    }).length;
  }, [rules, activeRules, customers]);

  return (
    <div className="flex flex-col md:flex-row h-full -m-6">
      {/* Left: Builder Controls */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Segment Name</label>
            <input
              type="text"
              placeholder="e.g. VIP High Spenders"
              className="w-full text-xs font-bold bg-[#f5f6fa] border-0 px-4 py-3 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all placeholder:text-gray-300 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Targeting Logic</label>
              <div className="px-2 py-0.5 bg-rose-50 rounded-full text-[8px] font-bold text-rose-500 uppercase tracking-tighter shadow-sm border border-rose-100/50">Smart Filter</div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Spend Rule Card */}
              <div className={`p-4 rounded-[22px] border transition-all duration-300 ${activeRules.spend ? 'border-rose-200 bg-rose-50/10 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${activeRules.spend ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-gray-100 text-gray-400'}`}>
                      <CreditCard size={15} />
                    </div>
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest block ${activeRules.spend ? 'text-gray-900' : 'text-gray-400'}`}>Spending Power</span>
                      <p className="text-[7px] font-bold text-gray-900 uppercase tracking-tight">Minimum revenue</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveRules({ ...activeRules, spend: !activeRules.spend })}
                    className={`h-5 w-9 rounded-full transition-all duration-300 relative ${activeRules.spend ? 'bg-rose-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${activeRules.spend ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                {activeRules.spend && (
                  <div className="space-y-3 animate-in slide-in-from-top-1 duration-200 px-0.5">
                    <div className="flex justify-between items-end">
                      <p className="text-[9px] font-bold text-gray-900 uppercase tracking-wide">Min. Threshold</p>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[10px] font-bold text-rose-400">₹</span>
                        <p className="text-xl font-black text-rose-500 tracking-tight">{rules.minSpend?.toLocaleString()}</p>
                      </div>
                    </div>
                    <input
                      type="range" min="0" max="100000" step="1000"
                      className="w-full accent-rose-500 h-1 bg-rose-100/50 rounded-lg cursor-pointer appearance-none"
                      value={rules.minSpend}
                      onChange={(e) => setRules({ ...rules, minSpend: parseInt(e.target.value) })}
                    />
                    <div className="flex justify-between text-[7px] font-bold text-gray-500 uppercase tracking-tighter">
                      <span>₹0</span>
                      <span>₹100k+</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Visits Rule Card */}
              <div className={`p-4 rounded-[22px] border transition-all duration-300 ${activeRules.visits ? 'border-rose-200 bg-rose-50/10 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${activeRules.visits ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-gray-100 text-gray-400'}`}>
                      <Calendar size={15} />
                    </div>
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest block ${activeRules.visits ? 'text-gray-900' : 'text-gray-400'}`}>Visit Frequency</span>
                      <p className="text-[7px] font-bold text-gray-900 uppercase tracking-tight">Check-ins count</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveRules({ ...activeRules, visits: !activeRules.visits })}
                    className={`h-5 w-9 rounded-full transition-all duration-300 relative ${activeRules.visits ? 'bg-rose-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${activeRules.visits ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                {activeRules.visits && (
                  <div className="space-y-3 animate-in slide-in-from-top-1 duration-200 px-0.5">
                    <div className="flex justify-between items-end">
                      <p className="text-[9px] font-bold text-gray-900 uppercase tracking-wide">Min. Visits</p>
                      <p className="text-xl font-black text-rose-500 tracking-tight">{rules.minVisits} <span className="text-[10px] text-rose-400 uppercase font-bold ml-0.5">Times</span></p>
                    </div>
                    <input
                      type="range" min="0" max="50" step="1"
                      className="w-full accent-rose-500 h-1 bg-rose-100/50 rounded-lg cursor-pointer appearance-none"
                      value={rules.minVisits}
                      onChange={(e) => setRules({ ...rules, minVisits: parseInt(e.target.value) })}
                    />
                    <div className="flex justify-between text-[7px] font-bold text-gray-500 uppercase tracking-tighter">
                      <span>0</span>
                      <span>50+</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recency Rule Card */}
              <div className={`p-4 rounded-[22px] border transition-all duration-300 ${activeRules.recency ? 'border-rose-200 bg-rose-50/10 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${activeRules.recency ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-gray-100 text-gray-400'}`}>
                      <AlertCircle size={15} />
                    </div>
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest block ${activeRules.recency ? 'text-gray-900' : 'text-gray-400'}`}>Retention Gap</span>
                      <p className="text-[7px] font-bold text-gray-900 uppercase tracking-tight">Days since visit</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveRules({ ...activeRules, recency: !activeRules.recency })}
                    className={`h-5 w-9 rounded-full transition-all duration-300 relative ${activeRules.recency ? 'bg-rose-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${activeRules.recency ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                {activeRules.recency && (
                  <div className="space-y-3 animate-in slide-in-from-top-1 duration-200 px-0.5">
                    <div className="flex justify-between items-end">
                      <p className="text-[9px] font-bold text-gray-900 uppercase tracking-wide">Inactive for</p>
                      <p className="text-xl font-black text-rose-600 tracking-tight">{rules.lastCheckInDays} <span className="text-[10px] text-rose-400 uppercase font-bold ml-0.5">Days</span></p>
                    </div>
                    <div className="flex gap-2">
                      {[30, 60, 90, 180].map(d => (
                        <button
                          key={d}
                          onClick={() => setRules({ ...rules, lastCheckInDays: d })}
                          className={`flex-1 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${rules.lastCheckInDays === d ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-white border border-gray-100 text-gray-400 hover:border-rose-200 hover:text-rose-400'}`}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Summary & Reach */}
      <div className="w-full md:w-72 bg-gray-50/50 p-6 flex flex-col justify-between border-l border-gray-100">
        <div className="space-y-8">
          <div className="text-center py-2">
            <div className="h-16 w-16 bg-rose-50 rounded-[25px] flex items-center justify-center mx-auto mb-4 border-2 border-rose-100 relative">
              <Users size={28} className="text-rose-500" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse"></div>
            </div>
            <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-1">Projected Reach</p>
            <h4 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-1.5">{matchingCount}</h4>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 rounded-full border border-rose-100/50">
              <span className="text-[8px] font-bold text-rose-500 uppercase tracking-tight">Active Reach</span>
            </div>
          </div>

          <div className="space-y-4 px-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></div>
                <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Base Match</p>
              </div>
              <span className="text-[10px] font-black text-rose-500">{((matchingCount / (customers.length || 1)) * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-white rounded-full overflow-hidden border border-gray-100/50">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${(matchingCount / (customers.length || 1)) * 100}%` }}
              ></div>
            </div>
            <p className="text-[9px] font-bold text-gray-500 italic text-center leading-relaxed">
              Targeting {((matchingCount / (customers.length || 1)) * 100).toFixed(0)}% of clients.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-10">
          <button
            disabled={!name || (!activeRules.spend && !activeRules.visits && !activeRules.recency)}
            onClick={() => onSave({
              id: Math.random().toString(36).substr(2, 9),
              name,
              criteria: [
                activeRules.spend ? `Spent > ₹${rules.minSpend?.toLocaleString()}` : null,
                activeRules.visits ? `Visits > ${rules.minVisits}` : null,
                activeRules.recency ? `Inactive > ${rules.lastCheckInDays}d` : null
              ].filter(Boolean).join(' • ') || 'Custom Filter',
              memberCount: matchingCount,
              rules: {
                minSpend: activeRules.spend ? rules.minSpend : undefined,
                minVisits: activeRules.visits ? rules.minVisits : undefined,
                lastCheckInDays: activeRules.recency ? rules.lastCheckInDays : undefined,
              }
            })}
            className="w-full py-3.5 bg-gray-900 text-white rounded-[30px] font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.98] group"
          >
            Create Segment <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};



const NotifyPanelContent = ({ recipients, onClose }: any) => {
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<'SMS' | 'EMAIL'>('SMS');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-4">
        <div className="h-10 w-10 bg-rose-500 rounded-xl flex items-center justify-center text-white">
          <Users size={20} />
        </div>
        <div>
          <p className="text-xs font-black text-gray-900 uppercase">Targeting {recipients.length} Clients</p>
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-0.5">Direct Broadcast</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Choose Channel</label>
        <div className="flex bg-[#f5f6fa] p-1 gap-1">
          {(['SMS', 'EMAIL'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={`flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest transition-all ${channel === c ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Your Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={6}
          className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none resize-none placeholder:text-gray-300"
        />
        <div className="flex justify-between px-1">
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{message.length} Characters</p>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">1 Segment (SMS)</p>
        </div>
      </div>

      <button
        onClick={handleSend}
        disabled={!message || isSending}
        className="w-full py-3.5 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {isSending ? (
          <>
            <RefreshCcw size={14} className="animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Bell size={14} /> Post Announcement
          </>
        )}
      </button>
    </div>
  );
};

export default Customers;
