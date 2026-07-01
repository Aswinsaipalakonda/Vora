import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Smile,
    Frown,
    Meh,
    MessageSquare,
    Star,
    Users,
    TrendingUp,
    Filter,
    Search,
    MoreHorizontal,
    ThumbsUp,
    AlertCircle,
    Share2,
    Reply,
    CheckCircle2,
    BarChart3,
    SlidersHorizontal,
    TrendingDown,
    Calendar,
    Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

const MetricHighlight = ({ label, value, trend, icon: Icon, color = 'emerald' }: any) => {
    const isNegative = trend.toString().startsWith('-');
    return (
        <div className="p-5 border border-white/5 shadow-xl flex flex-col group transition-all duration-300 rounded-[30px] relative overflow-hidden bg-gradient-to-br from-gray-900 via-[#1e1b4b] to-[#581c87]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <Icon size={18} className="text-white" />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${isNegative ? 'bg-rose-400/20 text-rose-300 border-rose-400/20' : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/20'}`}>
                    {trend}
                </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 relative z-10 text-indigo-200/60">{label}</p>
            <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-2xl font-black text-white">{value}</span>
            </div>
        </div>
    );
};

const API_EXPERIENCE_URL = 'http://127.0.0.1:8000/api/experience';

const DUMMY_STAFF = [
    { id: 1, name: 'Elena V.', role: 'Senior Stylist', rating: 4.9 },
    { id: 2, name: 'Marcus T.', role: 'Colorist', rating: 4.8 },
    { id: 3, name: 'Sarah L.', role: 'Massage Therapist', rating: 4.9 },
    { id: 4, name: 'David C.', role: 'Barber', rating: 4.6 },
];

const generateDummyReviews = () => {
    const reviews = [];
    const sentiments = ['positive', 'positive', 'positive', 'neutral', 'negative'];
    const names = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James', 'Isabella', 'Benjamin'];
    const texts = [
        "Absolutely wonderful experience. Will come back!",
        "The balayage looks incredible.",
        "Very relaxing massage.",
        "Wait time was 15 minutes, but service was good.",
        "Not happy with the styling, a bit messy.",
        "Best haircut I've had in years.",
        "Clean, professional, and friendly.",
        "Price is a bit high for the value.",
        "Excellent attention to detail.",
        "Loved the ambiance and the complimentary tea."
    ];

    for (let i = 0; i < 45; i++) {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 30));
        const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        const rating = sentiment === 'positive' ? (Math.random() > 0.5 ? 5 : 4) : (sentiment === 'neutral' ? 3 : (Math.random() > 0.5 ? 2 : 1));
        const staff = DUMMY_STAFF[Math.floor(Math.random() * DUMMY_STAFF.length)];

        reviews.push({
            id: i + 1,
            customer_name: names[Math.floor(Math.random() * names.length)],
            rating,
            text: texts[Math.floor(Math.random() * texts.length)],
            sentiment,
            created_at: d.toISOString(),
            is_replied: Math.random() > 0.6,
            staff: staff.id,
            staff_name: staff.name,
            tags_list: ['Service', Math.random() > 0.5 ? 'Ambiance' : 'Wait Time']
        });
    }
    return reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

