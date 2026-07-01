
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import salonBg from '../assets/luxury-salon-bg.png';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.52 12.29C23.52 11.43 23.44 10.6 23.3 9.81H12V14.45H18.45C18.17 15.93 17.32 17.18 16.05 18.03V21.01H19.92C22.18 18.93 23.52 15.86 23.52 12.29Z" fill="#4285F4" />
        <path d="M12 24C15.24 24 17.96 22.92 19.92 21.01L16.05 18.03C14.97 18.75 13.59 19.18 12 19.18C8.87 19.18 6.22 17.07 5.27 14.23H1.27V17.33C3.21 21.18 7.3 24 12 24Z" fill="#34A853" />
        <path d="M5.27 14.23C5.03 13.37 4.90001 12.46 4.90001 11.53C4.90001 10.59 5.03 9.68 5.27 8.81V5.72H1.27C0.46 7.42 0 9.39 0 11.53C0 13.67 0.46 15.63 1.27 17.33L5.27 14.23Z" fill="#FBBC05" />
        <path d="M12 3.88C13.76 3.88 15.34 4.49 16.58 5.68L19.99 2.27C17.95 0.37 15.23 0 12 0C7.3 0 3.21 2.82 1.27 6.67L5.27 9.77C6.22 6.93 8.87 3.88 12 3.88Z" fill="#EA4335" />
    </svg>
);

const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-apple" viewBox="0 0 16 16">
        <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
        <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
    </svg>
);

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        const token = localStorage.getItem('vora_token');
        if (token) {
            navigate('/app');
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password })
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
                setErrors({ submit: data.error || 'Invalid Credentials' });
            }
        } catch (error) {
            setIsLoading(false);
            setErrors({ submit: 'Service Unavailable. Please try again.' });
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-sans selection:bg-rose-100 selection:text-rose-900">
            {/* Left Side - Visual & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={salonBg}
                        alt="Luxury Business Interior"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30 mix-blend-multiply"></div>
                </div>

                {/* Animated Background Gradients (Subtle Overlay) */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-[#1e1b4b]/50 to-[#581c87]/50 mix-blend-overlay"></div>

                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                {/* Content Overlay */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 text-white">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-white rounded-[0.8rem] flex items-center justify-center shadow-2xl backdrop-blur-xl bg-opacity-10 border border-white/10">
                            <div className="w-5 h-5 bg-gradient-to-tr from-white to-rose-400 rounded-[0.3rem] rotate-45 shadow-lg"></div>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Vora</span>
                    </div>

                    {/* Main Text */}
                    <div className="max-w-md space-y-6">
                        <h1 className="text-5xl font-medium leading-tight tracking-tight">
                            Manage your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-rose-400">Bussiness Empire</span>
                            <br /> like a Pro.
                        </h1>
                        <p className="text-sm text-gray-300 font-medium leading-relaxed">
                            Streamline appointments, manage inventory, and grow your business with AI-powered insights.
                        </p>
                    </div>

                    {/* Social Proof / Footer */}
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs font-bold text-white">
                                    {i}
                                </div>
                            ))}
                        </div>
                        <p>Trusted by 2000+ businesses</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
                {/* Mobile Logo (Visible only on small screens) */}
                <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-[0.2rem] rotate-45"></div>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">Vora</span>
                </div>

                <div className="w-full max-w-sm space-y-10">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
                        <p className="text-[12px] font-medium text-gray-400">Manage your business with Vora.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {errors.submit && (
                            <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-[11px] font-bold text-rose-500 animate-in fade-in slide-in-from-top-2 duration-300">
                                {errors.submit}
                            </div>
                        )}
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-[30px] text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all hover:bg-gray-50/80"
                                        placeholder="Email"
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
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-11 py-3.5 bg-gray-50 border border-gray-100 rounded-[30px] text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all hover:bg-gray-50/80"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-rose-500 focus:ring-rose-500 border-gray-300 rounded cursor-pointer accent-rose-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-gray-500 cursor-pointer select-none">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-xs font-bold">
                                <a href="#" className="text-rose-500 hover:text-rose-600 hover:underline transition-all">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isSuccess}
                            className={`w-full flex justify-center items-center py-4 px-4 rounded-[30px] text-[12px] font-bold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none ${isSuccess ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
                                }`}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : isSuccess ? (
                                <div className="flex items-center gap-2 animate-in zoom-in spin-in-90 duration-300">
                                    <Check className="h-5 w-5" />
                                    <span>Success</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Sign in</span>
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[11px] font-bold">
                            <span className="bg-white px-3 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-100 rounded-[30px] hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 group">
                            <GoogleIcon />
                            <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-100 rounded-[30px] hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 group">
                            <AppleIcon />
                            <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">Apple</span>
                        </button>
                    </div>

                    <p className="text-center text-xs font-medium text-gray-400">
                        Don't have an account?{' '}
                        <a href="/register" className="font-bold text-gray-900 hover:text-rose-500 transition-colors">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
