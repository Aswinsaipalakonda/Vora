import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Bell,
    Globe,
    Moon,
    LogOut,
    Check,
    Save,
    Camera,
    Briefcase,
    Award,
    Clock,
    Key,
    Smartphone,
    ChevronRight,
    Edit2
} from 'lucide-react';

// --- Reusable UI Components (Shared Style) ---

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${enabled ? 'bg-rose-500' : 'bg-gray-200'
            }`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
        />
    </button>
);

const InputGroup = ({ label, type = "text", placeholder, value, onChange, icon: Icon, className = "" }: any) => (
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
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-white border border-gray-200 text-sm font-bold text-gray-900 rounded-2xl ${Icon ? 'pl-11 pr-4' : 'px-4'} py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400`}
            />
        </div>
    </div>
);

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
    <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
        <p className="text-sm font-medium text-gray-400 mt-1">{description}</p>
    </div>
);

// --- Sections ---

const PersonalInfo = ({ data, onChange }: any) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <SectionHeader title="My Profile" description="Manage your personal information and public profile." />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-6 order-last lg:order-first">
                <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-full bg-rose-500 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl">
                            {data.first_name ? data.first_name.charAt(0) : 'U'}
                        </div>
                        <button className="absolute bottom-0 right-0 h-10 w-10 bg-gray-900 text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-black transition-colors shadow-md">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{data.first_name} {data.last_name}</h3>
                        <p className="text-xs font-bold text-rose-500 mt-1">Administrator</p>
                    </div>
                </div>

            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="First Name" value={data.first_name} onChange={(v: string) => onChange({ ...data, first_name: v })} icon={User} />
                    <InputGroup label="Last Name" value={data.last_name} onChange={(v: string) => onChange({ ...data, last_name: v })} icon={User} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Email Address" value={data.email} onChange={(v: string) => onChange({ ...data, email: v })} icon={Mail} />
                    <InputGroup label="Phone Number" value={data.profile.phone} onChange={(v: string) => onChange({ ...data, profile: { ...data.profile, phone: v } })} icon={Phone} />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-500">Bio</label>
                    <textarea
                        value={data.profile.bio}
                        onChange={(e) => onChange({ ...data, profile: { ...data.profile, bio: e.target.value } })}
                        rows={4}
                        className="w-full bg-white border border-gray-100 text-sm font-bold text-gray-900 rounded-2xl px-4 py-3 shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400 resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Location" value={data.profile.location} onChange={(v: string) => onChange({ ...data, profile: { ...data.profile, location: v } })} icon={MapPin} />
                    <InputGroup label="Birthday" value={data.profile.birthday} onChange={(v: string) => onChange({ ...data, profile: { ...data.profile, birthday: v } })} icon={Calendar} type="date" />
                </div>
            </div>
        </div>
    </div>
);

