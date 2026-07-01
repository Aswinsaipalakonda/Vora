
import React, { useState, useEffect, useMemo } from 'react';
import {
  Gift,
  Zap,
  Crown,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Plus,
  Search,
  Grid,
  List,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  History,
  AlertCircle,
  MoreVertical,
  Calendar,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidePanel } from '../components/SidePanel';
import { usePlan } from '../components/PlanContext';

const API_PACKAGES_URL = 'http://127.0.0.1:8000/api/packages/packages';
const API_SUBSCRIPTIONS_URL = 'http://127.0.0.1:8000/api/packages/subscriptions';

const ICON_MAP: { [key: string]: any } = {
  'Zap': Zap,
  'Crown': Crown,
  'Sparkles': Sparkles,
  'TrendingUp': TrendingUp,
  'Users': Users,
  'CreditCard': CreditCard,
  'Gift': Gift
};

const COLOR_OPTIONS = [
  { label: 'Amber', color: 'bg-amber-400', hex: '#fbbf24' },
  { label: 'Rose', color: 'bg-rose-500', hex: '#f43f5e' },
  { label: 'Emerald', color: 'bg-emerald-500', hex: '#10b981' },
  { label: 'Blue', color: 'bg-blue-500', hex: '#3b82f6' },
  { label: 'Purple', color: 'bg-purple-500', hex: '#a855f7' },
  { label: 'Slate', color: 'bg-gray-900', hex: '#0f172a' },
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
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${isNegative
          ? 'bg-rose-500/20 text-rose-200 border-rose-500/20'
          : 'bg-emerald-500/10 text-emerald-400 border-white/5'
          } border`}>
          {isNegative ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isNegative ? 'text-rose-200/70' : 'text-gray-400'}`}>{label}</p>
        <p className="text-2xl font-black text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
};

const INITIAL_FORM = {
  name: '',
  price: '',
  validity_days: '',
  services: [] as string[],
  icon_name: 'Zap',
  color: 'bg-amber-400',
  is_popular: false,
};

