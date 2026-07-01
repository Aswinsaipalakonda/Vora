
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Outlet } from 'react-router-dom';
import { Bell, Menu, X, Settings, Plus, LayoutGrid, Search, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from './constants';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import Inventory from './pages/Inventory';
import Packages from './pages/Packages';
import Memberships from './pages/Memberships';
import MarketingAI from './pages/MarketingAI';
import Customers from './pages/Customers';
import Experience from './pages/Experience';
import Reports from './pages/Reports';
import Configuration from './pages/Configuration';
import Profile from './pages/Profile';
import Help from './pages/Help';
import PremiumLoader from './components/PremiumLoader';
import AIChatBot from './components/AIChatBot';
import NotificationPanel from './components/NotificationPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Contact from './pages/Contact';
import { Navigate } from 'react-router-dom';
import { PlanProvider } from './components/PlanContext';
import UpgradeModal from './components/UpgradeModal';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('vora_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Placeholder for missing pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
      <Settings size={32} />
    </div>
    <h2 className="text-xl font-bold text-gray-900">{title} Module</h2>
    <p className="text-sm mt-2">This feature is currently being optimized for your salon.</p>
  </div>
);

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const location = useLocation();

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-black text-white transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col h-full overflow-hidden border-r border-white/5 flex-shrink-0`}>
      <div className="flex h-16 items-center px-8 flex-shrink-0 gap-3 mt-4">
        <div className="relative w-9 h-9 bg-white rounded-[0.7rem] flex items-center justify-center shadow-2xl flex-shrink-0">
          <div className="relative w-4 h-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-black rounded-[0.25rem] rotate-45 shadow-lg"></div>
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-white" style={{ fontWeight: '500' }}>
          Vora
        </h1>
        <button onClick={toggle} className="md:hidden ml-auto p-1.5 hover:bg-white/10 rounded-lg transition-colors self-center">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto custom-scrollbar scroll-smooth pt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '');
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-2.5 transition-all duration-200 group ${isActive
                ? 'bg-[#1F2937] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              style={{ borderRadius: '30px' }}
            >
              <span className={isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 17 })}
              </span>
              <span className="text-[12.5px] font-bold">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 pt-4 border-t border-white/5 flex-shrink-0 bg-black flex items-end gap-1.5">
        <button className="flex-1 h-9 bg-[#0F172A] border border-white/5 rounded-full px-3 flex items-center justify-between hover:bg-[#1E293B] transition-all group overflow-hidden">
          <div className="flex items-center gap-1.5">
            <Settings size={12} className="text-gray-500 group-hover:rotate-45 transition-transform" />
            <span className="text-[7px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Shortcuts</span>
          </div>
          <span className="text-[7px] font-bold text-gray-600 bg-white/5 px-1 rounded">?</span>
        </button>

        <button className="flex-1 h-9 bg-white text-black rounded-full px-3 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-white/5 group relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-[7px] font-black uppercase tracking-widest whitespace-nowrap relative z-10">Get Support</span>
          <div className="h-5 px-1.5 bg-gray-100 rounded flex items-center justify-center group-hover:bg-white transition-colors ml-1 relative z-10">
            <span className="text-[6.5px] text-gray-400 font-bold whitespace-nowrap">CTRL+H</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  return (
    <header className="h-20 bg-white flex items-center justify-between px-10 flex-shrink-0 border-b border-gray-100/50 backdrop-blur-sm bg-white/90 z-40">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
          <Menu size={20} />
        </button>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">Lumière Salon Pro</h2>
          <button className="text-[11px] font-medium text-gray-400 tracking-wide flex items-center gap-1 hover:text-gray-600 transition-colors group">
            Bangalore, Indiranagar <ChevronDown size={10} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div className="relative flex items-center justify-end mr-0">
          <div
            className={`flex items-center rounded-full transition-all duration-300 ease-in-out cursor-pointer group hover:bg-gray-100 ${isSearchExpanded ? 'w-96 border border-gray-100 h-11' : 'w-11 h-11 border-transparent'}`}
            onClick={() => setIsSearchExpanded(true)}
          >
            <div className={`flex items-center justify-center transition-all ${isSearchExpanded ? 'pl-4' : 'w-full h-full'}`}>
              <Search
                size={22}
                className="text-gray-400 group-hover:text-gray-500 transition-colors"
              />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search clients, bills..."
              onBlur={() => setIsSearchExpanded(false)}
              className={`h-full bg-transparent text-[11px] font-bold outline-none placeholder:text-gray-400 uppercase tracking-wide transition-all ${isSearchExpanded ? 'w-full pl-3 pr-4 opacity-100' : 'w-0 opacity-0 pointer-events-none overflow-hidden'}`}
            />
          </div>
        </div>
        <AIChatBot />
        <NotificationPanel />
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="h-9 w-9 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-md group-hover:scale-105 transition-transform">
            H
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-[11px] font-black text-gray-900 leading-none tracking-tight">HARSHAVARDHAN VEMALI</p>
            <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

const ScrollHandler = ({ scrollRef }: { scrollRef: React.RefObject<HTMLElement> }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [pathname, scrollRef]);
  return null;
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainScrollRef = React.useRef<HTMLElement>(null);
  const location = useLocation();
  const isBilling = location.pathname.includes('billing');

  return (
    <div className="flex h-screen w-screen bg-[#F9FAFB] overflow-hidden overflow-x-hidden">
      <ScrollHandler scrollRef={mainScrollRef} />
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden overflow-x-hidden">
        <Header toggleSidebar={() => setSidebarOpen(true)} />

        <main ref={mainScrollRef} className={`flex-1 overflow-y-auto overflow-x-hidden scroll-smooth relative ${isBilling ? 'p-0' : 'p-10'}`}>
          <div className="w-full mx-auto overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const mainScrollRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    // Initial splash screen simulation
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1500); // Reduced loading time for development
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return <PremiumLoader />;
  }

  return (
    <PlanProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Dashboard Routes */}
          <Route path="/app" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="billing" element={<Billing />} />
            <Route path="memberships" element={<Memberships />} />
            <Route path="packages" element={<Packages />} />
            <Route path="marketing" element={<MarketingAI />} />
            <Route path="cxm" element={<Experience />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Configuration />} />
            <Route path="profile" element={<Profile />} />
            <Route path="help" element={<Help />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
        <UpgradeModal />
      </Router>
    </PlanProvider>
  );
};

export default App;
