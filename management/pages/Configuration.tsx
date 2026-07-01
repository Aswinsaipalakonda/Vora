import React, { useState, useEffect } from 'react';
import {
    Settings,
    User,
    Bell,
    Shield,
    CreditCard,
    Globe,
    Moon,
    Palette,
    LogOut,
    ChevronRight,
    Save,
    Check,
    Mail,
    Smartphone,
    Lock,
    Eye,
    EyeOff,
    Upload,
    Clock,
    MapPin,
    FileText,
    Receipt,
    Percent,
    Users,
    Scissors,
    CalendarCheck,
    MessageCircle,
    Plus,
    Trash2,
    Briefcase,
    Search,
    X
} from 'lucide-react';
import { usePlan } from '../components/PlanContext';
import { SidePanel } from '../components/SidePanel';

// --- Reusable UI Components ---

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) => (
    <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${enabled ? 'bg-rose-500 shadow-lg shadow-rose-100' : 'bg-gray-200'
            }`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
        />
    </button>
);

const Checkbox = ({ checked, onChange, label }: { checked: boolean; onChange: (val: boolean) => void; label: string }) => (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
        <div
            onClick={() => onChange(!checked)}
            className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${checked
                ? 'bg-rose-500 border-rose-500 shadow-md shadow-rose-100'
                : 'bg-white border-gray-200 group-hover:border-rose-300'
                }`}
        >
            {checked && <Check size={12} className="text-white" strokeWidth={4} />}
        </div>
        <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors uppercase tracking-widest">{label}</span>
    </label>
);

const InputGroup = ({ label, type = "text", placeholder, defaultValue, icon: Icon, className = "" }: any) => (
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
                defaultValue={defaultValue}
                placeholder={placeholder}
                className={`w-full bg-white border border-gray-200 text-sm font-bold text-gray-900 rounded-xl ${Icon ? 'pl-11 pr-4' : 'px-4'} py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400`}
            />
        </div>
    </div>
);

const SelectGroup = ({ label, options, defaultValue, icon: Icon, className = "" }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(options.find((o: any) => o.value === defaultValue) || options[0]);

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
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{selected.label}</span>
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
                                        setSelected(opt);
                                        setIsOpen(false);
                                    }}
                                    className={`px-4 py-3 text-[11px] font-black uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-between ${selected.value === opt.value ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900'}`}
                                >
                                    {opt.label}
                                    {selected.value === opt.value && <Check size={12} strokeWidth={3} />}
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

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
    <div className="border-b border-gray-100 pb-6 pr-32">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
        <p className="text-sm font-medium text-gray-400 mt-1">{description}</p>
    </div>
);

// --- Sections ---

