import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Search, ChevronRight, HelpCircle } from 'lucide-react';

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [popularArticles, setPopularArticles] = useState<any[]>([]);

    useEffect(() => {
        const fetchHelpData = async () => {
            const token = localStorage.getItem('vora_token');
            const headers = token ? { 'Authorization': `Token ${token}` } : {};

            try {
                const [catRes, popRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/support/faq-categories/', { headers }),
                    fetch('http://127.0.0.1:8000/api/support/faqs/popular/', { headers })
                ]);

                if (catRes.ok && popRes.ok) {
                    setCategories(await catRes.json());
                    setPopularArticles(await popRes.json());
                }
            } catch (error) {
                console.error('Failed to fetch help center data:', error);
            }
        };

        fetchHelpData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                            <div className="w-5 h-5 bg-gradient-to-tr from-rose-400 to-indigo-400 rounded-[0.3rem] rotate-45 shadow-lg"></div>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900">Vora</span>
                    </Link>
                    <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-rose-500 to-indigo-600 text-white py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-4">How can we help you?</h1>
                    <p className="text-xl text-white/90 mb-8">Search our knowledge base or browse categories below</p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for help articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-xl"
                        />
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => {
                        const IconComponent = (Icons as any)[category.icon] || Icons.HelpCircle;
                        // Strip 'bg-' and 'text-' prefixes if we use the backend's color field differently,
                        // or just use backend's exact class. HelpCenter previously used `category.color` like 'rose'
                        // Let's adapt it to use the new backend fields directly.
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer group"
                            >
                                <div className={`w-12 h-12 rounded-xl ${category.bg_color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <IconComponent className={`w-6 h-6 ${category.color}`} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">Learn more about {category.name}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{category.articles_count || 0} articles</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Popular Articles */}
            <section className="max-w-7xl mx-auto px-6 pb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Articles</h2>
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
                    {popularArticles.map((article, index) => (
                        <a
                            key={index}
                            href="#"
                            className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <HelpCircle className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-900 font-medium">{article.question}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                        </a>
                    ))}
                </div>
            </section>

            {/* Contact Support */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                    <p className="text-gray-300 mb-8 text-lg">Our support team is here to assist you</p>
                    <div className="flex gap-4 justify-center">
                        <button className="px-6 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors">
                            Contact Support
                        </button>
                        <button className="px-6 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors border border-white/20">
                            Schedule a Demo
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HelpCenter;