const Packages: React.FC = () => {
  const navigate = useNavigate();
  const { checkPermission } = usePlan();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [serviceInput, setServiceInput] = useState('');

  // Data
  const [packages, setPackages] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const fetchPackageData = async () => {
    const token = localStorage.getItem('vora_token');
    if (!token) { navigate('/login'); return; }

    setIsLoading(true);
    try {
      const [pkgsRes, subsRes] = await Promise.all([
        fetch(`${API_PACKAGES_URL}/`, { headers: { 'Authorization': `Token ${token}` } }),
        fetch(`${API_SUBSCRIPTIONS_URL}/`, { headers: { 'Authorization': `Token ${token}` } })
      ]);
      if (pkgsRes.ok) setPackages(await pkgsRes.json());
      if (subsRes.ok) setSubscriptions(await subsRes.json());
    } catch (error) {
      console.error('Error fetching package data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPackageData(); }, []);

  const handleCreatePackage = async () => {
    const token = localStorage.getItem('vora_token');
    if (!token || !formData.name || !formData.price || !formData.validity_days) return;
    setIsCreating(true);
    try {
      const res = await fetch(`${API_PACKAGES_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          validity_days: parseInt(formData.validity_days),
        })
      });
      if (res.ok) {
        setIsCreateOpen(false);
        setFormData(INITIAL_FORM);
        setServiceInput('');
        fetchPackageData();
      }
    } catch (error) {
      console.error('Error creating package:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const addService = () => {
    const trimmed = serviceInput.trim();
    if (trimmed && !formData.services.includes(trimmed)) {
      setFormData({ ...formData, services: [...formData.services, trimmed] });
    }
    setServiceInput('');
  };

  const removeService = (svc: string) => {
    setFormData({ ...formData, services: formData.services.filter(s => s !== svc) });
  };

  const filteredPackages = useMemo(() =>
    packages.filter(pkg =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.services.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [searchQuery, packages]);

  const metrics = useMemo(() => {
    const activeCount = subscriptions.filter(s => s.status === 'Active').length;
    const totalRev = subscriptions.reduce((acc, s) => {
      const pkg = packages.find(p => p.id === s.package);
      return acc + (pkg ? Number(pkg.price) : 0);
    }, 0);
    const expiringSoon = subscriptions.filter(s => {
      const expiry = new Date(s.expiry_date);
      const diff = (expiry.getTime() - new Date().getTime()) / (1000 * 3600 * 24);
      return diff >= 0 && diff <= 7;
    }).length;
    return {
      active: activeCount,
      revenue: `₹${totalRev.toLocaleString()}`,
      activations: subscriptions.filter(s => {
        const purchase = new Date(s.purchase_date);
        return purchase.getMonth() === new Date().getMonth();
      }).length,
      expiring: expiringSoon
    };
  }, [packages, subscriptions]);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-700 w-full">
      {/* Header */}
      <div className="flex items-end justify-between px-2 pt-0 pb-4 shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Service Packages</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bundle premium services for exceptional client loyalty</p>
        </div>
        <button
          onClick={() => checkPermission('packages') && setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-rose-500 text-white px-6 py-2.5 rounded-[30px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-100"
        >
          <Plus size={14} /> New Package
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <MetricHighlight label="Total Active" value={metrics.active} trend="+12%" icon={Users} />
        <MetricHighlight label="Total Revenue" value={metrics.revenue} trend="+18.5%" icon={CreditCard} />
        <MetricHighlight label="New Activations" value={metrics.activations} trend="+5%" icon={History} />
        <MetricHighlight label="Expiring Soon" value={metrics.expiring} trend="-3.2%" icon={AlertCircle} />
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between pt-6 shrink-0">
        <div className="relative group w-full md:w-96">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Search packages by name or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white border border-gray-100 rounded-[30px] pl-14 pr-6 text-xs font-bold shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-gray-300 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0 pb-2 md:pb-0">
          <button className="flex items-center gap-2 px-5 h-10 bg-white border border-gray-100 rounded-[30px] text-[10px] font-black uppercase tracking-widest text-gray-700 whitespace-nowrap hover:bg-gray-50 transition-colors shadow-sm">
            <Calendar size={14} /> This Month
          </button>
          <div className="flex bg-white border border-gray-100 p-1 rounded-[30px] gap-1 h-10 items-center shadow-sm">
            <button onClick={() => setViewMode('grid')} className={`px-3 h-full rounded-full transition-all ${viewMode === 'grid' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>
              <Grid size={14} />
            </button>
            <button onClick={() => setViewMode('list')} className={`px-3 h-full rounded-full transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Create New */}
            <div
              onClick={() => checkPermission('packages') && setIsCreateOpen(true)}
              className="bg-white/50 rounded-[30px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-5 text-center group cursor-pointer hover:border-rose-300 hover:bg-white transition-all duration-300 min-h-[300px]"
            >
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:text-rose-500 transition-all mb-4 border border-gray-100 shadow-sm group-hover:scale-110">
                <Plus size={24} />
              </div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">New Bundle</h3>
              <p className="text-[9px] font-bold text-gray-400 mt-1 max-w-[140px] leading-relaxed">Design custom package.</p>
            </div>

            {filteredPackages.map((pkg) => {
              const Icon = ICON_MAP[pkg.icon_name] || Zap;
              const pkgSubs = subscriptions.filter(s => s.package === pkg.id);
              const revenue = pkgSubs.length * Number(pkg.price);
              return (
                <div key={pkg.id} className={`group relative flex flex-col bg-white rounded-[30px] p-6 border border-gray-100 shadow-sm hover:border-gray-200 transition-all duration-300 overflow-hidden h-full ${pkg.is_popular ? 'border-rose-100' : ''}`}>
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${pkg.color.replace('bg-', 'from-').replace('500', '400')} to-gray-100 opacity-10 rounded-bl-[50px] transition-transform group-hover:scale-150 duration-500`}></div>
                  {pkg.is_popular && (
                    <div className="absolute top-0 right-0 z-20">
                      <div className="bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-lg">Popular</div>
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className={`h-12 w-12 rounded-2xl ${pkg.color} bg-opacity-10 flex items-center justify-center ${pkg.color.replace('bg-', 'text-')} transition-transform duration-500 shadow-sm border border-gray-100`}>
                      <Icon size={20} />
                    </div>
                    <button className="h-8 w-8 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-300 hover:text-gray-900 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2 line-clamp-1">{pkg.name}</h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-gray-900">₹{Number(pkg.price).toLocaleString()}</span>
                      <span className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">/ {pkg.validity_days} Days</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3 mb-8">
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-2">Includes</p>
                    {pkg.services.slice(0, 3).map((service: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 size={8} className="text-emerald-500" strokeWidth={3} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 truncate">{service}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-6 border-t border-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Active</p>
                        <p className="text-xs font-black text-gray-900">{pkgSubs.filter(s => s.status === 'Active').length} Users</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Revenue</p>
                        <p className="text-xs font-black text-emerald-600">₹{revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <button className={`w-full py-3 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${pkg.is_popular ? 'bg-rose-500 text-white shadow-rose-100 hover:bg-rose-600' : 'bg-gray-900 text-white shadow-gray-100 hover:bg-black'}`}>
                      Activate <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Package Name</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Services</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Price</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Active Users</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPackages.map((pkg) => {
                    const Icon = ICON_MAP[pkg.icon_name] || Zap;
                    const activeCount = subscriptions.filter(s => s.package === pkg.id && s.status === 'Active').length;
                    return (
                      <tr key={pkg.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-xl ${pkg.color} flex items-center justify-center text-white`}>
                              <Icon size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-gray-900 truncate">{pkg.name}</p>
                              <p className="text-[10px] font-bold text-gray-400">{pkg.validity_days} Days Validity</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              {pkg.services.map((_: any, i: number) => (
                                <div key={i} className="h-6 w-6 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0">
                                  <CheckCircle2 size={10} className="text-emerald-500" />
                                </div>
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{pkg.services.length} Services</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-gray-900 whitespace-nowrap">₹{Number(pkg.price).toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-gray-900 w-6">{activeCount}</span>
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                              <div className="h-full bg-emerald-500" style={{ width: `${Math.min(activeCount * 10, 100)}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900">
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Package SidePanel */}
      <SidePanel
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); setFormData(INITIAL_FORM); setServiceInput(''); }}
        title="New Package"
        subtitle="Bundle services into a custom plan"
        width="max-w-[520px]"
        footer={
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setIsCreateOpen(false); setFormData(INITIAL_FORM); setServiceInput(''); }}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePackage}
              disabled={isCreating || !formData.name || !formData.price || !formData.validity_days}
              className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Package'}
            </button>
          </div>
        }
      >
        <div className="space-y-6">

          {/* Basic Info */}
          <div className="space-y-4">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Package Details</p>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Package Name</label>
              <input
                type="text"
                placeholder="e.g. Glow & Radiance Bundle"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
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
                  className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Validity (Days)</label>
                <input
                  type="number"
                  placeholder="e.g. 90"
                  value={formData.validity_days}
                  onChange={(e) => setFormData({ ...formData, validity_days: e.target.value })}
                  className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-50" />

          {/* Services */}
          <div className="space-y-4">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Services Included</p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a service and press Enter..."
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addService(); } }}
                className="flex-1 bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
              />
              <button
                onClick={addService}
                className="px-4 py-3 bg-gray-900 text-white text-xs font-black hover:bg-black transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {formData.services.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.services.map((svc, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#f5f6fa] px-3 py-1.5">
                    <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                    <span className="text-[10px] font-bold text-gray-700">{svc}</span>
                    <button onClick={() => removeService(svc)} className="text-gray-300 hover:text-rose-500 transition-colors">
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[9px] font-bold text-gray-300 italic">No services added yet</p>
            )}
          </div>

          <div className="h-px bg-gray-50" />

          {/* Icon */}
          <div className="space-y-3">
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

          <div className="h-px bg-gray-50" />

          {/* Color */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Color Theme</p>
            <div className="flex gap-3 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.color}
                  onClick={() => setFormData({ ...formData, color: c.color })}
                  className={`w-8 h-8 ${c.color} transition-all ${formData.color === c.color ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'opacity-60 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-50" />

          {/* Popular toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Mark as Popular</p>
              <p className="text-[9px] font-bold text-gray-400 mt-0.5">Highlights this package with a badge</p>
            </div>
            <button
              onClick={() => setFormData({ ...formData, is_popular: !formData.is_popular })}
              className={`h-5 w-9 rounded-full transition-all duration-300 relative shrink-0 ${formData.is_popular ? 'bg-rose-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${formData.is_popular ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

        </div>
      </SidePanel>
    </div>
  );
};

export default Packages;