const BusinessProfile = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <SectionHeader title="Business Profile" description="Manage your salon's core identity and contact information." />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Business Name" defaultValue="Lumière Salon Pro" icon={Settings} />
                    <InputGroup label="Display Name" defaultValue="Lumière" icon={Settings} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Email Address" defaultValue="contact@lumieresalon.com" icon={Mail} />
                    <InputGroup label="Phone Number" defaultValue="+91 98765 43210" icon={Smartphone} />
                </div>

                <InputGroup label="Website URL" defaultValue="https://lumieresalon.com" icon={Globe} />

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Address</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                            <MapPin size={16} />
                        </div>
                        <textarea
                            defaultValue="12th Main Road, Indiranagar, Bangalore, Karnataka, 560008"
                            rows={3}
                            className="w-full bg-white border border-gray-100 text-sm font-bold text-gray-900 rounded-xl pl-11 pr-4 py-3 shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400 resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="bg-gray-50 rounded-[30px] p-8 border border-gray-100/50 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2 hover:border-rose-200 transition-colors cursor-pointer group h-full max-h-64">
                    <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-300 group-hover:text-rose-500 transition-colors">
                        <Upload size={32} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Brand Logo</h3>
                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG (max. 2MB)</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const BusinessTiming = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <SectionHeader title="Business Timing" description="Set your weekly operating hours for appointments." />

            <div className="overflow-hidden">
                <div className="divide-y divide-gray-50">
                    {days.map((day) => (
                        <div key={day} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                            <div className="w-32">
                                <span className="text-sm font-bold text-gray-900">{day}</span>
                            </div>
                            <div className="flex items-center gap-4 flex-1 justify-center">
                                <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-700">09:00 AM</div>
                                <span className="text-gray-400 font-bold">-</span>
                                <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-700">09:00 PM</div>
                            </div>
                            <div className="w-20 flex justify-end">
                                <ToggleSwitch enabled={day !== 'Sunday'} onChange={() => { }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StaffSettings = ({ staffMembers, onAddStaff, onToggleStaff, onDeleteStaff, checkPermission }: any) => {
    const [activeTab, setActiveTab] = useState('members');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header Content with Tabs & Actions */}
            <div className="space-y-6">
                <SectionHeader title="Staff Management" description="Manage employees, roles, and access permissions." />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-2">
                    <div className="inline-flex bg-gray-50/50 border border-gray-100 p-1 rounded-[30px] items-center gap-1 h-11 shadow-inner">
                        {[
                            { id: 'members', label: 'Team Members' },
                            { id: 'roles', label: 'Roles' },
                            { id: 'permissions', label: 'Permissions' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-8 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center justify-center ${activeTab === tab.id
                                    ? 'bg-gray-900 text-white shadow-sm border border-gray-100'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center">
                        {activeTab === 'members' && (
                            <button onClick={() => checkPermission('staff_mgmt') && onAddStaff()} className="h-10 px-5 bg-rose-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 active:scale-95 transition-all shadow-lg shadow-rose-100 flex items-center gap-2 border border-rose-100">
                                <Plus size={12} /> Add Member
                            </button>
                        )}
                        {activeTab === 'roles' && (
                            <button onClick={() => checkPermission('staff_mgmt') && null} className="h-10 px-5 bg-rose-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 active:scale-95 transition-all shadow-lg shadow-rose-100 flex items-center gap-2 border border-rose-100">
                                <Plus size={12} /> Create Role
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {activeTab === 'members' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[20px] border border-gray-100 overflow-hidden shadow-sm min-h-[200px]">
                        {staffMembers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
                                <Users size={32} className="opacity-20 mb-2" />
                                <p className="text-xs font-bold">No staff members found.</p>
                            </div>
                        ) : (
                            staffMembers.map((staff: any) => (
                                <div key={staff.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 border border-gray-200">
                                            {staff.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{staff.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{staff.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <ToggleSwitch enabled={staff.is_active} onChange={() => onToggleStaff(staff)} />
                                        <button
                                            onClick={() => onDeleteStaff(staff.id)}
                                            className="text-gray-300 hover:text-rose-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'roles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                    {[
                        { title: 'Administrator', desc: 'Full access to all settings, financial data, and staff management.', icon: Shield, color: 'text-rose-500', bg: 'bg-rose-50' },
                        { title: 'Manager', desc: 'Can manage bookings, inventory, and view staff reports.', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { title: 'Receptionist', desc: 'Can handle bookings and point of sale only.', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { title: 'Staff / Stylist', desc: 'Can view personal schedule and client history.', icon: Scissors, color: 'text-amber-500', bg: 'bg-amber-50' }
                    ].map((role, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-[20px] p-6 transition-all">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 ${role.bg} ${role.color} rounded-xl`}>
                                    <role.icon size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{role.title}</h4>
                                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{role.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'permissions' && (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 animate-in fade-in bg-gray-50 rounded-[30px] border border-dashed border-gray-200">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Shield size={24} className="text-gray-300" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Permission Matrices</h3>
                    <p className="text-xs text-gray-500 max-w-xs">Granular permission controls are being optimized. This section will allow you to toggle specific feature access per role.</p>
                </div>
            )}
        </div>
    );
};

const TaxSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <SectionHeader title="Tax Configuration" description="Set up tax rules for services and products." />

        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup label="Tax Name" defaultValue="GST" icon={FileText} />
                <InputGroup label="Registration Number" defaultValue="29ABCDE1234F1Z5" icon={Receipt} />
                <SelectGroup
                    label="Tax Type"
                    defaultValue="Exclusive"
                    options={[
                        { label: 'Exclusive', value: 'Exclusive' },
                        { label: 'Inclusive', value: 'Inclusive' }
                    ]}
                />
            </div>

            <div>
                <h3 className="text-sm font-black text-gray-900 mb-4">Tax Rates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex-1">
                            <span className="text-xs font-bold text-gray-900 block">Standard Rate</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Services & Products</span>
                        </div>
                        <div className="w-24 relative">
                            <input type="text" defaultValue="18" className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2 text-right text-sm font-bold outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all" />
                            <span className="absolute right-8 top-1.5 text-gray-400 text-xs font-bold">%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex-1">
                            <span className="text-xs font-bold text-gray-900 block">Reduced Rate</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Essentials</span>
                        </div>
                        <div className="w-24 relative">
                            <input type="text" defaultValue="5" className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2 text-right text-sm font-bold outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all" />
                            <span className="absolute right-8 top-1.5 text-gray-400 text-xs font-bold">%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const AppointmentSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <SectionHeader title="Appointments" description="Configure booking rules, slots, and capacity." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-900">Booking Rules</h3>
                <div className="bg-white border border-gray-100 rounded-[20px] p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-700">Allow Online Booking</span>
                        <ToggleSwitch enabled={true} onChange={() => { }} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-700">Require Deposit</span>
                        <ToggleSwitch enabled={false} onChange={() => { }} />
                    </div>
                    <div className="pt-4 border-t border-gray-50">
                        <InputGroup label="Slot Interval (Minutes)" defaultValue="15" icon={Clock} />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-900">Cancellation Policy</h3>
                <div className="bg-white border border-gray-100 rounded-[20px] p-6 space-y-4">
                    <InputGroup label="Advance Notice (Hours)" defaultValue="24" icon={Clock} />
                    <InputGroup label="Cancellation Fee (%)" defaultValue="50" icon={Percent} />
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-bold text-gray-700">Auto-charge No Shows</span>
                        <ToggleSwitch enabled={true} onChange={() => { }} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ServiceSettings = ({ categories, services, onAddCategory, onAddService, onToggleService, onDeleteService, checkPermission }: any) => {
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(categories[0]?.id || null);

    useEffect(() => {
        if (!activeCategoryId && categories.length > 0) {
            setActiveCategoryId(categories[0].id);
        }
    }, [categories]);

    const activeCategory = categories.find((c: any) => c.id === activeCategoryId);
    const filteredServices = services.filter((s: any) => s.category === activeCategoryId);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <SectionHeader title="Services & Categories" description="Manage your service menu and categories." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white border border-gray-100 rounded-[30px] p-6 shadow-sm h-fit">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-gray-900">Categories</h3>
                        <button
                            onClick={() => checkPermission('inventory') && onAddCategory()}
                            className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {categories.map((cat: any) => (
                            <div
                                key={cat.id}
                                onClick={() => setActiveCategoryId(cat.id)}
                                className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${activeCategoryId === cat.id ? 'bg-gray-900 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                                <span className="text-xs font-bold">{cat.name}</span>
                                <span className="text-[9px] font-black opacity-60">
                                    {services.filter((s: any) => s.category === cat.id).length}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-gray-900">{activeCategory?.name || 'Services'} List</h3>
                        <button
                            onClick={() => checkPermission('inventory') && onAddService(activeCategoryId)}
                            className="text-[10px] font-bold text-white bg-gray-900 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2"
                        >
                            <Plus size={14} /> Add Service
                        </button>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-sm min-h-[200px]">
                        {filteredServices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
                                <Scissors size={32} className="opacity-20 mb-2" />
                                <p className="text-xs font-bold">No services in this category</p>
                            </div>
                        ) : (
                            filteredServices.map((service: any) => (
                                <div key={service.id} className="flex items-center justify-between p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{service.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> {service.duration_minutes} min</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><Receipt size={10} /> ₹{service.price}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <ToggleSwitch enabled={service.is_active} onChange={() => onToggleService(service)} />
                                        <button
                                            onClick={() => onDeleteService(service.id)}
                                            className="text-gray-300 hover:text-rose-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const ReviewSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <SectionHeader title="Reviews & CXM" description="Manage review sources and customer feedback invites." />

        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Auto-Request Reviews</h3>
                    <p className="text-xs text-gray-500 mt-1">Automatically send review requests after appointments.</p>
                </div>
                <ToggleSwitch enabled={true} onChange={() => { }} />
            </div>

            <div className="h-[1px] bg-gray-50"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Google Review Link" placeholder="https://g.page/..." icon={Globe} />
                <InputGroup label="Facebook Page Link" placeholder="https://facebook.com/..." icon={Globe} />
            </div>

            <div className="pt-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Request Channels</h3>
                <div className="flex gap-6">
                    <Checkbox label="SMS" checked={true} onChange={() => { }} />
                    <Checkbox label="Email" checked={true} onChange={() => { }} />
                    <Checkbox label="WhatsApp" checked={false} onChange={() => { }} />
                </div>
            </div>
        </div>
    </div>
);

const PaymentsSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <SectionHeader title="Payments & Billing" description="Configure currency and payment methods." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-900">General</h3>
                <div className="grid grid-cols-2 gap-4">
                    <SelectGroup
                        label="Currency"
                        defaultValue="INR"
                        options={[
                            { label: 'INR (Indian Rupee)', value: 'INR' },
                            { label: 'USD (US Dollar)', value: 'USD' },
                            { label: 'EUR (Euro)', value: 'EUR' },
                            { label: 'GBP (British Pound)', value: 'GBP' },
                        ]}
                    />
                    <SelectGroup
                        label="Symbol"
                        defaultValue="₹"
                        options={[
                            { label: '₹ (Rupee)', value: '₹' },
                            { label: '$ (Dollar)', value: '$' },
                            { label: '€ (Euro)', value: '€' },
                            { label: '£ (Pound)', value: '£' },
                        ]}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-900">Payment Modes</h3>
                <div className="bg-white border border-gray-100 rounded-[20px] p-2 space-y-1">
                    {['Cash', 'Credit Card', 'UPI / Digital Wallet', 'Bank Transfer'].map((mode, i) => (
                        <div key={mode} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                    <Receipt size={14} />
                                </div>
                                <span className="text-sm font-bold text-gray-700">{mode}</span>
                            </div>
                            <ToggleSwitch enabled={true} onChange={() => { }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const WhatsAppSettings = ({ tenant, onChange, onSave }: any) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <SectionHeader
            title="WhatsApp Integration"
            description="Configure your Meta Cloud API credentials to send automated invoices."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <SectionHeader
                    title="API Credentials"
                    description="Enter your Meta Developer Portal details."
                />
                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Phone Number ID</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                                <Smartphone size={16} />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-200 text-sm font-bold text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400"
                                placeholder="e.g. 973829469154477"
                                value={tenant?.whatsapp_phone_number_id || ''}
                                onChange={(e) => onChange({ whatsapp_phone_number_id: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">WhatsApp Business Account ID</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                                <Briefcase size={16} />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-200 text-sm font-bold text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400"
                                placeholder="e.g. 958608430158931"
                                value={tenant?.whatsapp_business_account_id || ''}
                                onChange={(e) => onChange({ whatsapp_business_account_id: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Permanent Access Token</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/12 mt-4 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                                <Lock size={16} />
                            </div>
                            <textarea
                                className="w-full bg-white border border-gray-200 text-sm font-bold text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400 min-h-[100px]"
                                placeholder="Paste your Meta Access Token here..."
                                value={tenant?.whatsapp_access_token || ''}
                                onChange={(e) => onChange({ whatsapp_access_token: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-rose-50 rounded-3xl p-8 border border-rose-100">
                    <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText size={16} /> Template Configuration
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Invoice Template Name</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                                    <MessageCircle size={16} />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-200 text-sm font-bold text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="invoice_notification"
                                    value={tenant?.whatsapp_invoice_template || ''}
                                    onChange={(e) => onChange({ whatsapp_invoice_template: e.target.value })}
                                />
                            </div>
                        </div>
                        <p className="text-[11px] font-medium text-rose-700 leading-relaxed">
                            Make sure this template is approved in your Meta WhatsApp Manager and includes a <b>Document Header</b> for sending PDF invoices.
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onSave}
                    className="w-full bg-rose-500 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-[12px] shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                >
                    <Save size={18} /> Update WhatsApp Settings
                </button>
            </div>
        </div>
    </div>
);


const NotificationSettings = () => {
    const [config, setConfig] = useState({
        bookings_email: true,
        bookings_sms: false,
        marketing_email: true,
        marketing_push: true
    });

    const toggle = (key: keyof typeof config) => setConfig(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <SectionHeader title="Business Notifications" description="Choose how you want to be notified." />

            <div className="overflow-hidden">
                <div className="divide-y divide-gray-50">
                    <div className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                <CalendarIcon size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">New Bookings</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Receive alerts for new appointment requests.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Email</span>
                                <ToggleSwitch enabled={config.bookings_email} onChange={() => toggle('bookings_email')} />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">SMS</span>
                                <ToggleSwitch enabled={config.bookings_sms} onChange={() => toggle('bookings_sms')} />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                                <SpeakerIcon size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Marketing & Tips</h3>
                                <p className="text-xs text-gray-500 mt-0.5">News, feature updates, and growth tips.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Email</span>
                                <ToggleSwitch enabled={config.marketing_email} onChange={() => toggle('marketing_email')} />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Push</span>
                                <ToggleSwitch enabled={config.marketing_push} onChange={() => toggle('marketing_push')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const CalendarIcon = ({ size }: any) => <Settings size={size} />;
const SpeakerIcon = ({ size }: any) => <Bell size={size} />;


const Configuration: React.FC = () => {
    const { checkPermission } = usePlan();
    const [activeSection, setActiveSection] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    // Services & Categories State
    const [categories, setCategories] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    // Side Panel State
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [panelType, setPanelType] = useState<'category' | 'service' | 'staff'>('category');

    // Experience State
    const [staffMembers, setStaffMembers] = useState<any[]>([]);
    const [staffForm, setStaffForm] = useState({ name: '', role: 'Stylist', rating: '5.0' });

    // Tenant & WhatsApp State
    const [tenant, setTenant] = useState<any>(null);
    const [whatsappForm, setWhatsappForm] = useState({
        whatsapp_access_token: '',
        whatsapp_phone_number_id: '',
        whatsapp_business_account_id: '',
        whatsapp_invoice_template: 'invoice_notification'
    });

    // Form States
    const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
    const [serviceForm, setServiceForm] = useState({
        name: '',
        price: '',
        duration_minutes: '30',
        category: '',
        description: ''
    });

    useEffect(() => {
        if (activeSection === 'services') {
            fetchServicesAndCategories();
        } else if (activeSection === 'staff') {
            fetchStaffMembers();
        } else if (activeSection === 'whatsapp') {
            fetchTenantData();
        }
    }, [activeSection]);

    const fetchTenantData = async () => {
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            const res = await fetch('http://127.0.0.1:8000/api/tenant/my-tenant/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTenant(data);
                setWhatsappForm({
                    whatsapp_access_token: data.whatsapp_access_token || '',
                    whatsapp_phone_number_id: data.whatsapp_phone_number_id || '',
                    whatsapp_business_account_id: data.whatsapp_business_account_id || '',
                    whatsapp_invoice_template: data.whatsapp_invoice_template || 'invoice_notification'
                });
            }
        } catch (error) {
            console.error('Fetch tenant error:', error);
        }
    };

    const handleUpdateWhatsApp = async () => {
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        setIsSaving(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/tenant/my-tenant/', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(whatsappForm)
            });
            if (res.ok) {
                alert('WhatsApp settings updated successfully!');
                fetchTenantData();
            } else {
                alert('Failed to update WhatsApp settings.');
            }
        } catch (error) {
            console.error('Update WhatsApp error:', error);
            alert('Error updating WhatsApp settings.');
        } finally {
            setIsSaving(false);
        }
    };

    const fetchStaffMembers = async () => {
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            const res = await fetch('http://127.0.0.1:8000/api/experience/staff/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (res.ok) {
                setStaffMembers(await res.json());
            }
        } catch (error) {
            console.error('Fetch staff error:', error);
        }
    };

    const fetchServicesAndCategories = async () => {
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            const [catRes, svcRes] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/appointments/service-categories/', {
                    headers: { 'Authorization': `Token ${token} ` }
                }),
                fetch('http://127.0.0.1:8000/api/appointments/services/', {
                    headers: { 'Authorization': `Token ${token} ` }
                })
            ]);

            if (catRes.ok && svcRes.ok) {
                setCategories(await catRes.json());
                setServices(await svcRes.json());
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            const res = await fetch('http://127.0.0.1:8000/api/appointments/service-categories/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryForm)
            });
            if (res.ok) {
                setIsPanelOpen(false);
                setCategoryForm({ name: '', description: '' });
                fetchServicesAndCategories();
            }
        } catch (error) {
            console.error('Failed to add category:', error);
        }
    };

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            const res = await fetch('http://127.0.0.1:8000/api/appointments/services/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...serviceForm,
                    price: parseFloat(serviceForm.price),
                    duration_minutes: parseInt(serviceForm.duration_minutes)
                })
            });
            if (res.ok) {
                setIsPanelOpen(false);
                setServiceForm({ name: '', price: '', duration_minutes: '30', category: '', description: '' });
                fetchServicesAndCategories();
            }
        } catch (error) {
            console.error('Failed to add service:', error);
        }
    };

    const handleToggleService = async (service: any) => {
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            await fetch(`http://127.0.0.1:8000/api/appointments/services/${service.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_active: !service.is_active })
            });
            fetchServicesAndCategories();
        } catch (error) {
            console.error('Toggle error:', error);
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            await fetch(`http://127.0.0.1:8000/api/appointments/services/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${token}` }
            });
            fetchServicesAndCategories();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            const res = await fetch('http://127.0.0.1:8000/api/experience/staff/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(staffForm)
            });
            if (res.ok) {
                setIsPanelOpen(false);
                setStaffForm({ name: '', role: 'Stylist', rating: '5.0' });
                fetchStaffMembers();
            }
        } catch (error) {
            console.error('Failed to add staff:', error);
        }
    };

    const handleToggleStaff = async (staff: any) => {
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            await fetch(`http://127.0.0.1:8000/api/experience/staff/${staff.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_active: !staff.is_active })
            });
            fetchStaffMembers();
        } catch (error) {
            console.error('Toggle staff error:', error);
        }
    };

    const handleDeleteStaff = async (id: string) => {
        if (!confirm('Are you sure you want to delete this staff member?')) return;
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            await fetch(`http://127.0.0.1:8000/api/experience/staff/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${token}` }
            });
            fetchStaffMembers();
        } catch (error) {
            console.error('Delete staff error:', error);
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 2000);
    };

    const MENU_ITEMS = [
        { id: 'profile', label: 'Business Profile', icon: Settings },
        { id: 'timing', label: 'Business Timing', icon: Clock },
        { id: 'staff', label: 'Staff Configuration', icon: Users },
        { id: 'tax', label: 'Tax Configuration', icon: Percent },
        { id: 'services', label: 'Services & Menu', icon: Scissors },
        { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
        { id: 'marketing', label: 'Marketing', icon: Bell },
        { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'reviews', label: 'Reviews & CXM', icon: MessageCircle },
    ];

    return (
        <div className="w-full flex flex-col md:flex-row gap-8 animate-in fade-in duration-700">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0 space-y-6">
                <nav className="space-y-1">
                    {MENU_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-[30px] transition-all duration-300 group ${activeSection === item.id
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className={activeSection === item.id ? 'text-rose-400' : 'text-gray-400 group-hover:text-gray-600'} />
                                <span className="text-xs font-bold">{item.label}</span>
                            </div>
                            {activeSection === item.id && (
                                <ChevronRight size={14} className="text-gray-500" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-[4] lg:flex-[5] bg-white rounded-[30px] border border-gray-100 shadow-sm p-8 min-h-[600px] relative">
                {/* Top Actions */}
                {!['invoice', 'services'].includes(activeSection) && (
                    <div className="absolute top-8 right-8 z-10">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isSaving
                                ? 'bg-emerald-500 text-white w-28 justify-center'
                                : 'bg-rose-500 text-white hover:bg-rose-600 w-24 justify-center'
                                }`}
                        >
                            {isSaving ? (
                                <>
                                    <Check size={14} /> Saved
                                </>
                            ) : (
                                <>
                                    <Save size={14} /> Save
                                </>
                            )}
                        </button>
                    </div>
                )}
                {activeSection === 'profile' && <BusinessProfile />}
                {activeSection === 'timing' && <BusinessTiming />}
                {activeSection === 'staff' && (
                    <StaffSettings
                        staffMembers={staffMembers}
                        onAddStaff={() => {
                            setPanelType('staff');
                            setIsPanelOpen(true);
                        }}
                        onToggleStaff={handleToggleStaff}
                        onDeleteStaff={handleDeleteStaff}
                        checkPermission={checkPermission}
                    />
                )}
                {activeSection === 'tax' && <TaxSettings />}
                {activeSection === 'services' && (
                    <ServiceSettings
                        categories={categories}
                        services={services}
                        onAddCategory={() => {
                            setPanelType('category');
                            setIsPanelOpen(true);
                        }}
                        onAddService={(catId: any) => {
                            setPanelType('service');
                            setServiceForm(prev => ({ ...prev, category: catId || categories[0]?.id || '' }));
                            setIsPanelOpen(true);
                        }}
                        onToggleService={handleToggleService}
                        onDeleteService={handleDeleteService}
                        checkPermission={checkPermission}
                    />
                )}
                {activeSection === 'appointments' && <AppointmentSettings />}
                {activeSection === 'notifications' && <NotificationSettings />}
                {activeSection === 'whatsapp' && (
                    <WhatsAppSettings
                        tenant={whatsappForm}
                        onChange={(updates: any) => setWhatsappForm(prev => ({ ...prev, ...updates }))}
                        onSave={handleUpdateWhatsApp}
                    />
                )}
                {activeSection === 'payments' && <PaymentsSettings />}
                {activeSection === 'reviews' && <ReviewSettings />}

                {['invoice'].includes(activeSection) && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center">
                            <FileText size={24} className="text-gray-300" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">Module Loading</h3>
                        <p className="text-xs text-gray-500 max-w-xs">Settings for {activeSection} will be available shortly.</p>
                    </div>
                )}
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={panelType === 'category' ? 'New Category' : panelType === 'staff' ? 'New Staff Member' : 'New Service'}
                subtitle={panelType === 'category' ? 'Organize your service menu' : panelType === 'staff' ? 'Add a new team member' : 'Add a service to your menu'}
                footer={
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsPanelOpen(false)}
                            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={panelType === 'category' ? handleAddCategory : panelType === 'staff' ? handleAddStaff : handleAddService}
                            className="px-8 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50"
                        >
                            {panelType === 'category' ? 'Save Category' : panelType === 'staff' ? 'Save Staff' : 'Save Service'}
                        </button>
                    </div>
                }
            >
                {panelType === 'category' ? (
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Category Name</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
                                placeholder="e.g., Haircuts"
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Description (Optional)</label>
                            <textarea
                                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300 resize-none min-h-[100px]"
                                placeholder="Tell us about this category..."
                                value={categoryForm.description}
                                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                            />
                        </div>
                    </div>
                ) : panelType === 'staff' ? (
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Staff Name</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
                                placeholder="e.g., Alice Cooper"
                                value={staffForm.name}
                                onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Role</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
                                    placeholder="Stylist"
                                    value={staffForm.role}
                                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Default Rating</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="1.0"
                                    max="5.0"
                                    className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
                                    placeholder="5.0"
                                    value={staffForm.rating}
                                    onChange={(e) => setStaffForm({ ...staffForm, rating: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Service Name</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
                                placeholder="e.g., Classic Haircut"
                                value={serviceForm.name}
                                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Price (₹)</label>
                                <input
                                    type="number"
                                    className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
                                    placeholder="0.00"
                                    value={serviceForm.price}
                                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Duration (min)</label>
                                <input
                                    type="number"
                                    className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
                                    placeholder="30"
                                    value={serviceForm.duration_minutes}
                                    onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                            <div className="flex bg-[#f5f6fa] p-1 gap-1 flex-wrap">
                                {categories.map((cat: any) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setServiceForm({ ...serviceForm, category: cat.id })}
                                        className={`flex-1 whitespace-nowrap py-2.5 px-3 text-[8px] font-black uppercase tracking-widest transition-all ${serviceForm.category === cat.id ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                            <textarea
                                className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300 resize-none min-h-[100px]"
                                placeholder="Describe the service..."
                                value={serviceForm.description}
                                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                            />
                        </div>
                    </div>
                )}
            </SidePanel>
        </div>
    );
};

export default Configuration;
