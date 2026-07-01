import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Building2, Phone, MapPin, FileText, Upload, ArrowRight, Check, Loader2, ChevronRight, ChevronLeft, Image } from 'lucide-react';
import { MultiSelect } from '../components/MultiSelect';
import { CustomSelect } from '../components/CustomSelect';
import { useNavigate, Link } from 'react-router-dom';
import salonBg from '../assets/luxury-salon-bg.png';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',

        salonName: '',
        phone: '',
        address: '',
        industryType: [] as string[],
        clienteleType: 'UNISEX',
        businessLogo: null,
        gstFile: null,
        panFile: null,
        businessProof: null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const token = localStorage.getItem('vora_token');
        if (token) {
            navigate('/app');
        }
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
            if (errors[fieldName]) {
                setErrors(prev => ({ ...prev, [fieldName]: '' }));
            }
        }
    };

    const validateStep = (currentStep: number) => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
            if (!formData.email.trim()) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        }

        if (currentStep === 2) {
            if (!formData.salonName.trim()) newErrors.salonName = 'Business Name is required';
            if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
            if (!formData.address.trim()) newErrors.address = 'Address is required';
        }

        if (currentStep === 3) {
            if (!formData.panFile) newErrors.panFile = 'Company PAN Card is required';
            if (!formData.businessProof) newErrors.businessProof = 'Business Address Proof is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }

        return isValid;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step < 3) return;

        setIsLoading(true);
        setErrors({});

        try {
            const fd = new FormData();
            fd.append('fullName', formData.fullName);
            fd.append('email', formData.email);
            fd.append('password', formData.password);
            fd.append('salonName', formData.salonName);
            fd.append('phone', formData.phone);
            fd.append('address', formData.address);
            fd.append('clienteleType', formData.clienteleType);

            // Handle industryType array
            formData.industryType.forEach(industry => {
                fd.append('industryType', industry);
            });

            // Files
            if (formData.businessLogo) fd.append('businessLogo', formData.businessLogo);
            if (formData.gstFile) fd.append('gstFile', formData.gstFile);
            if (formData.panFile) fd.append('panFile', formData.panFile);
            if (formData.businessProof) fd.append('businessProof', formData.businessProof);

            const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
                method: 'POST',
                body: fd
            });

            const data = await response.json();

            if (response.ok) {
                // Store auth data
                localStorage.setItem('vora_token', data.token);
                localStorage.setItem('vora_user', JSON.stringify(data.user));
                localStorage.setItem('vora_tenant', JSON.stringify(data.tenant));

                setIsLoading(false);
                setIsSuccess(true);

                // Navigate after success animation
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setIsLoading(false);
                setErrors(data);
            }
        } catch (error) {
            setIsLoading(false);
            setErrors({ submit: 'Registration failed. Please try again.' });
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.fullName ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-gray-100'} rounded-[30px] text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all hover:bg-gray-50/80`}
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.email ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-gray-100'} rounded-[30px] text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all hover:bg-gray-50/80`}
                                    placeholder="Email Address"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.password ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-gray-100'} rounded-[30px] text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all hover:bg-gray-50/80`}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                    </div>
                );
            case 2:
                return (
                    <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest ml-1">Business Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Building2 className="h-4 w-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="salonName"
                                    required
                                    value={formData.salonName}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.salonName ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-gray-100'} rounded-[30px] text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all hover:bg-gray-50/80`}
                                    placeholder="Vora Enterprises"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest ml-1">Phone Number</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.phone ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-gray-100'} rounded-[30px] text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all hover:bg-gray-50/80`}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest ml-1">Business Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex pt-3.5 pointer-events-none">
                                    <MapPin className="h-4 w-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.address ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-gray-100'} rounded-[30px] text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all hover:bg-gray-50/80`}
                                    placeholder="123 Fashion Street, City"
                                />
                            </div>
                        </div>

                        {/* Industry & Clientele Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest ml-1">Industry Type</label>
                                <MultiSelect
                                    options={[
                                        { value: 'SALON', label: 'Hair Salon' },
                                        { value: 'BARBER', label: 'Barber Shop' },
                                        { value: 'NAIL', label: 'Nail Salon' },
                                        { value: 'SPA', label: 'Spa & Wellness' },
                                        { value: 'CLINIC', label: 'Aesthetic Clinic' },
                                        { value: 'MEDSPA', label: 'Medical Spa' },
                                        { value: 'MAKEUP', label: 'Makeup Studio' },
                                        { value: 'LASH', label: 'Lash & Brow Studio' },
                                        { value: 'OTHER', label: 'Other' },
                                    ]}
                                    selected={typeof formData.industryType === 'string' ? [formData.industryType] : formData.industryType}
                                    onChange={(val) => setFormData(prev => ({ ...prev, industryType: val }))}
                                    placeholder="Select Industries..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest ml-1">Clientele</label>
                                <CustomSelect
                                    options={[
                                        { value: 'UNISEX', label: 'Unisex' },
                                        { value: 'MEN', label: 'Men Only' },
                                        { value: 'WOMEN', label: 'Women Only' },
                                        { value: 'KIDS', label: 'Kids Only' },
                                    ]}
                                    value={formData.clienteleType}
                                    onChange={(val) => setFormData(prev => ({ ...prev, clienteleType: val }))}
                                    placeholder="Select Clientele..."
                                />
                            </div>
                        </div>

                        {/* Business Logo Upload (Optional) */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest ml-1">
                                Business Logo <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    id="businessLogo"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'businessLogo')}
                                />
                                <label
                                    htmlFor="businessLogo"
                                    className="flex items-center justify-between w-full p-3.5 bg-gray-50 border border-gray-100 border-dashed rounded-[30px] cursor-pointer hover:bg-gray-100 transition-all group-hover:border-rose-300"
                                >
                                    <div className="flex items-center gap-3 pl-2">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-rose-500 transition-colors">
                                            <Image size={14} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                                            {/* @ts-ignore */}
                                            {formData.businessLogo ? formData.businessLogo.name : 'Choose logo image...'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider pr-2">Upload</span>
                                </label>
                            </div>
                            <p className="text-[10px] text-gray-500 ml-1">Upload your business logo if you have one. PNG, JPG accepted.</p>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                            <p className="text-xs text-rose-800 font-medium leading-relaxed">
                                To verify your business, we need a few documents. Your data is secure with us.
                            </p>
                        </div>

                        {[
                            { id: 'gst', label: 'GST Certificate (Optional)', name: 'gstFile' },
                            { id: 'pan', label: 'Company PAN Card', name: 'panFile' },
                            { id: 'proof', label: 'Business Address Proof', name: 'businessProof' }
                        ].map((doc) => (
                            <div key={doc.id} className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest ml-1">{doc.label}</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        id={doc.id}
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, doc.name)}
                                    />
                                    <label
                                        htmlFor={doc.id}
                                        className={`flex items-center justify-between w-full p-3.5 bg-gray-50 border ${errors[doc.name] ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-gray-100'} border-dashed rounded-[30px] cursor-pointer hover:bg-gray-100 transition-all group-hover:border-rose-300`}
                                    >
                                        <div className="flex items-center gap-3 pl-2">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-rose-500 transition-colors">
                                                <Upload size={14} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                                                {/* @ts-ignore */}
                                                {formData[doc.name] ? formData[doc.name].name : 'Choose file...'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider pr-2">Upload</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen overflow-hidden w-full flex bg-white font-sans selection:bg-rose-100 selection:text-rose-900">
            {/* Left Side - Visual & Branding (Same as Login) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden h-full">
                <div className="absolute inset-0">
                    <img
                        src={salonBg}
                        alt="Luxury Business Interior"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30 mix-blend-multiply"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-[#1e1b4b]/50 to-[#581c87]/50 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 text-white">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-white rounded-[0.8rem] flex items-center justify-center shadow-2xl backdrop-blur-xl bg-opacity-10 border border-white/10">
                            <div className="w-5 h-5 bg-gradient-to-tr from-white to-rose-400 rounded-[0.3rem] rotate-45 shadow-lg"></div>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Vora</span>
                    </div>

                    <div className="max-w-md space-y-6">
                        <h1 className="text-5xl font-medium leading-tight tracking-tight">
                            Join the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-rose-400">Elite Network</span>
                            <br /> of Businesses.
                        </h1>
                        <p className="text-sm text-gray-300 font-medium leading-relaxed">
                            Start your journey with Vora today. Setup your business in minutes and grow exponentially.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs font-bold text-white">
                                    {i}
                                </div>
                            ))}
                        </div>
                        <p>Join 2000+ businesses</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 h-full flex flex-col bg-white relative">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto w-full flex flex-col items-center p-8 sm:p-12 lg:p-24 pb-32">
                    <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-[0.2rem] rotate-45"></div>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">Vora</span>
                    </div>

                    <div className="w-full max-w-sm space-y-8">
                        <div className="space-y-2 text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-medium text-gray-400">
                                <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                                <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                                <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 3 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                                <span className="ml-2 text-xs uppercase tracking-widest font-bold text-gray-400">Step {step} of 3</span>
                            </div>
                        </div>

                        <form id="registration-form" onSubmit={handleSubmit} className="space-y-8"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (step < 3) handleNext();
                                    else handleSubmit(e);
                                }
                            }}
                        >
                            {renderStepContent()}
                        </form>

                        <p className="text-center text-xs font-medium text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-gray-900 hover:text-rose-500 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Fixed Bottom Action Bar */}
                <div className="p-6 bg-white border-t border-gray-100 w-full flex justify-center sticky bottom-0 z-10">
                    <div className="w-full max-w-sm flex items-center gap-3">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-4 rounded-[30px] text-[11px] font-bold uppercase tracking-widest text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                key="next-btn"
                                type="button"
                                onClick={handleNext}
                                className="flex-1 flex justify-center items-center py-4 px-4 rounded-[30px] text-[11px] font-bold text-white bg-gray-900 hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <span>Next Step</span>
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                key="submit-btn"
                                type="submit"
                                form="registration-form"
                                disabled={isLoading || isSuccess}
                                className={`flex-1 flex justify-center items-center py-4 px-4 rounded-[30px] text-[12px] font-bold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed ${isSuccess ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'}`}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : isSuccess ? (
                                    <div className="flex items-center gap-2">
                                        <Check className="h-5 w-5" />
                                        <span>Registered!</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Complete Registration</span>
                                    </div>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