const Experience: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'reviews' | 'analytics'>('reviews');
    const [filter, setFilter] = useState('all');
    const [reviews, setReviews] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        const token = localStorage.getItem('vora_token');
        if (!token) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            const [revRes, staffRes] = await Promise.all([
                fetch(`${API_EXPERIENCE_URL}/reviews/`, {
                    headers: { 'Authorization': `Token ${token}` }
                }),
                fetch(`${API_EXPERIENCE_URL}/staff/`, {
                    headers: { 'Authorization': `Token ${token}` }
                })
            ]);

            const reviewsData = revRes.ok ? await revRes.json() : [];
            const staffData = staffRes.ok ? await staffRes.json() : [];

            if (reviewsData.length === 0) {
                setReviews(generateDummyReviews());
                setStaffList(DUMMY_STAFF);
            } else {
                setReviews(reviewsData);
                setStaffList(staffData);
            }
        } catch (error) {
            console.error('Error fetching experience data:', error);
            setReviews(generateDummyReviews());
            setStaffList(DUMMY_STAFF);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const metrics = useMemo(() => {
        if (reviews.length === 0) return { nps: 0, avgRating: 0, responseRate: 0, resolved: 0 };

        const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        const repliedCount = reviews.filter(r => r.is_replied).length;
        const promos = reviews.filter(r => r.rating >= 4).length;
        const detractors = reviews.filter(r => r.rating <= 2).length;
        const npsValue = ((promos - detractors) / reviews.length) * 100;

        return {
            nps: Math.round(npsValue),
            avgRating: avg.toFixed(1),
            responseRate: Math.round((repliedCount / reviews.length) * 100),
            resolved: repliedCount
        };
    }, [reviews]);

    const sentimentBreakdown = useMemo(() => {
        if (reviews.length === 0) return { positive: 0, neutral: 0, negative: 0 };
        const pos = reviews.filter(r => r.sentiment === 'positive').length;
        const neu = reviews.filter(r => r.sentiment === 'neutral').length;
        const neg = reviews.filter(r => r.sentiment === 'negative').length;
        return {
            positive: Math.round((pos / reviews.length) * 100),
            neutral: Math.round((neu / reviews.length) * 100),
            negative: Math.round((neg / reviews.length) * 100)
        };
    }, [reviews]);

    const handleReplyReview = async (reviewId: number, replyText: string) => {
        const token = localStorage.getItem('vora_token');
        try {
            const response = await fetch(`${API_EXPERIENCE_URL}/reviews/${reviewId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    is_replied: true,
                    reply_text: replyText
                })
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error('Error replying to review:', error);
        }
    };

    const analyticsData = useMemo(() => {
        if (reviews.length === 0) return { trend: [], distribution: [] };

        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const trend = last7Days.map(date => {
            const dayReviews = reviews.filter(r => r.created_at.startsWith(date));
            return {
                name: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
                count: dayReviews.length,
                positive: dayReviews.filter(r => r.sentiment === 'positive').length,
                negative: dayReviews.filter(r => r.sentiment === 'negative').length,
            };
        });

        const distribution = [1, 2, 3, 4, 5].map(star => ({
            star: `${star} Star`,
            count: reviews.filter(r => r.rating === star).length
        }));

        return { trend, distribution };
    }, [reviews]);

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Customer Experience</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Monitor sentiment and manage feedback</p>
                </div>
                <div className="bg-white border border-gray-100 p-1 rounded-[30px] flex items-center gap-1 h-10 shadow-sm">
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-6 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reviews'
                            ? 'bg-gray-900 text-white shadow-lg'
                            : 'text-gray-400 hover:text-gray-900'
                            }`}
                    >
                        Reviews
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-6 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics'
                            ? 'bg-gray-900 text-white shadow-lg'
                            : 'text-gray-400 hover:text-gray-900'
                            }`}
                    >
                        Analytics
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricHighlight label="Net Promoter Score" value={metrics.nps} trend="+0" icon={Smile} />
                <MetricHighlight label="Average Rating" value={metrics.avgRating} trend="+0" icon={Star} />
                <MetricHighlight label="Response Rate" value={`${metrics.responseRate}%`} trend="+0" icon={MessageSquare} />
                <MetricHighlight label="Issues Resolved" value={metrics.resolved} trend="+0" icon={CheckCircle2} />
            </div>

            {/* Main Content */}
            {activeTab === 'reviews' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Reviews Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Feedback</h2>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-5 h-10 bg-white border border-gray-100 text-gray-700 rounded-[30px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                                    <SlidersHorizontal size={14} /> Filter
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center p-20">
                                    <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="p-20 text-center bg-white rounded-[30px] border border-gray-100">
                                    <MessageSquare className="mx-auto text-gray-200 mb-4" size={48} />
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No reviews found yet</p>
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review.id} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:border-gray-200 transition-all group relative overflow-hidden">
                                        {review.sentiment === 'negative' && (
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full -mr-8 -mt-8"></div>
                                        )}

                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${review.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-600' :
                                                    review.sentiment === 'negative' ? 'bg-rose-100 text-rose-600' :
                                                        'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {review.customer_name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900">{review.customer_name}</h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                                <span className="text-xs font-black text-gray-900">{review.rating}</span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 leading-relaxed mb-4 font-medium relative z-10">
                                            "{review.text}"
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                                            {review.tags_list?.map((tag: string, idx: number) => (
                                                <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                                                    {tag}
                                                </span>
                                            ))}
                                            {review.staff_name && (
                                                <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-bold text-indigo-500 uppercase tracking-wide">
                                                    Handled by {review.staff_name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 relative z-10">
                                            <div className="flex gap-4">
                                                <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors">
                                                    <ThumbsUp size={14} /> Helpful
                                                </button>
                                                <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors">
                                                    <Share2 size={14} /> Share
                                                </button>
                                            </div>
                                            {review.is_replied ? (
                                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                                    <CheckCircle2 size={14} /> Replied
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleReplyReview(review.id, 'Thank you for your feedback!')}
                                                    className="px-4 py-2 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
                                                >
                                                    <Reply size={12} /> Reply
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Analytics & Staff */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <BarChart3 size={16} className="text-indigo-600" /> Sentiment Breakdown
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                                        <span className="text-emerald-600">Positive</span>
                                        <span className="text-gray-900">{sentimentBreakdown.positive}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${sentimentBreakdown.positive}%` }}></div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                                        <span className="text-amber-600">Neutral</span>
                                        <span className="text-gray-900">{sentimentBreakdown.neutral}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${sentimentBreakdown.neutral}%` }}></div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                                        <span className="text-rose-600">Negative</span>
                                        <span className="text-gray-900">{sentimentBreakdown.negative}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${sentimentBreakdown.negative}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <TrendingUp size={16} className="text-indigo-600" /> Top Staff
                            </h3>
                            <div className="space-y-4">
                                {staffList.slice(0, 3).map((staff, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs border border-white shadow-sm">
                                                {staff.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">{staff.name}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{staff.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                            <Star size={10} className="text-emerald-500 fill-emerald-500" />
                                            <span className="text-[10px] font-black text-emerald-700">{staff.rating}</span>
                                        </div>
                                    </div>
                                ))}
                                {staffList.length === 0 && (
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center py-4">No staff data available</p>
                                )}
                            </div>
                            <button className="w-full mt-6 py-3 border border-gray-100 rounded-[20px] text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all">
                                View All Staff
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Sentiment Trend */}
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-50"></div>
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Sentiment Trend</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Review volume and sentiment over last 7 days</p>
                                </div>
                                <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                    <TrendingUp size={20} className="text-indigo-600" />
                                </div>
                            </div>
                            <div className="h-[300px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analyticsData.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                            <filter id="shadow" height="200%">
                                                <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#4f46e5" floodOpacity="0.2" />
                                            </filter>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                borderRadius: '24px',
                                                border: '1px solid #f1f5f9',
                                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                                padding: '12px 16px'
                                            }}
                                            itemStyle={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                            labelStyle={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" style={{ filter: 'url(#shadow)' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-50"></div>
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Rating Analysis</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Breakdown of star ratings across all reviews</p>
                                </div>
                                <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                                    <Star size={20} className="text-amber-500" />
                                </div>
                            </div>
                            <div className="h-[300px] w-full relative z-10 text-gray-900">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analyticsData.distribution} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="star" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} width={70} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                borderRadius: '24px',
                                                border: '1px solid #f1f5f9',
                                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                                padding: '12px 16px'
                                            }}
                                            itemStyle={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                        />
                                        <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={24}>
                                            {analyticsData.distribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index > 2 ? '#4f46e5' : '#cbd5e1'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Users size={16} className="text-indigo-600" /> Detailed Staff Performance
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-50">
                                            <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Team Member</th>
                                            <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reviews</th>
                                            <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating</th>
                                            <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sentiment</th>
                                            <th className="text-right py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {staffList.map((staff, i) => {
                                            const staffReviews = reviews.filter(r => r.staff === staff.id);
                                            const posCount = staffReviews.filter(r => r.sentiment === 'positive').length;
                                            return (
                                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-white shadow-sm">
                                                                {staff.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-900">{staff.name}</p>
                                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{staff.role}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-xs font-bold text-gray-600">{staffReviews.length} feedback</td>
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-1">
                                                            <Star size={12} className="text-amber-400 fill-amber-400" />
                                                            <span className="text-xs font-black text-gray-900">{staff.rating}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-emerald-500" style={{ width: staffReviews.length ? `${(posCount / staffReviews.length) * 100}%` : '0%' }}></div>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-emerald-600">{staffReviews.length ? Math.round((posCount / staffReviews.length) * 100) : 0}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        <button className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-full">Report</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Experience;
