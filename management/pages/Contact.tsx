import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('contact');
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo(0, 0);

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '', company: '', message: '' });
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const isActive = (path: string) => location.pathname === path;

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

    const handleNavigateToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        // Navigate to home page, then scroll to section after a brief delay
        navigate('/');
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navigation - Same as Landing Page */}
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
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${scrolled ? 'text-gray-700 hover:bg-white hover:text-gray-900' : 'text-white/90 hover:bg-white/20 hover:text-white'}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/#features"
                            onClick={(e) => handleNavigateToSection(e, 'features')}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${scrolled ? 'text-gray-700 hover:bg-white hover:text-gray-900' : 'text-white/90 hover:bg-white/20 hover:text-white'}`}
                        >
                            Features
                        </Link>
                        <Link
                            to="/#pricing"
                            onClick={(e) => handleNavigateToSection(e, 'pricing')}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${scrolled ? 'text-gray-700 hover:bg-white hover:text-gray-900' : 'text-white/90 hover:bg-white/20 hover:text-white'}`}
                        >
                            Pricing
                        </Link>
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
                        <Link to="/login" className={`px-5 py-2.5 text-sm font-bold rounded-full backdrop-blur-md transition-all ${scrolled ? 'bg-gray-100/80 border border-gray-200 text-gray-900 hover:bg-gray-200' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}>
                            Sign In
                        </Link>
                        <Link to="/register" className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all ${scrolled ? 'bg-gray-900 text-white hover:bg-black' : 'bg-white text-gray-900 hover:bg-gray-100'}`}>
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-rose-900"></div>

                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center py-32">
                    <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight mb-6 text-white">
                        Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-rose-400">Touch</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        {isSubmitted ? (
                            <div className="bg-green-50 border border-green-200 rounded-3xl p-12 text-center">
                                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-600">Thank you for contacting us. We'll get back to you soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                                            placeholder="Business Name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Tell us about your business and how we can help..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-rose-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                                        <a href="mailto:support@vora.com" className="text-gray-600 hover:text-rose-500 transition-colors">
                                            support@vora.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                                        <a href="tel:+918012345678" className="text-gray-600 hover:text-rose-500 transition-colors">
                                            +91 80 1234 5678
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Office</h4>
                                        <p className="text-gray-600">
                                            Bangalore, Karnataka<br />
                                            India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-6">
                            <h4 className="font-semibold text-gray-900 mb-3">Business Hours</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Monday - Friday</span>
                                    <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Saturday</span>
                                    <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sunday</span>
                                    <span className="font-medium text-gray-900">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Professional Footer */}
            <footer className="bg-black text-white py-12 px-6">
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
                                <li><Link to="/#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                                <li><Link to="/#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
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
                                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
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
                                <a href="#" className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[30px] px-3 py-2 transition-all">
                                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    <div className="text-left min-w-0">
                                        <div className="text-[8px] text-gray-500 uppercase tracking-wide leading-tight">Download on the</div>
                                        <div className="text-xs font-semibold text-white leading-tight">App Store</div>
                                    </div>
                                </a>
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
                            <div className="flex gap-6 text-xs text-gray-500">
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            </div>

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
            </footer>
        </div>
    );
};

export default Contact;
