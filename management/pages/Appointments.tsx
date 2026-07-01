import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Calendar as CalendarIcon, Search, Plus, MoreHorizontal, LayoutList, ChevronLeft, ChevronRight, ChevronDown, X, RefreshCcw, Calendar, Bell, Users, Download, ShieldCheck, Mail, Smartphone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppointmentStatus, Appointment } from '../types';
import { SidePanel } from '../components/SidePanel';
import { usePlan } from '../components/PlanContext';

const API_APPOINTMENTS_URL = 'http://127.0.0.1:8000/api/appointments';
const API_CUSTOMERS_URL = 'http://127.0.0.1:8000/api/customers';

const AddBookingPanelContent = ({ onSave, customers, isLoading, onClose }: { onSave: (data: any) => void, customers: any[], isLoading: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({ customer: '', date: '', time: '', service_description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCustomer = customers.find(c => c.id === formData.customer);

  return (
    <div className="space-y-6">
      {/* Client Selector */}
      <div className="space-y-1.5 relative" ref={dropdownRef}>
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select Client</label>

        <div
          className="w-full bg-[#f5f6fa] px-4 py-3 flex items-center justify-between cursor-pointer transition-all"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedCustomer ? (
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 bg-gray-900 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-900">{selectedCustomer.name}</span>
                <span className="text-[9px] font-bold text-gray-400">{selectedCustomer.phone}</span>
              </div>
            </div>
          ) : (
            <span className="text-xs font-bold text-gray-400">Choose a client...</span>
          )}
          <ChevronDown size={13} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </div>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="p-3 border-b border-gray-50">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by name or phone..."
                  className="w-full bg-[#f5f6fa] pl-9 pr-4 py-2 text-xs font-bold outline-none placeholder:text-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-[280px] overflow-y-auto">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(c => (
                  <button
                    key={c.id}
                    className="w-full px-4 py-3 hover:bg-rose-50/50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                    onClick={() => {
                      setFormData({ ...formData, customer: c.id });
                      setIsDropdownOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div className="h-8 w-8 bg-[#f5f6fa] flex items-center justify-center text-[10px] font-black text-gray-500 uppercase shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-black text-gray-900">{c.name}</span>
                      <span className="text-[9px] font-bold text-gray-400">{c.phone}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No clients found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</label>
          <input
            type="date"
            className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-700 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Time</label>
          <input
            type="time"
            className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-700 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Service Details</label>
        <textarea
          className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none resize-none h-28 placeholder:text-gray-300"
          placeholder="e.g. Premium Haircut & Styling"
          value={formData.service_description}
          onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
        />
      </div>

      <button
        onClick={() => onSave(formData)}
        disabled={isLoading || !formData.customer || !formData.date || !formData.time}
        className="w-full py-3.5 bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <RefreshCcw size={14} className="animate-spin" /> Confirming...
          </>
        ) : (
          <>
            <Calendar size={14} /> Confirm Appointment
          </>
        )}
      </button>
    </div>
  );
};

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { checkPermission } = usePlan();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'day'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth()));

  const fetchAppointments = async () => {
    const token = localStorage.getItem('vora_token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const [aptRes, custRes] = await Promise.all([
        fetch(`${API_APPOINTMENTS_URL}/appointments/`, { headers: { 'Authorization': `Token ${token}` } }),
        fetch(`${API_CUSTOMERS_URL}/customers/`, { headers: { 'Authorization': `Token ${token}` } })
      ]);

      if (aptRes.ok) setAppointments(await aptRes.json());
      if (custRes.ok) setCustomers(await custRes.json());
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSaveBooking = async (data: any) => {
    const token = localStorage.getItem('vora_token');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_APPOINTMENTS_URL}/appointments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setIsAddPanelOpen(false);
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const filteredAppointments = filterStatus === 'All'
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'PENDING':
      case 'SCHEDULED': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'COMPLETED': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const calendarDays = Array.from({ length: daysInMonth(currentMonth.getMonth(), currentMonth.getFullYear()) }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: startDayOfMonth(currentMonth.getMonth(), currentMonth.getFullYear()) }, (_, i) => null);

  const getAppointmentsForDay = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(a => a.date === dateStr);
  };

  const getMinutesFromTime = (timeStr: string) => {
    if (!timeStr) return 0;
    if (timeStr.includes(' ')) {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (hours === 12 && modifier === 'AM') hours = 0;
      if (modifier === 'PM' && hours !== 12) hours += 12;
      return hours * 60 + minutes;
    } else {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + (minutes || 0);
    }
  };

  const dayViewRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (viewMode === 'day' && dayViewRef.current) {
      dayViewRef.current.scrollTop = 480;
    }
  }, [viewMode, selectedDate]);

  return (
    <div className="max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-700 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Appointments</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage and schedule client bookings effortlessly</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-100 p-1 rounded-[30px] flex items-center gap-1 h-10 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'list'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-900'
                }`}
            >
              <LayoutList size={14} />
              List
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-6 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'day'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-900'
                }`}
            >
              <div className="w-3.5 h-3.5 flex flex-col justify-between py-0.5">
                <div className="w-full h-[1px] bg-current"></div>
                <div className="w-full h-[1px] bg-current"></div>
                <div className="w-full h-[1px] bg-current"></div>
              </div>
              Day
            </button>
          </div>
          <button
            onClick={() => setIsAddPanelOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-[30px] font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 transition-all shadow-xl shadow-rose-100"
          >
            <Plus size={14} />
            New Booking
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col relative">
        {viewMode === 'list' && (
          <>
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative group w-full md:w-96">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="text"
                    placeholder="Search client, service..."
                    className="w-full h-10 bg-white border border-gray-100 rounded-[30px] pl-14 pr-6 text-xs font-bold shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-gray-300 outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {['All', ...Object.values(AppointmentStatus)].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === status
                      ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                      : 'text-gray-400 hover:text-gray-900 border border-transparent'
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-20 shadow-sm">
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                    <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Service</th>
                    <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Staff</th>
                    <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                    <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors group relative z-10 bg-white">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-gray-200">
                            {apt.customer_name?.charAt(0)}
                          </div>
                          <span className="text-xs font-black text-gray-900">{apt.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs font-bold text-gray-600">{apt.service_description}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gray-100 overflow-hidden ring-2 ring-white shadow-sm grayscale group-hover:grayscale-0 transition-all">
                            <img src={`https://picsum.photos/seed/staff/100/100`} alt="" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500">Staff</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-gray-900">{apt.time}</span>
                          <span className="text-[9px] font-bold text-gray-400 mt-0.5">{apt.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[11px] font-black text-gray-900">₹0</td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {viewMode === 'day' && (
          <div className="flex h-full overflow-hidden">
            <div className="w-80 bg-white border-r border-gray-100 flex flex-col pt-6 pb-6 overflow-y-auto">
              <div className="px-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-black text-gray-900">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-1 text-gray-400 hover:text-gray-900"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-1 text-gray-400 hover:text-gray-900"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-[10px] font-bold text-center text-gray-400">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2">
                  {paddingDays.map((_, i) => <div key={`pad-${i}`} />)}
                  {calendarDays.map(day => {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const isSelected = formatDateKey(date) === formatDateKey(selectedDate);
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mx-auto ${isSelected ? 'bg-black text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 mt-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">On this day</h3>
                <div className="space-y-3">
                  {getAppointmentsForDay(selectedDate.getDate()).length === 0 ? (
                    <div className="text-xs text-center py-8 text-gray-300 italic">No appointments</div>
                  ) : (
                    getAppointmentsForDay(selectedDate.getDate()).map(apt => (
                      <div key={apt.id} className="flex gap-3 group cursor-pointer">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold text-gray-900">{apt.time?.split(':')[0]}</span>
                          <div className="w-[1px] h-full bg-gray-100 mt-1 group-last:hidden"></div>
                        </div>
                        <div className={`flex-1 p-3 rounded-2xl mb-2 transition-all ${getStatusColor(apt.status)}`}>
                          <p className="text-xs font-black text-gray-900">{apt.customer_name}</p>
                          <p className="text-[10px] text-gray-500 font-bold">{apt.service_description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-baseline gap-3">
                    {selectedDate.getDate()} <span className="text-lg font-bold text-gray-400">{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                  </h2>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-full">
                  <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1))} className="p-1.5 hover:bg-white rounded-full text-gray-400 transition-all"><ChevronLeft size={16} /></button>
                  <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1))} className="p-1.5 hover:bg-white rounded-full text-gray-400 transition-all"><ChevronRight size={16} /></button>
                </div>
              </div>

              <div ref={dayViewRef} className="relative flex-1 overflow-y-auto">
                <div className="relative min-h-[1440px] w-full">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="absolute w-full border-t border-gray-50 flex" style={{ top: `${i * 60}px`, height: '60px' }}>
                      <div className="w-16 shrink-0 text-right pr-4 -mt-2.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                        </span>
                      </div>
                      <div className="flex-1 border-l border-gray-50 h-full relative"></div>
                    </div>
                  ))}

                  {appointments.filter(a => a.date === formatDateKey(selectedDate)).map((apt) => {
                    const startMinutes = getMinutesFromTime(apt.time);
                    return (
                      <div
                        key={apt.id}
                        className={`absolute left-20 right-4 rounded-[18px] p-3 border-l-4 transition-all cursor-pointer ${getStatusColor(apt.status)}`}
                        style={{ top: `${startMinutes}px`, height: '60px' }}
                      >
                        <h4 className="text-[13px] font-black tracking-tight leading-tight">{apt.service_description}</h4>
                        <p className="text-[11px] font-bold opacity-70">{apt.customer_name} • {apt.time}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <SidePanel
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
        title="New Booking"
        subtitle="Schedule a new service for a client"
        width="max-w-[600px]"
      >
        <AddBookingPanelContent
          onSave={handleSaveBooking}
          customers={customers}
          isLoading={isLoading}
          onClose={() => setIsAddPanelOpen(false)}
        />
      </SidePanel>
    </div>
  );
};

export default Appointments;
