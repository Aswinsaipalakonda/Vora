import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  ChevronRight,
  MoreVertical,
  Plus,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Trash2,
  Box,
  Layers,
  Blocks,
  RefreshCcw,
  Check,
  CalendarDays,
  Printer,
  Save,
  Calculator,
  MoreHorizontal,
  DollarSign,
  TrendingUp,
  CreditCard,
  ReceiptText,
  ArrowRight,
  Zap,
  SlidersHorizontal,
  User,
  Phone,
  X,
  AlertTriangle,
  MessageSquare,
  Mail,
  Star,
  MessageCircle,
  UserPlus,
  UserCheck,
  QrCode,
  Smartphone
} from 'lucide-react';
import { SidePanel } from '../components/SidePanel';
import { InvoiceItem } from '../types';

interface DraftInvoice {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerGender: 'Male' | 'Female' | 'Others';
  items: InvoiceItem[];
  staffId?: string;
  staffName?: string;
  status: 'Due' | 'Paid' | 'Pending' | 'Draft';
  discountAmount: number;
  date: string;
  startTime: string; // ISO timestamp when walk-in session was created
}

import { GST_RATE } from '../constants';
import { useNavigate } from 'react-router-dom';

const API_BILLING_URL = 'http://127.0.0.1:8000/api/billing';
const API_CUSTOMERS_URL = 'http://127.0.0.1:8000/api/customers';
const API_INVENTORY_URL = 'http://127.0.0.1:8000/api/inventory';
const API_TENANT_URL = 'http://127.0.0.1:8000/api/tenant';
const API_APPOINTMENTS_URL = 'http://127.0.0.1:8000/api/appointments';
const API_PACKAGES_URL = 'http://127.0.0.1:8000/api/packages';

