

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    BarChart3,
    ArrowRight,
    CheckCircle2,
    Zap,
    Shield,
    Globe,
    Play,
    ChevronRight,
    Smartphone,
    Search,
    Star,
    XCircle
} from 'lucide-react';
import salonBg from '../assets/luxury-salon-bg.png';
import feature1 from '../assets/landingpage/feature-1.png';
import feature2 from '../assets/landingpage/feature-2.png';
import feature3 from '../assets/landingpage/feature-3.png';
import feature4 from '../assets/landingpage/feature-4.png';
import mockup1 from '../assets/landingpage/mockup1.jpg';
import mockup2 from '../assets/landingpage/mockup2.jpg';

const Landing = () => {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isYearly, setIsYearly] = useState(false);
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('vora_token');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer for section detection
    useEffect(() => {
        const sections = document.querySelectorAll('section[id]');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-20% 0px -80% 0px',
                threshold: 0
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    // Helper function to check if link is active
    const isActive = (path: string) => location.pathname === path;

    // Smooth scroll handler
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <>
            {/* Custom Animations */}
            <style>{`
                @keyframes float-left-tilt {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }

                @keyframes float-right-tilt {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0) translateX(-50%); }
                    50% { transform: translateY(-10px) translateX(-50%); }
                }
            `}</style>

            <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-rose-100 selection:text-rose-900">
                {/* Navigation - Adaptive */}
                <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-4' : 'bg-transparent py-6'}`}>
                    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors ${scrolled ? 'bg-gray-900' : 'bg-white/10 backdrop-blur-sm border border-white/20'}`}>
                                <div className="w-5 h-5 bg-gradient-to-tr from-white to-rose-400 rounded-[0.3rem] rotate-45 shadow-lg"></div>
                            </div>
                            <span className={`text-2xl font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>Vora</span>
                        </div>

                        {/* Menu Capsule */}
                        <div className={`hidden md:flex items-center gap-1 px-2 py-2 rounded-full backdrop-blur-md transition-all ${scrolled ? 'bg-gray-100/80 border border-gray-200' : 'bg-white/10 border border-white/20'}`}>
                            <Link
                                to="/"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${(isActive('/') && activeSection === 'home') || (location.pathname === '/' && activeSection === 'home')
                                    ? (scrolled ? 'bg-white text-gray-900 shadow-sm' : 'bg-white/30 text-white')
                                    : (scrolled ? 'text-gray-700 hover:bg-white hover:text-gray-900' : 'text-white/90 hover:bg-white/20 hover:text-white')
                                    }`}
                            >
                                Home
                            </Link>
                            <a
                                href="#features"
                                onClick={(e) => handleSmoothScroll(e, 'features')}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeSection === 'features'
                                    ? (scrolled ? 'bg-white text-gray-900 shadow-sm' : 'bg-white/30 text-white')
                                    : (scrolled ? 'text-gray-700 hover:bg-white hover:text-gray-900' : 'text-white/90 hover:bg-white/20 hover:text-white')
                                    }`}
                            >
                                Features
                            </a>
                            <a
                                href="#pricing"
                                onClick={(e) => handleSmoothScroll(e, 'pricing')}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeSection === 'pricing'
                                    ? (scrolled ? 'bg-white text-gray-900 shadow-sm' : 'bg-white/30 text-white')
                                    : (scrolled ? 'text-gray-700 hover:bg-white hover:text-gray-900' : 'text-white/90 hover:bg-white/20 hover:text-white')
                                    }`}
                            >
                                Pricing
                            </a>
                            <Link
                                to="/contact"
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive('/contact')
                                    ? (scrolled ? 'bg-white text-gray-900 shadow-sm' : 'bg-white/30 text-white')
                                    : (scrolled ? 'text-gray-700 hover:bg-white hover:text-gray-900' : 'text-white/90 hover:bg-white/20 hover:text-white')
                                    }`}
                            >
                                Contact
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to={isLoggedIn ? "/app" : "/login"} className={`px-5 py-2.5 text-sm font-bold rounded-full backdrop-blur-md transition-all ${scrolled ? 'bg-gray-100/80 border border-gray-200 text-gray-900 hover:bg-gray-200' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}>
                                Sign In
                            </Link>
                            <Link to={isLoggedIn ? "/app" : "/register"} className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all ${scrolled ? 'bg-gray-900 text-white hover:bg-black' : 'bg-white text-gray-900 hover:bg-gray-100'}`}>
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Dark Hero Section (Based on Login/Register Design) */}
                <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={salonBg}
                            alt="Luxury Business Interior"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30 mix-blend-multiply"></div>
                    </div>

                    {/* Animated Background Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-rose-900/30 mix-blend-overlay"></div>

                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
                        <h1 className="text-4xl md:text-7xl font-medium tracking-tight leading-tight mb-8 text-white animate-in slide-in-from-bottom-8 duration-700 fade-in delay-150">
                            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-rose-400">Elite Network</span>
                            <br /> of Businesses
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed mb-12 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-300 font-light">
                            Start your journey with Vora today. Setup your business in minutes, <br className="hidden md:block" />
                            streamline operations, and grow exponentially.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-500 mb-16">
                            <Link to={isLoggedIn ? "/app" : "/register"} className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-full transition-all flex items-center gap-2 group">
                                Start Free Trial
                            </Link>
                            <Link to={isLoggedIn ? "/app" : "/login"} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-bold rounded-full transition-all backdrop-blur-sm flex items-center gap-2">
                                <Play size={14} fill="currentColor" /> Live Demo
                            </Link>
                        </div>

                        {/* Social Proof */}
                        <div className="flex flex-col items-center gap-4 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-700">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-gray-900 bg-gray-800 flex items-center justify-center text-xs font-bold text-white shadow-lg overflow-hidden">
                                        <div className={`w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center`}>
                                            {i === 5 ? '2K+' : <Users size={16} className="text-gray-400" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-gray-400">Trusted by <span className="text-white font-bold">2000+ top businesses</span> worldwide.</p>
                        </div>
                    </div>
                </section>

                {/* Content Sections with Unified Background Gradient */}
                <div className="bg-gradient-to-b from-rose-50 via-white to-rose-50/10">
                    {/* Features Section */}
                    <section id="features" className="py-24 text-gray-900 overflow-hidden relative">
                        {/* Background Glows (Subtler for Light Theme) */}
                        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-white/30 rounded-full blur-[120px] -ml-32 mix-blend-overlay"></div>
                        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-[120px] -mr-32 mix-blend-multiply"></div>

                        <div className="max-w-7xl mx-auto px-6 relative z-10">
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4" style={{ fontWeight: '500' }}>Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-rose-600">run your business</span></h2>
                                <p className="text-gray-600">
                                    Powerful features tailored for modern service businesses.
                                </p>
                            </div>

                            <div className="flex flex-col gap-12">
                                {[
                                    {
                                        image: feature1,
                                        title: "Customer Intelligence",
                                        description: "Deep dive into client lifetime value with comprehensive customer profiles, engagement tracking, and retention analytics. Understand your customers better with detailed insights into their preferences, visit history, and spending patterns.",
                                        highlight: "68% Retention Rate"
                                    },
                                    {
                                        image: feature2,
                                        title: "Smart Scheduling",
                                        description: "Manage and schedule client bookings effortlessly with an intuitive calendar interface. View daily, weekly, or monthly schedules at a glance, minimize gaps, and maximize staff utilization with intelligent appointment management.",
                                        highlight: "Reduce gaps by 30%"
                                    },
                                    {
                                        image: feature3,
                                        title: "Billing & Finance",
                                        description: "Manage invoices, payments, and financial growth with real-time revenue tracking. Monitor outstanding payments, track growth trends, and analyze payment methods to optimize your business's financial health.",
                                        highlight: "Track every rupee"
                                    },
                                    {
                                        image: feature4,
                                        title: "Growth Center",
                                        description: "Scale your salon with targeted outreach campaigns. Create, schedule, and track marketing campaigns with detailed performance analytics including open rates, engagement, and conversion metrics to drive repeat business.",
                                        highlight: "72% Open Rate"
                                    }
                                ].map((feature, idx) => (
                                    <div key={idx} className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                        {/* Image Side */}
                                        <div className="w-full md:w-1/2">
                                            <div className="relative group perspective-1000">
                                                {/* Browser Window Styling (Light Theme optimized) */}
                                                <div className="relative rounded-[30px] overflow-hidden border border-gray-200 bg-white transition-all duration-500 transform">
                                                    {/* Browser Toolbar */}
                                                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-4">
                                                        <div className="flex gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                                                            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                                                        </div>
                                                        {/* Fake Address Bar */}
                                                        <div className="flex-1 bg-white rounded-[30px] h-6 flex items-center justify-center text-[10px] text-gray-500 font-mono border border-gray-200 shadow-sm">
                                                            vora.app/{feature.title.toLowerCase().replace(/\s+/g, '-')}
                                                        </div>
                                                    </div>
                                                    <img src={feature.image} alt={feature.title} className="w-full h-auto" />

                                                    {/* Reflection Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
                                                </div>

                                                {/* Backdrop Glow */}
                                            </div>
                                        </div>

                                        {/* Content Side */}
                                        <div className="w-full md:w-1/2">
                                            <div className={`flex flex-col items-start ${idx % 2 === 1 ? 'md:items-end md:text-right' : ''}`}>
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[10px] font-bold text-rose-600 mb-4 uppercase tracking-wider">
                                                    {feature.highlight}
                                                </div>
                                                <h3 className="text-2xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                                                <p className="text-gray-500 text-base leading-relaxed mb-6">
                                                    {feature.description}
                                                </p>
                                                <Link to={isLoggedIn ? "/app" : "/register"} className="text-rose-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all group hover:text-rose-700">
                                                    Learn more <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Customer App Showcase */}
                    <section className="py-24 pt-1 relative overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-rose-100/40 rounded-full blur-[150px] -mr-32"></div>
                        <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-white/50 rounded-full blur-[150px] -ml-32"></div>

                        <div className="max-w-7xl mx-auto px-6 relative z-10">
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4" style={{ fontWeight: '500' }}>
                                    Delight your customers with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-rose-600">premium marketplace</span>
                                </h2>
                                <p className="text-gray-600">
                                    Give your customers a seamless booking experience with our beautiful mobile app. Browse services, book appointments, and manage memberships all in one place.
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                                {/* iPhone Mockup 1 */}
                                <div className="relative group">
                                    {/* Animated Glow Ring */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-[3rem] blur-3xl opacity-20 transition-opacity duration-500"></div>

                                    {/* iPhone Frame */}
                                    <div className="relative w-[240px] md:w-[280px]">
                                        {/* Phone Shadow */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-gray-400/20 to-gray-600/30 rounded-[3rem] blur-2xl transform translate-y-8 scale-95"></div>

                                        {/* Phone Body (Titanium Finish) */}
                                        <div className="relative bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-300 rounded-[3rem] p-[2px] shadow-2xl transition-all duration-700">
                                            <div className="bg-black rounded-[2.9rem] p-1.5 pt-2">
                                                {/* Screen */}
                                                <div className="bg-white rounded-[2.4rem] overflow-hidden relative border-[1px] border-black/10">
                                                    {/* Dynamic Island */}
                                                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10 flex items-center justify-end px-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"></div>
                                                    </div>

                                                    {/* Screenshot */}
                                                    <img
                                                        src={mockup1}
                                                        alt="Customer Marketplace"
                                                        className="w-full h-auto"
                                                    />

                                                    {/* Screen Shine/Reflection */}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-40 pointer-events-none"></div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Floating Label */}
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-full shadow-xl border border-gray-100 whitespace-nowrap z-20">
                                        <p className="text-sm font-bold text-gray-900 tracking-tight">Discover Services</p>
                                    </div>
                                </div>

                                {/* iPhone Mockup 2 */}
                                <div className="relative group mt-12 md:mt-0">
                                    {/* Animated Glow Ring */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-[3rem] blur-3xl opacity-20 transition-opacity duration-500"></div>

                                    {/* iPhone Frame */}
                                    <div className="relative w-[240px] md:w-[280px]">
                                        {/* Phone Shadow */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-gray-400/20 to-gray-600/30 rounded-[3rem] blur-2xl transform translate-y-8 scale-95"></div>

                                        {/* Phone Body (Titanium Finish) */}
                                        <div className="relative bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-300 rounded-[3rem] p-[2px] shadow-2xl transition-all duration-700">
                                            <div className="bg-black rounded-[2.9rem] p-1.5 pt-2">
                                                {/* Screen */}
                                                <div className="bg-white rounded-[2.4rem] overflow-hidden relative border-[1px] border-black/10">
                                                    {/* Dynamic Island */}
                                                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10 flex items-center justify-end px-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"></div>
                                                    </div>

                                                    {/* Screenshot */}
                                                    <img
                                                        src={mockup2}
                                                        alt="Salon Details"
                                                        className="w-full h-auto"
                                                    />

                                                    {/* Screen Shine/Reflection */}
                                                    <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/10 to-transparent opacity-40 pointer-events-none"></div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Floating Label */}
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-full shadow-xl border border-gray-100 whitespace-nowrap z-20">
                                        <p className="text-sm font-bold text-gray-900 tracking-tight">Book Instantly</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Highlights */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl mx-auto">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Smart Discovery</h4>
                                    <p className="text-sm text-gray-600">Find nearby salons with intelligent search and filters</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Easy Booking</h4>
                                    <p className="text-sm text-gray-600">Book services, packages, and memberships in seconds</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Star className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Premium Experience</h4>
                                    <p className="text-sm text-gray-600">Beautiful interface designed for modern customers</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section id="pricing" className="py-24 pt-0 px-6 relative overflow-hidden">
                        {/* Subtle Background Glows */}
                        < div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-100/30 rounded-full blur-[120px] -z-10" ></div >

                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="text-center max-w-2xl mx-auto mb-16">
                                <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4 text-gray-900" style={{ fontWeight: '500' }}>Plans as <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-rose-600">polished</span> as your brand</h2>
                                <p className="text-gray-600">
                                    Performance-driven pricing built for the next generation.
                                    Transform your business with zero hidden fees.
                                </p>
                            </div>

                            {/* Pricing Toggle (Pill Style) */}
                            <div className="flex justify-center mb-16">
                                <div className="relative bg-gray-50 border border-gray-200/50 p-1 rounded-full flex items-center w-72 h-14 overflow-hidden">
                                    {/* Sliding Highlight Block */}
                                    <div
                                        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-(4px))] bg-white rounded-full shadow-md shadow-gray-200/50 transition-transform duration-300 ease-in-out ${isYearly ? 'translate-x-full' : 'translate-x-0'}`}
                                    />

                                    <button
                                        onClick={() => setIsYearly(false)}
                                        className={`relative flex-1 h-full flex items-center justify-center text-sm font-medium transition-colors duration-300 z-10 ${!isYearly ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Monthly
                                    </button>

                                    <button
                                        onClick={() => setIsYearly(true)}
                                        className={`relative flex-1 h-full flex items-center justify-center text-sm font-medium transition-colors duration-300 z-10 ${isYearly ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            Yearly
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-[15px] font-bold transition-colors ${isYearly ? 'bg-rose-50 text-rose-600' : 'bg-rose-50/50 text-rose-500/70'}`}>
                                                Save 5%
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
                                {/* Free */}
                                <div className="p-8 bg-gradient-to-br from-white to-rose-50/20 rounded-[30px] border border-rose-100 relative transition-transform flex flex-col h-full">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                                    <p className="text-sm text-gray-500 mb-6 font-normal min-h-[40px]">Essential tools for solo beginners to start growing.</p>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-4xl font-semibold text-gray-900">₹0</span>
                                    </div>
                                    <Link to={isLoggedIn ? "/app" : "/register"} className="block w-full py-3 px-4 bg-white border border-rose-100 hover:bg-rose-50 text-rose-600 font-bold text-center rounded-[30px] transition-colors mb-8 text-sm">
                                        Get Started
                                    </Link>
                                    <ul className="space-y-4 text-[13px] text-gray-600">
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Basic Scheduling
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> In-app Notifications
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> 1 User Account
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> 25 Appts/mo
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> WhatsApp Alerts
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> Ultimate AI Assistant
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> Promo Campaigns
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> Sponsored In-App Ads
                                        </li>
                                    </ul>
                                </div>

                                {/* Professional (Featured) */}
                                <div className="p-8 bg-gradient-to-br from-white via-rose-50 to-rose-100/20 rounded-[30px] border border-rose-200 relative shadow-xl shadow-rose-200/20 transform lg:scale-105 z-10 flex flex-col h-full">
                                    <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-[15px] rounded-tr-[30px] uppercase tracking-widest">
                                        Most Popular
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional</h3>
                                    <p className="text-sm text-gray-500 mb-6 font-normal min-h-[40px]">Perfect for small business teams seeking growth.</p>
                                    <div className="flex flex-col mb-6">
                                        <div className="flex items-baseline gap-1 text-gray-900">
                                            <span className="text-4xl font-semibold">{isYearly ? '₹34,000' : '₹2,999'}</span>
                                            <span className="text-gray-500 text-sm">{isYearly ? '/yr' : '/mo'}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {isYearly ? 'Billed annually' : 'Billed monthly'}
                                        </span>
                                    </div>
                                    <Link to={isLoggedIn ? "/app" : "/register"} className="block w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold text-center rounded-[30px] transition-colors mb-8 text-sm shadow-rose-500/25">
                                        Most Popular
                                    </Link>
                                    <ul className="space-y-4 text-[13px] text-gray-600 font-normal">
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-600 shrink-0" /> <strong>Advanced Scheduling</strong>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-600 shrink-0" />
                                            <div className="flex items-center gap-1.5">
                                                <strong>WhatsApp Alerts</strong>
                                                <span className="text-[10px] text-gray-400 font-normal">(Tokens extra)</span>
                                            </div>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-600 shrink-0" /> 5 User Accounts
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-600 shrink-0" /> Unlimited Appts
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-600 shrink-0" /> Full CRM Tools
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-600 shrink-0" /> Team Management
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-600 shrink-0" /> Basic Reports
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-600 shrink-0" /> In-app Notifications
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> Ultimate AI Assistant
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> Promo Campaigns
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> Inventory Mgmt
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> Sponsored In-App Ads
                                        </li>
                                    </ul>
                                </div>

                                {/* Business */}
                                <div className="p-8 bg-gradient-to-br from-white to-rose-50/20 rounded-[30px] border border-rose-100 relative transition-transform flex flex-col h-full">
                                    <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-[15px] rounded-tr-[30px] uppercase tracking-widest">
                                        Best Value
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Business</h3>
                                    <p className="text-sm text-gray-500 mb-6 font-normal min-h-[40px]">Advanced features for high-volume service salons.</p>
                                    <div className="flex flex-col mb-6">
                                        <div className="flex items-baseline gap-1 text-gray-900">
                                            <span className="text-4xl font-semibold">{isYearly ? '₹51,000' : '₹4,499'}</span>
                                            <span className="text-gray-500 text-sm">{isYearly ? '/yr' : '/mo'}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {isYearly ? 'Billed annually' : 'Billed monthly'}
                                        </span>
                                    </div>
                                    <Link to={isLoggedIn ? "/app" : "/register"} className="block w-full py-3 px-4 bg-white border border-rose-100 hover:bg-rose-50 text-rose-600 font-bold text-center rounded-[30px] transition-colors mb-8 text-sm">
                                        Choose Business
                                    </Link>
                                    <ul className="space-y-4 text-[13px] text-gray-600">
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> <strong>Smart AI Scheduling</strong>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> <strong>Promo Campaigns</strong>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Memberships & Loyalty
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> 15 User Accounts
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Inventory Mgmt
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Advanced Analytics
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Unlimited Appts
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" />
                                            <div className="flex items-center gap-1.5">
                                                WhatsApp Alerts
                                                <span className="text-[10px] text-gray-400 font-normal">(Tokens extra)</span>
                                            </div>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Staff Performance
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Priority Support
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Team Management
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> In-app Notifications
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> Sponsored In-App Ads
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> Whitelabel Mobile App
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> Multi-Center Integration
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-400">
                                            <XCircle size={16} className="text-gray-300 shrink-0" /> Ultimate AI Assistant
                                        </li>
                                    </ul>
                                </div>

                                {/* Enterprise */}
                                <div className="p-8 bg-gradient-to-br from-white to-rose-50/20 rounded-[30px] border border-rose-100 relative transition-transform flex flex-col h-full">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
                                    <p className="text-sm text-gray-500 mb-6 font-normal min-h-[40px]">Customized solutions for large chains & franchises.</p>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-4xl font-semibold text-gray-900">Custom</span>
                                    </div>
                                    <Link to={isLoggedIn ? "/app" : "/register"} className="block w-full py-3 px-4 bg-white border border-rose-100 hover:bg-rose-50 text-rose-600 font-bold text-center rounded-[30px] transition-colors mb-8 text-sm">
                                        Contact Sales
                                    </Link>
                                    <ul className="space-y-4 text-[13px] text-gray-600">
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> <strong>Sponsored In-App Ads</strong>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> <strong>Ultimate AI Assistant</strong>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Multi-Center App Integration
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Unlimited Users
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> WhatsApp & SMS Suite
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Custom API Access
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Whitelabel Mobile App
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Dedicated Manager
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Advanced Security
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Custom Reporting
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> VIP Support
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Promo Campaigns
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Smart AI Scheduling
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Inventory Management
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> Training & Onboarding
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" /> In-app Notifications
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Professional Footer */}
                < footer className="bg-black text-white py-12 px-6" >
                    <div className="max-w-7xl mx-auto">
                        {/* Main Footer Content */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12 pb-12 border-b border-white/10">
                            {/* Brand Column */}
                            <div className="col-span-2 md:col-span-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="relative w-8 h-8 bg-white rounded-[0.6rem] flex items-center justify-center">
                                        <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-black rounded-[0.2rem] rotate-45"></div>
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold tracking-tight" style={{ fontWeight: '500' }}>Vora</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                                    The modern platform for salon and spa management.
                                </p>
                            </div>

                            {/* Product Column */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-white/90">Product</h4>
                                <ul className="space-y-2.5 text-sm">
                                    <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                    <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Updates</a></li>
                                </ul>
                            </div>

                            {/* Company Column */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-white/90">Company</h4>
                                <ul className="space-y-2.5 text-sm">
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                                </ul>
                            </div>

                            {/* Resources Column */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-white/90">Resources</h4>
                                <ul className="space-y-2.5 text-sm">
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
                                </ul>
                            </div>

                            {/* Download Column */}
                            <div className="col-span-2 md:col-span-1">
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-white/90">Download</h4>
                                <div className="space-y-2.5">
                                    {/* App Store */}
                                    <a href="#" className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[30px] px-3 py-2 transition-all">
                                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                        </svg>
                                        <div className="text-left min-w-0">
                                            <div className="text-[8px] text-gray-500 uppercase tracking-wide leading-tight">Download on the</div>
                                            <div className="text-xs font-semibold text-white leading-tight">App Store</div>
                                        </div>
                                    </a>

                                    {/* Google Play */}
                                    <a href="#" className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[30px] px-3 py-2 transition-all">
                                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                        </svg>
                                        <div className="text-left min-w-0">
                                            <div className="text-[8px] text-gray-500 uppercase tracking-wide leading-tight">Get it on</div>
                                            <div className="text-xs font-semibold text-white leading-tight">Google Play</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-xs text-gray-500">
                                © 2026 Vora Systems Inc. All rights reserved.
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Legal Links */}
                                <div className="flex gap-6 text-xs text-gray-500">
                                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                                </div>

                                {/* Social Icons */}
                                <div className="flex gap-4">
                                    <a href="#" className="text-gray-500 hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-500 hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-500 hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer >
            </div >
        </>
    );
};

export default Landing;
