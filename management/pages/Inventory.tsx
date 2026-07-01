
import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  Package,
  Search,
  Plus,
  ArrowRight,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Download,
  Upload,
  LayoutGrid,
  List,
  Tag,
  Hash,
  Activity,
  SlidersHorizontal,
  ChevronUp,
  Check,
  X,
  Truck,
  ShoppingCart,
  Building2,
  ArrowUpDown
} from 'lucide-react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { SidePanel } from '../components/SidePanel';
import { usePlan } from '../components/PlanContext';

const API_BASE_URL = 'http://127.0.0.1:8000/api/inventory';

// Minimal mock for initial state
const INITIAL_INVENTORY: Product[] = [];

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

const InlineFilter = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isOpen || (value !== 'All' && !(value as string).includes('Any'))
          ? 'text-rose-500'
          : 'text-gray-400 hover:text-gray-900'
          }`}
      >
        <span>{label}</span>
        <ChevronUp size={12} className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 mt-2 min-w-[180px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-2 mb-1 border-b border-gray-50">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{label}</p>
            </div>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-50 transition-colors ${value === opt ? 'text-rose-600 bg-rose-50/50' : 'text-gray-600'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const isLow = (product.stock_quantity || product.stock) <= (product.reorder_level || product.threshold);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col relative overflow-hidden group hover:border-gray-300 transition-colors h-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-[#fafafa] border border-gray-100 flex items-center justify-center text-gray-800 font-black text-xl">
          {product.name ? product.name.charAt(0).toUpperCase() : 'P'}
        </div>
        <div className="flex-1 pt-1 min-w-0">
          <h3 className="text-base font-black text-gray-900 leading-tight truncate" title={product.name}>{product.name}</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5 truncate">
            {product.category_name || product.category || 'Uncategorized'}
          </p>
        </div>
        <button className="text-gray-300 hover:text-gray-900 p-1 -mr-2 -mt-1 transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Pill: Status / Stock Info */}
      <div className="p-3.5 bg-[#fafafa] rounded-2xl border border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Package size={14} className={isLow ? 'text-rose-500' : 'text-indigo-500'} />
            <span className="text-[10px] font-black uppercase tracking-widest">Stock Level</span>
          </div>
          <span className={`text-xs font-black ${isLow ? 'text-rose-600' : 'text-indigo-600'}`}>
            {product.stock_quantity ?? product.stock} {product.unit || 'pcs'}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isLow ? 'bg-rose-500' : 'bg-indigo-500'}`}
            style={{ width: `${Math.min(((product.stock_quantity ?? product.stock) / ((product.reorder_level ?? product.threshold) * 2)) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Big Number */}
      <div className="mt-6 mb-6 flex-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Retail Price</p>
        <p className="text-3xl font-black text-gray-900 tracking-tight">₹{(product.unit_price || product.price || 0).toLocaleString()}</p>
      </div>

      {/* Footer Button */}
      <button className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center">
        Restock Item
      </button>
    </div>
  );
};

const UNITS = ['pcs', 'tubes', 'kg', 'ml', 'box', 'set'];

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { checkPermission } = usePlan();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PRODUCTS');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'LIST' | 'GRID'>('LIST');
  const [isSaving, setIsSaving] = useState(false);

  // Categories / Suppliers for the form
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showSupDropdown, setShowSupDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const INITIAL_FORM = { name: '', sku: '', category: '', supplier: '', price: '', cost_price: '', stock: '0', threshold: '5', unit: 'pcs' };
  const [formData, setFormData] = useState(INITIAL_FORM);

  // Brands state
  const [brands, setBrands] = useState<any[]>([]);
  const [isBrandPanelOpen, setIsBrandPanelOpen] = useState(false);
  const [brandForm, setBrandForm] = useState({ name: '', description: '' });

  // Suppliers state
  const [supplierList, setSupplierList] = useState<any[]>([]);
  const [isSupplierPanelOpen, setIsSupplierPanelOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState({ name: '', contact_person: '', phone: '', email: '', address: '' });

  // Transactions state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isTxPanelOpen, setIsTxPanelOpen] = useState(false);
  const [txForm, setTxForm] = useState({ product: '', transaction_type: 'IN', quantity: '', notes: '' });
  const [showTxProductDropdown, setShowTxProductDropdown] = useState(false);
  const [showTxTypeDropdown, setShowTxTypeDropdown] = useState(false);
  const [isSavingOther, setIsSavingOther] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  // Fetch all tab data on mount
  useEffect(() => {
    const token = localStorage.getItem('vora_token');
    if (!token) return;
    const h = { 'Authorization': `Token ${token}` };
    fetch(`${API_BASE_URL}/brands/`, { headers: h }).then(r => r.ok ? r.json() : []).then(setBrands).catch(() => { });
    fetch(`${API_BASE_URL}/suppliers/`, { headers: h }).then(r => r.ok ? r.json() : []).then(d => { setSupplierList(d); setSuppliers(d); }).catch(() => { });
    fetch(`${API_BASE_URL}/transactions/`, { headers: h }).then(r => r.ok ? r.json() : []).then(setTransactions).catch(() => { });
  }, []);

  // Fetch categories and suppliers when panel opens
  useEffect(() => {
    if (isPanelOpen) {
      const token = localStorage.getItem('vora_token');
      fetch(`${API_BASE_URL}/categories/`, { headers: { 'Authorization': `Token ${token}` } })
        .then(r => r.json()).then(data => {
          setCategories(data);
          if (data.length > 0) setFormData(prev => ({ ...prev, category: data[0].id }));
        }).catch(() => { });
      fetch(`${API_BASE_URL}/suppliers/`, { headers: { 'Authorization': `Token ${token}` } })
        .then(r => r.json()).then(setSuppliers).catch(() => { });
    }
  }, [isPanelOpen]);

  const fetchProducts = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('vora_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [filterState, setFilterState] = useState({
    status: 'All',
    brands: 'Any Brands',
    category: 'Any Category',
    retailSales: 'All',
    fixedPrice: 'All',
    stockManagement: 'All'
  });

  const lowStockCount = products.filter(p => (p.stock_quantity ?? p.stock) <= (p.reorder_level ?? p.threshold)).length;

  const filteredProducts = products.filter(p => {
    const name = p.name || '';
    const cat = p.category_name || p.category || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterState.category === 'Any Category' || cat === filterState.category;
    return matchesSearch && matchesCategory;
  });

  const tabs = ['PRODUCTS', 'BRANDS', 'SUPPLIERS', 'TRANSACTIONS'];

  const handleSaveProduct = async (payload: any) => {
    const token = localStorage.getItem('vora_token');
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        fetchProducts();
        setIsPanelOpen(false);
        setFormData(INITIAL_FORM);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const submitForm = () => {
    if (!formData.name || !formData.sku || !formData.price) return;
    handleSaveProduct({
      name: formData.name,
      sku: formData.sku,
      category: formData.category || null,
      supplier: formData.supplier || null,
      unit_price: parseFloat(formData.price) || 0,
      cost_price: parseFloat(formData.cost_price) || 0,
      stock_quantity: parseInt(formData.stock) || 0,
      reorder_level: parseInt(formData.threshold) || 0,
    });
  };

  const postData = async (url: string, payload: any, onSuccess: () => void) => {
    const token = localStorage.getItem('vora_token');
    setIsSavingOther(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) onSuccess();
    } catch (e) { console.error(e); }
    finally { setIsSavingOther(false); }
  };

  const saveBrand = () => {
    if (!brandForm.name) return;
    postData(`${API_BASE_URL}/brands/`, brandForm, () => {
      setIsBrandPanelOpen(false);
      setBrandForm({ name: '', description: '' });
      fetch(`${API_BASE_URL}/brands/`, { headers: { 'Authorization': `Token ${localStorage.getItem('vora_token')}` } }).then(r => r.json()).then(setBrands);
    });
  };

  const saveSupplier = () => {
    if (!supplierForm.name) return;
    postData(`${API_BASE_URL}/suppliers/`, supplierForm, () => {
      setIsSupplierPanelOpen(false);
      setSupplierForm({ name: '', contact_person: '', phone: '', email: '', address: '' });
      fetch(`${API_BASE_URL}/suppliers/`, { headers: { 'Authorization': `Token ${localStorage.getItem('vora_token')}` } }).then(r => r.json()).then(d => { setSupplierList(d); setSuppliers(d); });
    });
  };

  const saveTransaction = () => {
    if (!txForm.product || !txForm.quantity) return;
    postData(`${API_BASE_URL}/transactions/`, { ...txForm, quantity: parseInt(txForm.quantity) }, () => {
      setIsTxPanelOpen(false);
      setTxForm({ product: '', transaction_type: 'IN', quantity: '', notes: '' });
      fetch(`${API_BASE_URL}/transactions/`, { headers: { 'Authorization': `Token ${localStorage.getItem('vora_token')}` } }).then(r => r.json()).then(setTransactions);
      fetchProducts(); // refresh stock
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-700 w-full min-h-screen">
      <div className="flex items-end justify-between px-2 pt-0 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Stock Management</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monitor supply levels and automate reordering</p>
        </div>
        {activeTab === 'PRODUCTS' && (
          <button onClick={() => checkPermission('inventory') && setIsPanelOpen(true)} className="flex items-center gap-2 bg-rose-500 text-white px-6 py-2.5 rounded-[30px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-100">
            <Plus size={14} /> New Product
          </button>
        )}
        {activeTab === 'BRANDS' && (
          <button onClick={() => checkPermission('inventory') && setIsBrandPanelOpen(true)} className="flex items-center gap-2 bg-rose-500 text-white px-6 py-2.5 rounded-[30px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-100">
            <Plus size={14} /> New Brand
          </button>
        )}
        {activeTab === 'SUPPLIERS' && (
          <button onClick={() => checkPermission('inventory') && setIsSupplierPanelOpen(true)} className="flex items-center gap-2 bg-rose-500 text-white px-6 py-2.5 rounded-[30px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-100">
            <Plus size={14} /> New Supplier
          </button>
        )}
        {activeTab === 'TRANSACTIONS' && (
          <button onClick={() => checkPermission('inventory') && setIsTxPanelOpen(true)} className="flex items-center gap-2 bg-rose-500 text-white px-6 py-2.5 rounded-[30px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-100">
            <Plus size={14} /> New Transaction
          </button>
        )}
      </div>

      {/* Advanced Tabs */}
      <div className="bg-white border border-gray-100 shadow-sm p-1 rounded-[30px] flex items-center gap-1 w-fit mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
              ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
              : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Metrics — change per tab */}
      {activeTab === 'PRODUCTS' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricHighlight label="Total SKU" value={products.length.toString()} trend="+12%" icon={Package} />
          <MetricHighlight
            label="Stock Value"
            value={`₹${(products.reduce((acc, p) => acc + ((p.unit_price || p.price || 0) * (p.stock_quantity ?? p.stock ?? 0)), 0) / 1000).toFixed(1)}k`}
            trend="+8.5%" icon={IndianRupee}
          />
          <MetricHighlight label="Low Stock" value={lowStockCount.toString()} trend="-2 Items" icon={AlertTriangle} />
          <MetricHighlight
            label="Top Category"
            value={(() => {
              const counts: Record<string, number> = {};
              products.forEach(p => { const c = p.category_name || p.category || 'Other'; counts[c] = (counts[c] || 0) + 1; });
              return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
            })()}
            trend="+15%" icon={Tag}
          />
        </div>
      )}
      {activeTab === 'BRANDS' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricHighlight label="Total Brands" value={brands.length.toString()} trend="+5%" icon={Tag} />
          <MetricHighlight label="Products Tagged" value={products.length.toString()} trend="+12%" icon={Package} />
          <MetricHighlight label="Active Suppliers" value={supplierList.length.toString()} trend="+3%" icon={Truck} />
          <MetricHighlight label="Transactions" value={transactions.length.toString()} trend="+8%" icon={ArrowUpDown} />
        </div>
      )}
      {activeTab === 'SUPPLIERS' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricHighlight label="Total Suppliers" value={supplierList.length.toString()} trend="+3%" icon={Building2} />
          <MetricHighlight label="Total Products" value={products.length.toString()} trend="+12%" icon={Package} />
          <MetricHighlight
            label="Stock Value"
            value={`₹${(products.reduce((acc, p) => acc + ((p.unit_price || p.price || 0) * (p.stock_quantity ?? p.stock ?? 0)), 0) / 1000).toFixed(1)}k`}
            trend="+8.5%" icon={IndianRupee}
          />
          <MetricHighlight label="Low Stock" value={lowStockCount.toString()} trend="-2 Items" icon={AlertTriangle} />
        </div>
      )}
      {activeTab === 'TRANSACTIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricHighlight label="Total Transactions" value={transactions.length.toString()} trend="+8%" icon={ArrowUpDown} />
          <MetricHighlight
            label="Stock In"
            value={transactions.filter(t => t.transaction_type === 'IN').reduce((a, t) => a + (t.quantity || 0), 0).toString()}
            trend="+15%" icon={ShoppingCart}
          />
          <MetricHighlight
            label="Stock Out"
            value={transactions.filter(t => t.transaction_type === 'OUT').reduce((a, t) => a + (t.quantity || 0), 0).toString()}
            trend="-5%" icon={Truck}
          />
          <MetricHighlight label="Products Moved" value={new Set(transactions.map(t => t.product)).size.toString()} trend="+10%" icon={Package} />
        </div>
      )}

      {activeTab === 'PRODUCTS' && (<>
        <div className="flex flex-col gap-6 pt-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            <div className="relative group w-full lg:w-80">
              <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-white border border-gray-100 rounded-[30px] pl-14 pr-6 text-xs font-bold shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-gray-300 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 px-4 h-10 bg-gray-50/50 rounded-[30px] border border-gray-100/50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  Items: <span className="text-gray-900 ml-1">{products.length}</span>
                </p>
                <div className="h-3 w-[1px] bg-gray-200"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  Filtered: <span className="text-rose-500 ml-1">{filteredProducts.length}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-white border border-gray-100 rounded-[30px] h-10 shadow-sm">
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`px-3 h-full rounded-full transition-all ${viewMode === 'LIST' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode('GRID')}
                  className={`px-3 h-full rounded-full transition-all ${viewMode === 'GRID' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 h-10 bg-white border border-gray-100 rounded-[30px] text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all shadow-sm">
                  <Upload size={14} /> Import
                </button>
                <button className="flex items-center gap-2 px-4 h-10 bg-white border border-gray-100 rounded-[30px] text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all shadow-sm">
                  <Download size={14} /> Export
                </button>
              </div>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-6 h-10 border rounded-[30px] text-[11px] font-black uppercase tracking-widest transition-all shadow-sm shrink-0 ${isFilterOpen || Object.values(filterState).some(v => v !== 'All' && !(v as string).includes('Any'))
                  ? 'bg-rose-500 text-white border-rose-500 shadow-rose-100 shadow-xl'
                  : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <SlidersHorizontal size={14} />
                <span>FILTER</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {isFilterOpen && (
            <div className="flex flex-wrap items-center justify-end gap-2 p-2 bg-white border border-gray-100 rounded-2xl shadow-sm animate-in fade-in slide-in-from-right-4 duration-500 w-fit ml-auto">
              <InlineFilter
                label="STATUS"
                value={filterState.status}
                options={['All', 'Active', 'Inactive']}
                onChange={(v) => setFilterState({ ...filterState, status: v })}
              />
              <InlineFilter
                label="BRANDS"
                value={filterState.brands}
                options={['Any Brands', "L'Oreal", 'Matrix', 'Wella']}
                onChange={(v) => setFilterState({ ...filterState, brands: v })}
              />
              <InlineFilter
                label="CATEGORY"
                value={filterState.category}
                options={['Any Category', ...categories.map(c => c.name)]}
                onChange={(v) => setFilterState({ ...filterState, category: v })}
              />
              <InlineFilter
                label="RETAIL SALES"
                value={filterState.retailSales}
                options={['All', 'Enabled', 'Disabled']}
                onChange={(v) => setFilterState({ ...filterState, retailSales: v })}
              />
              <InlineFilter
                label="FIXED PRICE"
                value={filterState.fixedPrice}
                options={['All', 'Yes', 'No']}
                onChange={(v) => setFilterState({ ...filterState, fixedPrice: v })}
              />
              <InlineFilter
                label="STOCK MANAGEMENT"
                value={filterState.stockManagement}
                options={['All', 'Enabled', 'Disabled']}
                onChange={(v) => setFilterState({ ...filterState, stockManagement: v })}
              />

              {Object.values(filterState).some(v => v !== 'All' && !(v as string).includes('Any')) && (
                <button
                  onClick={() => setFilterState({
                    status: 'All',
                    brands: 'Any Brands',
                    category: 'Any Category',
                    retailSales: 'All',
                    fixedPrice: 'All',
                    stockManagement: 'All'
                  })}
                  className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>

        {viewMode === 'LIST' ? (
          <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Retail Price</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock In Hand</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((product) => {
                    const isLow = product.stock <= product.threshold;
                    return (
                      <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                              <Package size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-gray-900">{product.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">In {product.category_name || product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <p className="text-sm font-black text-gray-900">₹{(product.unit_price || product.price).toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex flex-col gap-1 w-32">
                              <div className="flex justify-between">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isLow ? 'text-rose-600' : 'text-gray-900'}`}>{product.stock_quantity ?? product.stock} {product.unit || 'pcs'} Left</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${Math.min(((product.stock_quantity ?? product.stock) / ((product.reorder_level ?? product.threshold) * 2)) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-center">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border border-emerald-200">
                              ACTIVE
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </>)}

      {/* Tab Content for BRANDS, SUPPLIERS, TRANSACTIONS */}
      {
        activeTab === 'BRANDS' && (
          <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand Name</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {brands.length === 0 ? (
                    <tr><td colSpan={3} className="px-8 py-16 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">No brands yet</td></tr>
                  ) : brands.map((b) => (
                    <tr key={b.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                            <Tag size={16} />
                          </div>
                          <p className="text-sm font-black text-gray-900">{b.name}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5"><p className="text-xs font-bold text-gray-400">{b.description || '—'}</p></td>
                      <td className="px-8 py-5 text-right"><button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-300 hover:text-gray-900"><MoreVertical size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      {
        activeTab === 'SUPPLIERS' && (
          <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Supplier</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {supplierList.length === 0 ? (
                    <tr><td colSpan={5} className="px-8 py-16 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">No suppliers yet</td></tr>
                  ) : supplierList.map((s) => (
                    <tr key={s.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                            <Building2 size={16} />
                          </div>
                          <p className="text-sm font-black text-gray-900">{s.name}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5"><p className="text-xs font-bold text-gray-600">{s.contact_person || '—'}</p></td>
                      <td className="px-8 py-5"><p className="text-xs font-bold text-gray-600">{s.phone || '—'}</p></td>
                      <td className="px-8 py-5"><p className="text-xs font-bold text-gray-600">{s.email || '—'}</p></td>
                      <td className="px-8 py-5 text-right"><button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-300 hover:text-gray-900"><MoreVertical size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      {
        activeTab === 'TRANSACTIONS' && (
          <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Notes</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.length === 0 ? (
                    <tr><td colSpan={5} className="px-8 py-16 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">No transactions yet</td></tr>
                  ) : transactions.map((t) => (
                    <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${t.transaction_type === 'IN' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                            <ArrowUpDown size={16} />
                          </div>
                          <p className="text-sm font-black text-gray-900">{t.product_name || `Product #${t.product}`}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${t.transaction_type === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                          }`}>{t.transaction_type === 'IN' ? 'Stock In' : 'Stock Out'}</span>
                      </td>
                      <td className="px-8 py-5 text-center"><p className="text-sm font-black text-gray-900">{t.quantity}</p></td>
                      <td className="px-8 py-5"><p className="text-xs font-bold text-gray-400">{t.notes || '—'}</p></td>
                      <td className="px-8 py-5 text-right"><p className="text-[10px] font-bold text-gray-400">{t.created_at ? new Date(t.created_at).toLocaleDateString() : '—'}</p></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => { setIsPanelOpen(false); setFormData(INITIAL_FORM); }}
        title="Add Product"
        subtitle="Register new salon inventory"
        width="max-w-[520px]"
        footer={
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setIsPanelOpen(false); setFormData(INITIAL_FORM); }}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitForm}
              disabled={isSaving || !formData.name || !formData.sku || !formData.price}
              className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Add to Inventory'}
            </button>
          </div>
        }
      >
        <div className="space-y-5">

          {/* Product Info */}
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Product Info</p>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Product Name</label>
            <input
              type="text"
              placeholder="e.g. Premium Keratin Serum"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">SKU / Barcode</label>
            <input
              type="text"
              placeholder="SKU-12345"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
            />
          </div>

          {/* Category & Supplier */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCatDropdown(v => !v)}
                  onBlur={() => setTimeout(() => setShowCatDropdown(false), 150)}
                  className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-700 text-left flex items-center justify-between outline-none focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all"
                >
                  <span className={formData.category ? 'text-gray-900' : 'text-gray-300'}>
                    {categories.find(c => String(c.id) === String(formData.category))?.name || 'Select...'}
                  </span>
                  <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${showCatDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showCatDropdown && (
                  <div className="absolute left-0 top-full w-full bg-white border border-gray-100 shadow-xl z-50 overflow-hidden">
                    {categories.map(c => (
                      <button key={c.id} type="button"
                        onMouseDown={() => { setFormData({ ...formData, category: String(c.id) }); setShowCatDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors ${String(formData.category) === String(c.id) ? 'bg-[#f5f6fa] text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        {c.name}{String(formData.category) === String(c.id) && <Check size={11} className="text-rose-500" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Supplier</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSupDropdown(v => !v)}
                  onBlur={() => setTimeout(() => setShowSupDropdown(false), 150)}
                  className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-700 text-left flex items-center justify-between outline-none focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all"
                >
                  <span className={formData.supplier ? 'text-gray-900' : 'text-gray-300'}>
                    {suppliers.find(s => String(s.id) === String(formData.supplier))?.name || 'Optional'}
                  </span>
                  <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${showSupDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSupDropdown && (
                  <div className="absolute left-0 top-full w-full bg-white border border-gray-100 shadow-xl z-50 overflow-hidden">
                    <button type="button"
                      onMouseDown={() => { setFormData({ ...formData, supplier: '' }); setShowSupDropdown(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                    >None</button>
                    {suppliers.map(s => (
                      <button key={s.id} type="button"
                        onMouseDown={() => { setFormData({ ...formData, supplier: String(s.id) }); setShowSupDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors ${String(formData.supplier) === String(s.id) ? 'bg-[#f5f6fa] text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        {s.name}{String(formData.supplier) === String(s.id) && <Check size={11} className="text-rose-500" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-50" />

          {/* Pricing */}
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pricing</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Unit Price (₹)</label>
              <input
                type="number" placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cost Price (₹)</label>
              <input
                type="number" placeholder="0.00"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="h-px bg-gray-50" />

          {/* Stock */}
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Stock</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Quantity</label>
              <input
                type="number" placeholder="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Alert At</label>
              <input
                type="number" placeholder="5"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Unit</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUnitDropdown(v => !v)}
                  onBlur={() => setTimeout(() => setShowUnitDropdown(false), 150)}
                  className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-700 text-left flex items-center justify-between outline-none focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all"
                >
                  <span>{formData.unit}</span>
                  <ChevronDown size={13} className={`text-gray-400 transition-transform ${showUnitDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showUnitDropdown && (
                  <div className="absolute left-0 top-full w-full bg-white border border-gray-100 shadow-xl z-50 overflow-hidden">
                    {UNITS.map(u => (
                      <button key={u} type="button"
                        onMouseDown={() => { setFormData({ ...formData, unit: u }); setShowUnitDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors ${formData.unit === u ? 'bg-[#f5f6fa] text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        {u}{formData.unit === u && <Check size={11} className="text-rose-500" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </SidePanel>

      {/* Brand SidePanel */}
      <SidePanel
        isOpen={isBrandPanelOpen}
        onClose={() => { setIsBrandPanelOpen(false); setBrandForm({ name: '', description: '' }); }}
        title="New Brand"
        subtitle="Add a product brand"
        width="max-w-[440px]"
        footer={
          <div className="flex items-center justify-between">
            <button onClick={() => setIsBrandPanelOpen(false)} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
            <button onClick={saveBrand} disabled={isSavingOther || !brandForm.name} className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50">
              {isSavingOther ? 'Saving...' : 'Save Brand'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Brand Name</label>
            <input type="text" placeholder="e.g. L'Oreal Professional" value={brandForm.name}
              onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Description</label>
            <textarea rows={4} placeholder="Short description of this brand..." value={brandForm.description}
              onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none resize-none placeholder:text-gray-300" />
          </div>
        </div>
      </SidePanel>

      {/* Supplier SidePanel */}
      <SidePanel
        isOpen={isSupplierPanelOpen}
        onClose={() => { setIsSupplierPanelOpen(false); setSupplierForm({ name: '', contact_person: '', phone: '', email: '', address: '' }); }}
        title="New Supplier"
        subtitle="Add a product supplier"
        width="max-w-[480px]"
        footer={
          <div className="flex items-center justify-between">
            <button onClick={() => setIsSupplierPanelOpen(false)} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
            <button onClick={saveSupplier} disabled={isSavingOther || !supplierForm.name} className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50">
              {isSavingOther ? 'Saving...' : 'Save Supplier'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Company Name</label>
            <input type="text" placeholder="e.g. Beauty Wholesale Co." value={supplierForm.name}
              onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contact Person</label>
            <input type="text" placeholder="Full name" value={supplierForm.contact_person}
              onChange={(e) => setSupplierForm({ ...supplierForm, contact_person: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone</label>
              <input type="text" placeholder="+91 XXXXX XXXXX" value={supplierForm.phone}
                onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email</label>
              <input type="email" placeholder="supplier@email.com" value={supplierForm.email}
                onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Address</label>
            <textarea rows={3} placeholder="Full address..." value={supplierForm.address}
              onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none resize-none placeholder:text-gray-300" />
          </div>
        </div>
      </SidePanel>

      {/* Transaction SidePanel */}
      <SidePanel
        isOpen={isTxPanelOpen}
        onClose={() => { setIsTxPanelOpen(false); setTxForm({ product: '', transaction_type: 'IN', quantity: '', notes: '' }); }}
        title="New Transaction"
        subtitle="Record a stock movement"
        width="max-w-[440px]"
        footer={
          <div className="flex items-center justify-between">
            <button onClick={() => setIsTxPanelOpen(false)} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
            <button onClick={saveTransaction} disabled={isSavingOther || !txForm.product || !txForm.quantity} className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50">
              {isSavingOther ? 'Saving...' : 'Record Transaction'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Product</label>
            <div className="relative">
              <button type="button"
                onClick={() => setShowTxProductDropdown(v => !v)}
                onBlur={() => setTimeout(() => setShowTxProductDropdown(false), 150)}
                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-left flex items-center justify-between outline-none focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all"
              >
                <span className={txForm.product ? 'text-gray-900' : 'text-gray-300'}>
                  {products.find(p => String(p.id) === String(txForm.product))?.name || 'Select product...'}
                </span>
                <ChevronDown size={13} className={`text-gray-400 transition-transform ${showTxProductDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showTxProductDropdown && (
                <div className="absolute left-0 top-full w-full bg-white border border-gray-100 shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto">
                  {products.map(p => (
                    <button key={p.id} type="button"
                      onMouseDown={() => { setTxForm({ ...txForm, product: String(p.id) }); setShowTxProductDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors ${String(txForm.product) === String(p.id) ? 'bg-[#f5f6fa] text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {p.name}{String(txForm.product) === String(p.id) && <Check size={11} className="text-rose-500" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Transaction Type</label>
            <div className="flex bg-[#f5f6fa] p-1 gap-1 rounded-[30px]">
              {(['IN', 'OUT'] as const).map(t => (
                <button key={t} type="button"
                  onClick={() => setTxForm({ ...txForm, transaction_type: t })}
                  className={`flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest rounded-[30px] transition-all ${txForm.transaction_type === t ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {t === 'IN' ? 'Stock In' : 'Stock Out'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Quantity</label>
            <input type="number" placeholder="0" value={txForm.quantity}
              onChange={(e) => setTxForm({ ...txForm, quantity: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Notes (Optional)</label>
            <textarea rows={3} placeholder="Reason or reference..." value={txForm.notes}
              onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none resize-none placeholder:text-gray-300" />
          </div>
        </div>
      </SidePanel>
    </div >
  );
};

export default Inventory;