// Live elapsed timer — turns red when session exceeds 45 minutes
const ElapsedTimer: React.FC<{ startTime: string }> = ({ startTime }) => {
  const [elapsed, setElapsed] = React.useState('');
  const [isLong, setIsLong] = React.useState(false);

  React.useEffect(() => {
    const update = () => {
      const diffMs = Date.now() - new Date(startTime).getTime();
      if (diffMs < 0) { setElapsed('0s'); return; }
      const totalSecs = Math.floor(diffMs / 1000);
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;
      setIsLong(hrs >= 1 || mins >= 45);
      if (hrs > 0) setElapsed(`${hrs}h ${mins}m ${secs}s`);
      else if (mins > 0) setElapsed(`${mins}m ${secs}s`);
      else setElapsed(`${secs}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tabular-nums ${isLong ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLong ? 'bg-rose-500' : 'bg-emerald-500'}`} />
      {elapsed}
    </div>
  );
};

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'dashboard' | 'invoices' | 'active-pos' | 'new-invoice'>('dashboard');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientName, setClientName] = useState('');

  // Drawer/Selection sheet state
  const [drawerType, setDrawerType] = useState<'service' | 'product' | 'package' | 'bulk' | null>(null);
  const [drawerSearch, setDrawerSearch] = useState('');

  const addItem = (description = '', unitPrice = 0) => {
    if (!currentDraft) return;
    const newItems = [...currentDraft.items, {
      id: Date.now().toString(),
      description,
      quantity: 1,
      unitPrice,
      originalPrice: unitPrice,
      gstRate: GST_RATE
    }];
    updateCurrentDraft({ items: newItems });
  };

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    if (!currentDraft) return;
    const newItems = currentDraft.items.map(i => i.id === id ? { ...i, ...updates } : i);
    updateCurrentDraft({ items: newItems });
  };

  const removeItem = (id: string) => {
    if (!currentDraft) return;
    const newItems = currentDraft.items.filter(i => i.id !== id);
    updateCurrentDraft({ items: newItems });
  };
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Month'>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // New Invoice State (POS)
  const [sendSMS, setSendSMS] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendReview, setSendReview] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  // Drafts State
  const [activeDrafts, setActiveDrafts] = useState<DraftInvoice[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [newWalkIn, setNewWalkIn] = useState<{ name: string, phone: string, email: string, gender: 'Male' | 'Female' | 'Other', staffId: string, staffName: string }>({
    name: '', phone: '', email: '', gender: 'Male', staffId: '', staffName: ''
  });

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<any>({});

  const fetchBillingData = async () => {
    const token = localStorage.getItem('vora_token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const [invRes, custRes] = await Promise.all([
        fetch(`${API_BILLING_URL}/invoices/`, { headers: { 'Authorization': `Token ${token}` } }),
        fetch(`${API_CUSTOMERS_URL}/customers/`, { headers: { 'Authorization': `Token ${token}` } })
      ]);

      if (invRes.ok) {
        const data = await invRes.json();
        setInvoices(data);

        const draftInvoices = data.filter((inv: any) => inv.status === 'DRAFT');
        const formattedDrafts: DraftInvoice[] = draftInvoices.map((inv: any) => ({
          id: inv.id.toString(),
          customerName: inv.customer_name || 'Walk-In Customer',
          customerPhone: inv.customer_phone || '',
          customerGender: (inv.customer_gender?.charAt(0).toUpperCase() + inv.customer_gender?.slice(1).toLowerCase()) as any || 'Male',
          items: inv.items ? inv.items.map((item: any) => ({
            id: item.id.toString(),
            description: item.description,
            quantity: item.quantity,
            unitPrice: Number(item.unit_price),
            originalPrice: Number(item.original_price || item.unit_price),
            gstRate: Number(item.gst_rate)
          })) : [],
          status: 'Draft',
          staffId: inv.staff_id?.toString(),
          staffName: inv.staff_name,
          discountAmount: Number(inv.discount_amount || 0),
          date: inv.date || inv.created_at || new Date().toISOString().split('T')[0],
          startTime: inv.service_start_time || inv.created_at || new Date().toISOString()
        }));

        // Sort drafts by ID desc (most recent first)
        const sortedDrafts = formattedDrafts.sort((a, b) => Number(b.id) - Number(a.id));
        setActiveDrafts(sortedDrafts);
      }
      if (custRes.ok) setCustomers(await custRes.json());

      const [invInventoryRes, tenantRes] = await Promise.all([
        fetch(`${API_INVENTORY_URL}/products/`, { headers: { 'Authorization': `Token ${token}` } }),
        fetch(`${API_TENANT_URL}/tenants/me/`, { headers: { 'Authorization': `Token ${token}` } })
      ]);

      if (invInventoryRes.ok) setProducts(await invInventoryRes.json());
      if (tenantRes.ok) setTenantInfo(await tenantRes.json());

      const [servicesRes, categoriesRes, packagesRes, staffRes] = await Promise.all([
        fetch(`${API_APPOINTMENTS_URL}/services/`, { headers: { 'Authorization': `Token ${token}` } }),
        fetch(`${API_APPOINTMENTS_URL}/service-categories/`, { headers: { 'Authorization': `Token ${token}` } }),
        fetch(`${API_PACKAGES_URL}/packages/`, { headers: { 'Authorization': `Token ${token}` } }),
        fetch(`http://127.0.0.1:8000/api/experience/staff/`, { headers: { 'Authorization': `Token ${token}` } }),
      ]);
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (categoriesRes.ok) setServiceCategories(await categoriesRes.json());
      if (packagesRes.ok) setPackages(await packagesRes.json());
      if (staffRes.ok) setStaffMembers(await staffRes.json());
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBillingData();
  }, []);

  const currentDraft = useMemo(() => activeDrafts.find(d => d.id === currentDraftId) || null, [activeDrafts, currentDraftId]);

  const updateCurrentDraft = (updates: Partial<DraftInvoice>) => {
    if (!currentDraftId) return;
    setActiveDrafts(drafts => drafts.map(d => d.id === currentDraftId ? { ...d, ...updates } : d));
  };

  const [isWhatsAppSending, setIsWhatsAppSending] = useState(false);

  const handleCreateInvoice = async (isWhatsApp = false) => {
    const token = localStorage.getItem('vora_token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!currentDraft) return;

    if (!currentDraft.customerName || !currentDraft.customerPhone || currentDraft.items.length === 0) {
      setErrors({ submit: 'Customer name, phone and at least one item are required.' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      let selectedCustomerId: number | null = null;

      // 1. Try to find existing customer by phone or name
      const existingCustomer = customers.find(c =>
        c.phone === currentDraft.customerPhone || c.name.toLowerCase() === currentDraft.customerName.toLowerCase()
      );

      if (existingCustomer) {
        selectedCustomerId = existingCustomer.id;
      } else {
        // 2. Create new customer if not found
        const custResponse = await fetch(`${API_CUSTOMERS_URL}/customers/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
          body: JSON.stringify({
            name: currentDraft.customerName,
            phone: currentDraft.customerPhone,
            gender: currentDraft.customerGender.toUpperCase()
          })
        });

        if (custResponse.ok) {
          const newCustomer = await custResponse.json();
          selectedCustomerId = newCustomer.id;
        } else {
          const errData = await custResponse.json();
          setErrors({ customer: 'Failed to create new customer.', ...errData });
          setIsLoading(false);
          return;
        }
      }

      // 3. Create invoice
      const payload = {
        customer: selectedCustomerId,
        status: currentDraft.status.toUpperCase(),
        payment_method: 'UPI',
        discount_amount: currentDraft.discountAmount,
        staff_id: currentDraft.staffId,
        items: currentDraft.items.map(i => ({
          description: i.description,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          original_price: i.originalPrice,
          gst_rate: i.gstRate
        }))
      };

      const url = currentDraft.id ? `${API_BILLING_URL}/invoices/${currentDraft.id}/` : `${API_BILLING_URL}/invoices/`;
      const method = currentDraft.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedInvoice = await response.json();
        if (currentDraft.status.toUpperCase() !== 'DRAFT' && !isWhatsApp) {
          setViewMode('invoices');
          setActiveDrafts(prev => prev.filter(d => d.id !== currentDraft.id));
          setCurrentDraftId(null);
        }
        fetchBillingData();
        return savedInvoice;
      } else {
        const errData = await response.json();
        setErrors(errData);
      }
    } catch (error) {
      console.error('Invoice creation error:', error);
      setErrors({ submit: 'Failed to create invoice.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateWhatsApp = async () => {
    const token = localStorage.getItem('vora_token');
    if (!token) return;

    if (!currentDraft) return;

    // First save the invoice
    const savedInvoice = await handleCreateInvoice(true);
    if (!savedInvoice) return;

    setIsWhatsAppSending(true);
    try {
      const response = await fetch(`${API_BILLING_URL}/invoices/${savedInvoice.id}/whatsapp/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.ok) {
        alert('Invoice sent successfully via WhatsApp!');
        // After sending, clean up the POS if it wasn't a draft
        if (currentDraft.status.toUpperCase() !== 'DRAFT') {
          setViewMode('invoices');
          setActiveDrafts(prev => prev.filter(d => d.id !== currentDraft.id));
          setCurrentDraftId(null);
        }
      } else {
        const errData = await response.json();
        alert(`Failed to send WhatsApp: ${errData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('WhatsApp sending error:', error);
      alert('Error sending WhatsApp notification.');
    } finally {
      setIsWhatsAppSending(false);
    }
  };

  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const filteredCustomerResults = useMemo(() => {
    if (!customerSearchQuery) return [];
    return customers.filter(c =>
      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      c.phone.includes(customerSearchQuery)
    ).slice(0, 6);
  }, [customers, customerSearchQuery]);

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    if (currentDraftId) {
      updateCurrentDraft({
        customerName: customer.name,
        customerPhone: customer.phone,
        customerGender: customer.gender === 'FEMALE' ? 'Female' : customer.gender === 'MALE' ? 'Male' : 'Others'
      });
    }
    setCustomerSearchQuery('');
    setShowCustomerDropdown(false);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    if (currentDraftId) {
      updateCurrentDraft({
        customerName: '',
        customerPhone: '',
        customerGender: 'Male'
      });
    }
    setCustomerSearchQuery('');
  };

  const filteredInvoices = useMemo(() => {
    return invoices.map(inv => ({
      id: inv.invoice_number,
      client: inv.customer_name,
      date: inv.date,
      amount: inv.total_amount,
      status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1).toLowerCase(),
      method: inv.payment_method || '-'
    })).filter(inv => {
      const matchesSearch = inv.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

      let matchesDate = true;
      if (dateFilter === 'Today') {
        const today = new Date().toISOString().split('T')[0];
        matchesDate = inv.date === today;
      } else if (dateFilter === 'Month') {
        const currentMonth = new Date().toISOString().slice(0, 7);
        matchesDate = inv.date.startsWith(currentMonth);
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [invoices, searchQuery, statusFilter, dateFilter]);

  const totals = useMemo(() => {
    if (!currentDraft) return { subtotal: 0, gstTotal: 0, discount: 0, total: 0 };
    const subtotal = currentDraft.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const gstTotal = currentDraft.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.gstRate / 100)), 0);
    const discount = currentDraft.discountAmount || 0;
    return {
      subtotal,
      gstTotal,
      discount,
      total: (subtotal + gstTotal) - discount
    };
  }, [currentDraft]);

  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonthStr = now.toISOString().slice(0, 7); // YYYY-MM
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthStr = prevMonth.toISOString().slice(0, 7);

    const currentMonthInvoices = invoices.filter(inv => inv.date.startsWith(currentMonthStr));
    const prevMonthInvoices = invoices.filter(inv => inv.date.startsWith(prevMonthStr));

    const currentMonthlyRevenue = currentMonthInvoices.reduce((acc, inv) => acc + (Number(inv.total_amount) || 0), 0);
    const prevMonthlyRevenue = prevMonthInvoices.reduce((acc, inv) => acc + (Number(inv.total_amount) || 0), 0);

    const outstanding = invoices
      .filter(inv => inv.status !== 'PAID')
      .reduce((acc, inv) => acc + (Number(inv.total_amount) || 0), 0);

    const growth = prevMonthlyRevenue > 0
      ? ((currentMonthlyRevenue - prevMonthlyRevenue) / prevMonthlyRevenue) * 100
      : 0;

    return {
      monthlyRevenue: currentMonthlyRevenue,
      outstanding,
      growth: growth.toFixed(1),
      totalInvoices: invoices.length,
      revenueTrend: growth >= 0 ? `+${growth.toFixed(0)}%` : `${growth.toFixed(0)}%`
    };
  }, [invoices]);

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

  return (
    <div className={`w-full animate-in fade-in duration-700 ${viewMode === 'new-invoice' ? 'h-[calc(100vh-80px)] flex flex-col overflow-hidden' : 'p-10 max-w-[1600px] mx-auto space-y-8'}`}>
      {viewMode !== 'new-invoice' && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Billing & Finance</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage invoices, payments and financial growth</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-100 p-1 rounded-[30px] flex items-center gap-1 h-10 shadow-sm">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-8 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'dashboard'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-900'
                  }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('invoices')}
                className={`px-8 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'invoices'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-900'
                  }`}
              >
                Invoices
              </button>
              <button
                onClick={() => { setViewMode('active-pos'); setCurrentDraftId(null); }}
                className={`px-8 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'active-pos'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-900'
                  }`}
              >
                <div className="flex items-center gap-2">
                  Active POS
                  {activeDrafts.length > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] ${viewMode === 'active-pos' ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{activeDrafts.length}</span>
                  )}
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowWalkInModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-[30px] font-black uppercase tracking-widest text-[10px] transition-all shadow-xl bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600"
            >
              <Plus size={14} />
              New Walk-In
            </button>
          </div>
        </div>
      )}


      {viewMode === 'active-pos' && (
        <div className="space-y-6 animate-in fade-in duration-500">

          {activeDrafts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-100 rounded-[30px] p-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone size={24} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">No Active POS Sessions</h3>
              <p className="text-xs font-bold text-gray-400 mb-8 max-w-sm">When a client walks in, create a new session here to assign a staff member and track their services.</p>
              <button onClick={() => setShowWalkInModal(true)} className="px-8 py-3 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-100 flex items-center gap-2">
                <Plus size={14} /> Start New Walk-In
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeDrafts.map(draft => (
                <div key={draft.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-all flex flex-col group relative overflow-hidden">
                  {/* Row 1: customer avatar + name */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 font-black shrink-0">
                      {draft.customerName ? draft.customerName.charAt(0) : '?'}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 truncate max-w-[160px]">{draft.customerName || 'Walk-In Customer'}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{draft.items.length} Items Selected</p>
                    </div>
                  </div>

                  {/* Row 2: start time + live timer */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-[10px] font-black text-gray-600 tabular-nums">
                      {new Date(draft.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                    <ElapsedTimer startTime={draft.startTime} />
                  </div>

                  <div className="space-y-3 flex-1">
                    {/* Assigned staff — bare, no bg */}
                    <div className="flex items-center gap-1.5">
                      <User size={10} className="text-gray-400" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Assigned</span>
                      <span className="text-[10px] font-black text-indigo-600 ml-auto">{draft.staffName || 'Pending'}</span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xl font-black text-gray-900 tracking-tight">₹{draft.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => { setCurrentDraftId(draft.id); setViewMode('new-invoice'); }}
                    className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center"
                  >
                    Resume POS
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricHighlight
              label="Monthly Revenue"
              value={`₹${metrics.monthlyRevenue.toLocaleString()}`}
              trend={metrics.revenueTrend}
              icon={DollarSign}
            />
            <MetricHighlight
              label="Outstanding"
              value={`₹${metrics.outstanding.toLocaleString()}`}
              trend={`₹${metrics.outstanding > 10000 ? (metrics.outstanding / 1000).toFixed(1) + 'k' : metrics.outstanding}`}
              icon={ReceiptText}
            />
            <MetricHighlight
              label="Growth"
              value={`${metrics.growth}%`}
              trend={metrics.revenueTrend}
              icon={TrendingUp}
            />
            <MetricHighlight
              label="Total Invoices"
              value={metrics.totalInvoices.toString()}
              trend={`+${invoices.filter(inv => inv.date === new Date().toISOString().split('T')[0]).length}`}
              icon={FileText}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Activity</h3>
                <button onClick={() => setViewMode('invoices')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                  View All Invoices <ArrowRight size={12} />
                </button>
              </div>
              <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {invoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                        <td className="px-6 py-4">
                          <span className="text-xs font-black text-gray-900">#{invoice.invoice_number}</span>
                          <p className="text-[10px] text-gray-400 font-bold">{invoice.date}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-800">{invoice.customer_name}</p>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-gray-900">₹{(Number(invoice.total_amount) || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                            {invoice.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Payment Methods</h3>
              <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 space-y-6">
                {[
                  { label: 'UPI / Online', val: '65%', icon: Zap, color: 'text-indigo-600' },
                  { label: 'Cash', val: '25%', icon: DollarSign, color: 'text-emerald-600' },
                  { label: 'Cards', val: '10%', icon: CreditCard, color: 'text-rose-500' },
                ].map(m => (
                  <div key={m.label} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <m.icon size={12} className={m.color} />
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{m.label}</span>
                      </div>
                      <span className="text-xs font-black text-gray-900">{m.val}</span>
                    </div>
                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                      <div className={`h-full bg-current ${m.color.replace('text-', 'bg-')}`} style={{ width: m.val }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'invoices' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative group w-full md:w-96">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-rose-500' : 'text-gray-300'}`} size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoices, clients..."
                className="w-full h-10 bg-white border border-gray-100 rounded-[30px] pl-14 pr-6 text-xs font-bold shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-2 px-5 h-10 border rounded-[30px] text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${statusFilter !== 'All' || showFilterDropdown || dateFilter !== 'All'
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <SlidersHorizontal size={14} />
                {statusFilter === 'All' && dateFilter === 'All' ? 'Filter' : 'Filtered'}
                <ChevronDown size={12} className={`transition-transform duration-300 ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Status</div>
                  {['All', 'Paid', 'Pending'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as any)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-1 ${statusFilter === status
                        ? 'bg-rose-50 text-rose-600'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {status}
                      {statusFilter === status && <Check size={12} />}
                    </button>
                  ))}

                  <div className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 my-1">Date Range</div>
                  {['All', 'Today', 'Month'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDateFilter(d as any)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-1 ${dateFilter === d
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {d === 'All' ? 'All Time' : d}
                      {dateFilter === d && <Check size={12} />}
                    </button>
                  ))}

                  <div className="mt-2 pt-2 border-t border-gray-50 flex gap-2">
                    <button
                      onClick={() => {
                        setStatusFilter('All');
                        setDateFilter('All');
                        setShowFilterDropdown(false);
                      }}
                      className="flex-1 py-2 text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilterDropdown(false)}
                      className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <button className="flex items-center gap-2 px-5 h-10 bg-white border border-gray-100 text-gray-700 rounded-[30px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice Code</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Issue Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Time</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Net Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Payment Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* Reuse mapping for full list but with more detail */}
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                    <td className="px-8 py-5 font-black text-sm text-gray-900">#{invoice.id}</td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-800">{invoice.client}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-gray-300" />
                        <span className="text-xs font-bold text-gray-600">{invoice.date}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {invoice.service_start_time ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span className="text-[10px] font-bold text-gray-600">
                              {new Date(invoice.service_start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </span>
                          </div>
                          {invoice.service_end_time && (
                            <>
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                                <span className="text-[10px] font-bold text-gray-600">
                                  {new Date(invoice.service_end_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </span>
                              </div>
                              <span className="text-[9px] font-black text-gray-400 block">
                                {(() => {
                                  const diffMs = new Date(invoice.service_end_time).getTime() - new Date(invoice.service_start_time).getTime();
                                  const mins = Math.floor(diffMs / 60000);
                                  const hrs = Math.floor(mins / 60);
                                  return hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
                                })()}
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-[9px] text-gray-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right font-black text-gray-900 tracking-tight">₹{(Number(invoice.amount) || 0).toLocaleString()}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-gray-300 hover:text-gray-900 bg-transparent group-hover:bg-white rounded-xl transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'new-invoice' && currentDraftId && (
        <div className="flex flex-col flex-1 bg-[#f5f7f9] animate-in fade-in duration-500 overflow-hidden relative border-t border-gray-100">
          <div className="flex items-center px-10 py-5 bg-white border-b border-gray-100 justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setViewMode('active-pos')} className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-500 transition-colors">
                <ArrowRight size={16} className="rotate-180" />
              </button>
              <div>
                <h3 className="text-sm font-black text-gray-900 tracking-tight">Active POS Session</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Walk-In Checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">{currentDraft?.staffName || 'No Staff Assigned'}</span>
              {currentDraft?.customerName && <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest">{currentDraft.customerName}</span>}
            </div>
          </div>
          {/* Main Workspace */}
          <div className="flex flex-1 overflow-hidden">
            {/* Center Panel: Items & Totals */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth relative">
              {errors.submit && (
                <div className="mx-10 mt-10 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in slide-in-from-top-4 duration-300">
                  <AlertTriangle size={18} />
                  <p className="text-xs font-black uppercase tracking-widest">{errors.submit}</p>
                </div>
              )}

              <div className="p-10 pb-5 space-y-4">
                {currentDraft?.items.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-100 rounded-lg px-6 py-5 shadow-sm flex items-center justify-between group">
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Service / Product</p>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        placeholder="Manual item name..."
                        className="w-full bg-transparent border-none p-0 text-sm font-black text-gray-900 focus:ring-0 outline-none hover:bg-gray-50 transition-colors rounded px-1"
                      />
                    </div>

                    <div className="flex items-center gap-8">
                      {/* Qty stepper */}
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Qty</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                            className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 font-black text-base transition-colors"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                            className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 font-black text-base transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="w-32">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Unit Price</p>
                        <div className="flex flex-col">
                          {item.unitPrice !== item.originalPrice && (
                            <span className="text-[10px] font-bold text-gray-300 line-through">₹{item.originalPrice.toLocaleString()}</span>
                          )}
                          <div className="flex items-center gap-1 group/price">
                            <span className="text-sm font-black text-gray-400">₹</span>
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                              className="w-full bg-transparent border-none p-0 text-sm font-black text-gray-900 focus:ring-0 outline-none hover:bg-gray-50 transition-colors rounded px-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="text-right w-24">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                        <span className="text-sm font-black text-gray-900">₹{(item.quantity * item.unitPrice).toLocaleString()}</span>
                      </div>

                      <button onClick={() => removeItem(item.id)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {currentDraft?.items.length === 0 && (
                  <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg px-10 py-14 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 bg-gray-100 flex items-center justify-center mb-4">
                      <Plus size={18} className="text-gray-400" />
                    </div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">No items yet</p>
                    <p className="text-[10px] font-medium text-gray-400">Use the bottom toolbar to add services or retail products</p>
                  </div>
                )}
              </div>

              {/* Summary Section — only shown when items exist */}
              {(currentDraft?.items.length ?? 0) > 0 && (
                <div className="flex justify-end pr-20">
                  <div className="w-80 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Sub Total</span>
                      <span className="text-xs font-black text-gray-900">₹{totals.subtotal.toLocaleString()}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between items-center text-rose-500 font-bold py-1">
                        <span className="text-[11px] font-black uppercase tracking-widest">Discount Applied</span>
                        <span className="text-xs font-black">− ₹{totals.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Rounding</span>
                      <span className="text-xs font-black text-gray-900">₹0.00</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Grand Total</span>
                      <span className="text-sm font-black text-gray-900">₹{totals.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Amount Paid</span>
                      <span className="text-sm font-black text-gray-900">₹0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Balance</span>
                      <span className="text-sm font-black text-rose-500">₹{totals.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: Details */}
            <div className="w-96 bg-white border-l border-gray-100 flex flex-col overflow-y-auto">
              {/* Alert Banner */}
              <div className={`${tenantInfo?.sms_credits < 50 ? 'bg-rose-500' : 'bg-emerald-500'} p-6 text-white space-y-2 transition-colors duration-500`}>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Current SMS Credits</p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-black">{tenantInfo?.sms_credits || '...'}</p>
                  {tenantInfo?.sms_credits < 50 && <AlertTriangle size={18} className="animate-pulse" />}
                </div>
                <p className="text-[10px] font-bold leading-relaxed opacity-90">
                  {tenantInfo?.sms_credits < 50
                    ? `Your account only have ${tenantInfo.sms_credits} SMS left. SMSes might not be delivered to your customers. Recharge immediately.`
                    : `You have ${tenantInfo?.sms_credits} credits remaining. Your automated notifications are running smoothly.`
                  }
                </p>
              </div>

              <div className="p-6 space-y-8">
                {/* Invoice Metadata */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between relative">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                    <div className="relative">
                      <button
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className="flex items-center gap-2 group"
                      >
                        <span className={`text-[11px] font-black uppercase tracking-tight ${currentDraft?.status === 'Paid' ? 'text-emerald-600' :
                          currentDraft?.status === 'Pending' ? 'text-amber-600' :
                            currentDraft?.status === 'Due' ? 'text-rose-600' : 'text-gray-600'
                          }`}>
                          {currentDraft?.status || 'Draft'}
                        </span>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showStatusDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-white shadow-2xl rounded-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                          {(['Due', 'Paid', 'Pending', 'Draft'] as const).map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                updateCurrentDraft({ status });
                                setShowStatusDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all ${currentDraft?.status === status ? 'text-rose-600 bg-rose-50/50' : 'text-gray-600'}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice Date</p>
                    <div
                      className="relative flex items-center gap-2 cursor-pointer group"
                      onClick={() => dateInputRef.current?.showPicker()}
                    >
                      <span className="text-[11px] font-black text-gray-900 uppercase">
                        {new Date(currentDraft?.date || new Date().toISOString()).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                      <CalendarDays size={14} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
                      <input
                        ref={dateInputRef}
                        type="date"
                        value={currentDraft?.date || ''}
                        onChange={(e) => updateCurrentDraft({ date: e.target.value })}
                        className="absolute inset-0 opacity-0 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Discount Field */}
                <div className="space-y-2 pb-6 border-b border-gray-50">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">Apply Discount (₹)</label>
                  <div className="relative flex items-center group/discount">
                    <input
                      type="number"
                      placeholder="0"
                      value={currentDraft?.discountAmount || ''}
                      onChange={(e) => updateCurrentDraft({ discountAmount: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-transparent rounded-[14px] px-4 py-3.5 text-xs font-black text-rose-500 focus:bg-white focus:border-rose-100 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Details</p>

                  <div className="space-y-4">
                    {/* Search / Selected Customer */}
                    <div className="space-y-2 relative">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">Search or Name <span className="text-rose-500">*</span></label>

                      {selectedCustomer ? (
                        /* Selected customer chip */
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-[14px] px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                              <User size={13} className="text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-900">{selectedCustomer.name}</p>
                              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Existing Customer</p>
                            </div>
                          </div>
                          <button
                            onClick={handleClearCustomer}
                            className="p-1 text-gray-300 hover:text-rose-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        /* Search input */
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={customerSearchQuery}
                            onChange={(e) => {
                              setCustomerSearchQuery(e.target.value);
                              updateCurrentDraft({ customerName: e.target.value });
                              setShowCustomerDropdown(true);
                            }}
                            onFocus={() => setShowCustomerDropdown(true)}
                            onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 150)}
                            className="w-full bg-gray-50 border border-transparent rounded-[14px] px-4 py-3.5 text-xs font-bold focus:bg-white focus:border-rose-100 transition-all outline-none"
                          />
                          <Search size={14} className="absolute right-4 text-gray-300" />

                          {/* Customer Dropdown */}
                          {showCustomerDropdown && filteredCustomerResults.length > 0 && (
                            <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-100 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                              {filteredCustomerResults.map(c => (
                                <button
                                  key={c.id}
                                  onMouseDown={() => handleSelectCustomer(c)}
                                  className="w-full text-left px-4 py-3.5 hover:bg-rose-50/50 flex items-center justify-between group transition-all border-b border-gray-50 last:border-0"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-all shrink-0">
                                      <User size={13} />
                                    </div>
                                    <div>
                                      <p className="text-xs font-black text-gray-900">{c.name}</p>
                                      <p className="text-[9px] font-bold text-gray-400">{c.phone} · {c.gender}</p>
                                    </div>
                                  </div>
                                  <ChevronRight size={13} className="text-gray-300 group-hover:text-rose-500 transition-transform group-hover:translate-x-0.5" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Phone — read-only if existing customer, editable if new */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">Phone Number <span className="text-rose-500">*</span></label>
                      {selectedCustomer ? (
                        <p className="bg-gray-50 rounded-[14px] px-4 py-3.5 text-xs font-black text-gray-900">{currentDraft?.customerPhone}</p>
                      ) : (
                        <input
                          type="text"
                          placeholder="XXXX XXXX XX"
                          value={currentDraft?.customerPhone || ''}
                          onChange={(e) => updateCurrentDraft({ customerPhone: e.target.value })}
                          className="w-full bg-gray-50 border border-transparent rounded-[14px] px-4 py-3.5 text-xs font-bold focus:bg-white focus:border-rose-100 transition-all outline-none"
                        />
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">Gender <span className="text-rose-500">*</span></label>
                      {selectedCustomer ? (
                        <p className="bg-gray-50 rounded-[14px] px-4 py-3.5 text-xs font-black text-gray-900 uppercase tracking-widest">{currentDraft?.customerGender}</p>
                      ) : (
                        <div className="flex bg-gray-50/50 border border-gray-100/50 p-1 rounded-full gap-1">
                          {(['Male', 'Female', 'Others'] as const).map((gender) => (
                            <button
                              key={gender}
                              onClick={() => updateCurrentDraft({ customerGender: gender })}
                              className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-full transition-all ${currentDraft?.customerGender === gender ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                              {gender}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* SMS & Email Options */}
                <div className="pt-8 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">SMS & Email Options</p>
                  <div className="space-y-4">
                    {/* SMS */}
                    <label className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <MessageSquare size={14} className={`transition-colors ${sendSMS ? 'text-rose-500' : 'text-gray-300 group-hover:text-gray-400'}`} />
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Send SMS</span>
                      </div>
                      <div onClick={() => setSendSMS(!sendSMS)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${sendSMS ? 'bg-rose-500 border-rose-500' : 'bg-white border-gray-200 group-hover:border-rose-400'}`}>
                        {sendSMS && <Check size={12} className="text-white" strokeWidth={4} />}
                      </div>
                    </label>

                    {/* Email */}
                    <label className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Mail size={14} className={`transition-colors ${sendEmail ? 'text-rose-500' : 'text-gray-300 group-hover:text-gray-400'}`} />
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Send Email</span>
                      </div>
                      <div onClick={() => setSendEmail(!sendEmail)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${sendEmail ? 'bg-rose-500 border-rose-500' : 'bg-white border-gray-200 group-hover:border-rose-400'}`}>
                        {sendEmail && <Check size={12} className="text-white" strokeWidth={4} />}
                      </div>
                    </label>

                    {/* Review */}
                    <label className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Star size={14} className={`transition-colors ${sendReview ? 'text-rose-500' : 'text-gray-300 group-hover:text-gray-400'}`} />
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Send Review Invite</span>
                      </div>
                      <div onClick={() => setSendReview(!sendReview)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${sendReview ? 'bg-rose-500 border-rose-500' : 'bg-white border-gray-200 group-hover:border-rose-400'}`}>
                        {sendReview && <Check size={12} className="text-white" strokeWidth={4} />}
                      </div>
                    </label>

                    {/* WhatsApp */}
                    <label className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <MessageCircle size={14} className={`transition-colors ${sendWhatsApp ? 'text-[#25d366]' : 'text-gray-300 group-hover:text-gray-400'}`} />
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Send WhatsApp</span>
                      </div>
                      <div onClick={() => setSendWhatsApp(!sendWhatsApp)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${sendWhatsApp ? 'bg-[#25d366] border-[#25d366]' : 'bg-white border-gray-200 group-hover:border-[#25d366]'}`}>
                        {sendWhatsApp && <Check size={12} className="text-white" strokeWidth={4} />}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Toolbar */}
          <div className="h-20 bg-white border-t border-gray-100 flex items-center justify-between px-10 z-20 relative">
            <div className={`flex items-center gap-6 ${currentDraftId ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              {([
                { type: 'service', label: 'Service', icon: <Plus size={14} />, color: 'hover:text-rose-600' },
                { type: 'product', label: 'Product', icon: <Box size={14} />, color: 'hover:text-emerald-600' },
                { type: 'package', label: 'Package', icon: <Layers size={14} />, color: 'hover:text-amber-600' },
                { type: 'bulk', label: 'Bulk Items', icon: <Blocks size={14} />, color: 'hover:text-rose-600' },
              ] as const).map(({ type, label, icon, color }) => (
                <button
                  key={type}
                  onClick={() => { setDrawerType(drawerType === type ? null : type); setDrawerSearch(''); }}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${drawerType === type ? 'text-rose-600' : `text-gray-600 ${color}`}`}
                >
                  {icon} {label}
                </button>
              ))}
              <button
                onClick={fetchBillingData}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RefreshCcw size={14} /> Update
              </button>
            </div>

            <div className={`flex items-center gap-3 ${currentDraftId ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <button
                onClick={handleCreateInvoice}
                disabled={isLoading}
                className="px-8 py-3 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Save Draft'}
              </button>
              <button
                onClick={handleGenerateWhatsApp}
                disabled={isLoading || isWhatsAppSending}
                className="px-8 py-3 bg-[#25d366] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#25d366]/20 hover:bg-[#20bd5a] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <MessageCircle size={14} /> {isLoading || isWhatsAppSending ? 'Processing...' : 'Generate & WhatsApp'}
              </button>
            </div>
          </div>

          {/* Selection Bottom Sheet — anchored above the toolbar */}
          {drawerType && currentDraftId && (
            <>
              {/* Backdrop */}
              <div
                className="absolute inset-0 z-30"
                onClick={() => setDrawerType(null)}
              />

              {/* Sheet */}
              <div className="absolute bottom-20 left-64 right-96 z-40 bg-white border-t border-l border-gray-100 shadow-[0_-8px_40px_-8px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom-4 duration-300 flex flex-col"
                style={{ maxHeight: '60vh' }}
              >
                {/* Sheet Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 shrink-0">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                      {drawerType === 'service' ? 'Choose from your services' :
                        drawerType === 'product' ? 'Choose from inventory' :
                          drawerType === 'package' ? 'Choose from your packages' : 'Manual bulk entry'}
                    </p>
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
                      {drawerType === 'service' ? 'Services' :
                        drawerType === 'product' ? 'Products' :
                          drawerType === 'package' ? 'Packages' : 'Bulk Items'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setDrawerType(null)}
                    className="w-9 h-9 bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Search (not for bulk) */}
                {drawerType !== 'bulk' && (
                  <div className="px-8 py-4 shrink-0 border-b border-gray-50">
                    <div className="relative">
                      <input
                        autoFocus
                        type="text"
                        placeholder={`Search ${drawerType}s...`}
                        value={drawerSearch}
                        onChange={(e) => setDrawerSearch(e.target.value)}
                        className="w-full bg-[#f5f6fa] placeholder:text-gray-300 placeholder:text-xs border-none outline-none px-4 py-3 text-xs font-semibold text-gray-900"
                      />
                      <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="flex-1 overflow-y-auto">
                  {drawerType === 'service' && (
                    <>
                      {(() => {
                        const filteredServices = services.filter(s =>
                          s.name.toLowerCase().includes(drawerSearch.toLowerCase())
                        );

                        // Group services by category
                        const grouped: { [key: string]: any[] } = {};
                        const uncategorized: any[] = [];

                        filteredServices.forEach(s => {
                          if (s.category) {
                            const catId = typeof s.category === 'object' ? s.category.id : s.category;
                            if (!grouped[catId]) grouped[catId] = [];
                            grouped[catId].push(s);
                          } else {
                            uncategorized.push(s);
                          }
                        });

                        const categoriesToRender = serviceCategories.filter(cat =>
                          grouped[cat.id] || cat.name.toLowerCase().includes(drawerSearch.toLowerCase())
                        );

                        const toggleCategory = (catId: string) => {
                          setExpandedCategories(prev =>
                            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
                          );
                        };

                        if (filteredServices.length === 0 && drawerSearch) {
                          return (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50/50">
                              <Plus size={28} className="mb-3 opacity-20" />
                              <p className="text-[10px] font-black uppercase tracking-widest mb-4">No services found</p>
                              <button
                                onClick={() => { addItem(drawerSearch, 0); setDrawerType(null); }}
                                className="px-6 py-2 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg shadow-gray-200"
                              >
                                Add "{drawerSearch}" as Manual Item
                              </button>
                            </div>
                          );
                        }

                        return (
                          <div className="divide-y divide-gray-50">
                            {categoriesToRender.map(cat => {
                              const groupServices = grouped[cat.id] || [];
                              const isExpanded = expandedCategories.includes(cat.id.toString()) || drawerSearch.length > 0;

                              return (
                                <div key={cat.id} className="bg-white">
                                  <button
                                    onClick={() => toggleCategory(cat.id.toString())}
                                    className="w-full flex items-center justify-between px-8 py-4 bg-gray-50/20 hover:bg-gray-50 transition-colors border-b border-gray-50"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-6 h-6 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-rose-500 transition-colors">
                                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                      </div>
                                      <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{cat.name}</span>
                                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[9px] font-black text-gray-400">{groupServices.length}</span>
                                    </div>
                                  </button>

                                  {isExpanded && (
                                    <div className="bg-white animate-in slide-in-from-top-2 duration-200">
                                      {groupServices.map(s => (
                                        <button
                                          key={s.id}
                                          onClick={() => { addItem(s.name, Number(s.price)); setDrawerType(null); }}
                                          className="w-full flex items-center justify-between px-12 py-3.5 hover:bg-rose-50/30 transition-colors border-b border-gray-50 last:border-0"
                                        >
                                          <div className="flex items-center gap-4">
                                            <div className="w-7 h-7 bg-rose-50 flex items-center justify-center shrink-0 rounded-lg">
                                              <Plus size={12} className="text-rose-500" />
                                            </div>
                                            <div className="text-left">
                                              <p className="text-xs font-bold text-gray-900">{s.name}</p>
                                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                                <Clock size={9} /> {s.duration_minutes} min
                                              </p>
                                            </div>
                                          </div>
                                          <span className="text-xs font-black text-rose-500">₹{Number(s.price).toLocaleString()}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {uncategorized.length > 0 && (
                              <div className="bg-white">
                                <div className="px-8 py-3 bg-gray-50/20 border-b border-gray-50">
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Uncategorized Services</span>
                                </div>
                                {uncategorized.map(s => (
                                  <button
                                    key={s.id}
                                    onClick={() => { addItem(s.name, Number(s.price)); setDrawerType(null); }}
                                    className="w-full flex items-center justify-between px-12 py-3.5 hover:bg-rose-50/30 transition-colors border-b border-gray-50 last:border-0"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="w-7 h-7 bg-rose-50 flex items-center justify-center shrink-0 rounded-lg">
                                        <Plus size={12} className="text-rose-500" />
                                      </div>
                                      <div className="text-left">
                                        <p className="text-xs font-bold text-gray-900">{s.name}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                          <Clock size={9} /> {s.duration_minutes} min
                                        </p>
                                      </div>
                                    </div>
                                    <span className="text-xs font-black text-rose-500">₹{Number(s.price).toLocaleString()}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {drawerType === 'product' && (
                    <>
                      {products
                        .filter(p => p.name.toLowerCase().includes(drawerSearch.toLowerCase()))
                        .map(p => (
                          <button
                            key={p.id}
                            onClick={() => { addItem(p.name, Number(p.unit_price)); setDrawerType(null); }}
                            className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-50 hover:bg-[#f5fdf8] transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-emerald-50 flex items-center justify-center shrink-0">
                                <Box size={14} className="text-emerald-500" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-black text-gray-900">{p.name}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">SKU: {p.sku || '—'}</p>
                              </div>
                            </div>
                            <span className="text-xs font-black text-emerald-600">₹{Number(p.unit_price).toLocaleString()}</span>
                          </button>
                        ))}
                      {products.filter(p => p.name.toLowerCase().includes(drawerSearch.toLowerCase())).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50/50">
                          <Plus size={28} className="mb-3 opacity-20" />
                          <p className="text-[10px] font-black uppercase tracking-widest mb-4">No products found</p>
                          {drawerSearch && (
                            <button
                              onClick={() => { addItem(drawerSearch, 0); setDrawerType(null); }}
                              className="px-6 py-2 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-gray-200"
                            >
                              Add "{drawerSearch}" as Manual Item
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {drawerType === 'package' && (
                    <>
                      {packages
                        .filter(pkg => pkg.name.toLowerCase().includes(drawerSearch.toLowerCase()))
                        .map(pkg => (
                          <button
                            key={pkg.id}
                            onClick={() => { addItem(pkg.name, Number(pkg.price)); setDrawerType(null); }}
                            className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-50 hover:bg-[#f8f5ff] transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-amber-50 flex items-center justify-center shrink-0">
                                <Layers size={14} className="text-amber-500" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-black text-gray-900">{pkg.name}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                  <CalendarDays size={9} /> {pkg.validity_days} days validity
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-black text-amber-600">₹{Number(pkg.price).toLocaleString()}</span>
                          </button>
                        ))}
                      {packages.filter(pkg => pkg.name.toLowerCase().includes(drawerSearch.toLowerCase())).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                          <Search size={28} className="mb-3" />
                          <p className="text-[10px] font-black uppercase tracking-widest">No packages found</p>
                        </div>
                      )}
                    </>
                  )}

                  {drawerType === 'bulk' && (
                    <div className="px-8 py-8 space-y-4">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.18em]">Enter custom item details manually</p>
                      <button
                        onClick={() => { addItem('', 0); setDrawerType(null); }}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1a1f2e] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                      >
                        <Plus size={14} /> Add Manual Item
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* New Walk-In SidePanel */}
      <SidePanel
        title="New Walk-In Session"
        subtitle="Quick assign staff and start building the bill"
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        footer={
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowWalkInModal(false)}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!newWalkIn.phone || !newWalkIn.staffId || isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  const token = localStorage.getItem('vora_token');

                  // 1. Create or get customer
                  const custRes = await fetch(`${API_CUSTOMERS_URL}/customers/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
                    body: JSON.stringify({
                      name: newWalkIn.name || 'Walk-In Customer',
                      phone: newWalkIn.phone,
                      email: newWalkIn.email,
                      gender: newWalkIn.gender.toUpperCase()
                    })
                  });

                  let customerId = null;
                  if (custRes.ok) {
                    const custData = await custRes.json();
                    customerId = custData.id;
                  } else {
                    // Try to fetch existing customer by phone if creation failed
                    const existRes = await fetch(`${API_CUSTOMERS_URL}/customers/?search=${newWalkIn.phone}`, {
                      headers: { 'Authorization': `Token ${token}` }
                    });
                    if (existRes.ok) {
                      const existData = await existRes.json();
                      if (existData.length > 0) customerId = existData[0].id;
                    }
                  }

                  if (!customerId) throw new Error("Could not create or find customer");

                  // 2. Create Draft Invoice
                  const invRes = await fetch(`${API_BILLING_URL}/invoices/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
                    body: JSON.stringify({
                      customer: customerId,
                      status: 'DRAFT',
                      payment_method: 'Cash',
                      staff_id: newWalkIn.staffId,
                      items: []
                    })
                  });

                  if (!invRes.ok) throw new Error("Failed to create draft invoice");
                  const invData = await invRes.json();

                  // 3. Update local state
                  const draftId = invData.id.toString();
                  setActiveDrafts([{
                    id: draftId,
                    customerName: newWalkIn.name || 'Walk-In Customer',
                    customerPhone: newWalkIn.phone,
                    customerEmail: newWalkIn.email,
                    customerGender: newWalkIn.gender as 'Male' | 'Female' | 'Others',
                    staffId: newWalkIn.staffId,
                    staffName: newWalkIn.staffName,
                    items: [],
                    status: 'Draft',
                    discountAmount: 0,
                    date: new Date().toISOString().split('T')[0]
                  }, ...activeDrafts]);
                  setCurrentDraftId(draftId);
                  setShowWalkInModal(false);
                  setViewMode('new-invoice');
                  setNewWalkIn({ name: '', phone: '', email: '', gender: 'Male', staffId: '', staffName: '' });
                } catch (error) {
                  console.error("Error starting walk-in session:", error);
                  alert((error as Error).message);
                } finally {
                  setIsLoading(false);
                }
              }}
              className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50 shadow-sm flex items-center gap-2"
            >
              {isLoading ? <RefreshCcw size={14} className="animate-spin" /> : null}
              Start Session
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe, or leave empty if unknown"
              value={newWalkIn.name}
              onChange={(e) => setNewWalkIn({ ...newWalkIn, name: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
            />
          </div>

          {/* Phone Input */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone Number <span className="text-rose-500">*</span></label>
            <input
              type="text"
              placeholder="Required for WhatsApp checkout"
              value={newWalkIn.phone}
              onChange={(e) => setNewWalkIn({ ...newWalkIn, phone: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
            />
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              placeholder="Optional"
              value={newWalkIn.email}
              onChange={(e) => setNewWalkIn({ ...newWalkIn, email: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gender</label>
            <div className="flex bg-[#f5f6fa] p-1 gap-1 rounded-[30px]">
              {['Male', 'Female', 'Other'].map((g) => (
                <button
                  key={g}
                  onClick={() => setNewWalkIn({ ...newWalkIn, gender: g as any })}
                  className={`flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest rounded-[30px] transition-all ${newWalkIn.gender === g ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Staff Selection Dropdown */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Assign Service Provider <span className="text-rose-500">*</span></label>
            <div className="grid grid-cols-2 gap-2">
              {staffMembers.map(staff => (
                <button
                  key={staff.id}
                  onClick={() => setNewWalkIn({ ...newWalkIn, staffId: staff.id, staffName: staff.name })}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${newWalkIn.staffId === staff.id ? 'bg-rose-50 border-rose-200' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${newWalkIn.staffId === staff.id ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-400'}`}>
                    <span className="text-xs font-black">{staff.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className={`text-xs font-black ${newWalkIn.staffId === staff.id ? 'text-gray-900' : 'text-gray-700'}`}>{staff.name}</p>
                    <p className="text-[9px] font-bold text-gray-400">{staff.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SidePanel>
    </div>
  );
};

export default Billing;