const SecuritySettings = ({ passwords, onPasswordChange, onSavePassword }: any) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <SectionHeader title="Security & Login" description="Manage your password and account security." />

        <div className="bg-white space-y-8">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-gray-900">Change Password</h3>
                    <button
                        onClick={onSavePassword}
                        className="px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-colors"
                    >
                        Update Password
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Current Password" type="password" placeholder="••••••••" value={passwords.current} onChange={(v: string) => onPasswordChange({ ...passwords, current: v })} icon={Key} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="New Password" type="password" placeholder="••••••••" value={passwords.new} onChange={(v: string) => onPasswordChange({ ...passwords, new: v })} icon={Key} />
                    <InputGroup label="Confirm Password" type="password" placeholder="••••••••" value={passwords.confirm} onChange={(v: string) => onPasswordChange({ ...passwords, confirm: v })} icon={Key} />
                </div>
            </div>

            <div className="h-[1px] bg-gray-100"></div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                        <Smartphone size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-500 mt-1">Secure your account with 2FA.</p>
                    </div>
                </div>
                <ToggleSwitch enabled={false} onChange={() => { }} />
            </div>

            <div className="h-[1px] bg-gray-100"></div>

            <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-900">Login History</h3>
                {[
                    { device: 'MacBook Pro', location: 'Bangalore, IN', time: 'Active now', icon: Globe },
                    { device: 'iPhone 13', location: 'Bangalore, IN', time: '2 hours ago', icon: Smartphone },
                ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
                                <session.icon size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">{session.device}</p>
                                <p className="text-[10px] text-gray-400 font-bold">{session.location} • {session.time}</p>
                            </div>
                        </div>
                        <button className="text-[10px] font-bold text-rose-500 hover:text-rose-600">
                            Log Out
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PreferencesSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <SectionHeader title="Preferences" description="Customize your personal notification and display settings." />

        <div className="bg-white space-y-8">
            <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-900">Notifications</h3>
                <div className="space-y-4">
                    {[
                        { title: 'Shift Reminders', desc: 'Get notified before your shift starts.' },
                        { title: 'New Assignments', desc: 'When a new booking is assigned to you.' },
                        { title: 'Performance Reports', desc: 'Weekly summary of your performance.' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <p className="text-xs font-bold text-gray-900">{item.title}</p>
                                <p className="text-[10px] text-gray-500 font-medium mt-0.5">{item.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Email</span>
                                <ToggleSwitch enabled={true} onChange={() => { }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-[1px] bg-gray-100"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-gray-900">Appearance</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <Moon size={16} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-900">Dark Mode</span>
                        </div>
                        <ToggleSwitch enabled={false} onChange={() => { }} />
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-gray-900">Regional</h3>
                    <InputGroup defaultValue="English (US)" icon={Globe} />
                </div>
            </div>
        </div>
    </div>
);


const Profile: React.FC = () => {
    const [activeSection, setActiveSection] = useState('info');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        profile: {
            phone: '',
            bio: '',
            location: '',
            birthday: '',
            avatar: null as string | null
        }
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            const res = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfileData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    profile: {
                        phone: data.profile?.phone || '',
                        bio: data.profile?.bio || '',
                        location: data.profile?.location || '',
                        birthday: data.profile?.birthday || '',
                        avatar: data.profile?.avatar || null
                    }
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            const res = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });
            if (res.ok) {
                const updatedData = await res.json();
                // Optionally refresh local state if backend returned transformed data
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
        } finally {
            setTimeout(() => setIsSaving(false), 1000);
        }
    };

    const handlePasswordChange = async () => {
        if (passwords.new !== passwords.confirm) {
            alert("Passwords don't match");
            return;
        }

        const token = localStorage.getItem('vora_token');
        if (!token) return;

        try {
            const res = await fetch('http://127.0.0.1:8000/api/auth/change-password/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    old_password: passwords.current,
                    new_password: passwords.new
                })
            });
            if (res.ok) {
                alert("Password changed successfully");
                setPasswords({ current: '', new: '', confirm: '' });
            } else {
                const data = await res.json();
                alert(data.error || "Failed to change password");
            }
        } catch (error) {
            console.error('Password change error:', error);
        }
    };

    const MENU_ITEMS = [
        { id: 'info', label: 'My Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: Bell },
        { id: 'activity', label: 'Activity Log', icon: Clock },
    ];

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Actions Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                    <div className="bg-white border border-gray-100 p-1 rounded-[30px] flex items-center gap-1 h-11 shadow-sm shrink-0">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`px-6 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center justify-center ${activeSection === item.id
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="h-10 px-5 rounded-full border border-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:border-gray-400 hover:text-gray-700 transition-all flex items-center gap-2 bg-white shrink-0">
                        <LogOut size={14} /> Log Out
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                        className={`flex items-center gap-2 px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg transition-all duration-300 shrink-0 ${isSaving
                            ? 'bg-emerald-500 text-white w-28 justify-center'
                            : 'bg-rose-500 text-white hover:bg-rose-600 w-24 justify-center'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-8 min-h-[600px] relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-[30px]">
                        <div className="h-8 w-8 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {activeSection === 'info' && <PersonalInfo data={profileData} onChange={setProfileData} />}
                        {activeSection === 'security' && (
                            <SecuritySettings
                                passwords={passwords}
                                onPasswordChange={setPasswords}
                                onSavePassword={handlePasswordChange}
                            />
                        )}
                        {activeSection === 'preferences' && <PreferencesSettings />}

                        {['schedule', 'activity'].includes(activeSection) && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in">
                                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center">
                                    <Clock size={24} className="text-gray-300" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">Coming Soon</h3>
                                <p className="text-xs text-gray-500 max-w-xs">The {activeSection} view will be available in the next update.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
