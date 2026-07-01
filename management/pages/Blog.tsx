import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

const Blog = () => {
    const featuredPost = {
        title: 'The Future of Salon Management: AI and Automation',
        excerpt: 'Discover how artificial intelligence is transforming the beauty industry and helping salon owners streamline their operations.',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
        category: 'Industry Trends',
        date: 'Feb 10, 2026',
        readTime: '8 min read',
        author: 'Sarah Johnson'
    };

    const posts = [
        {
            title: '10 Tips to Boost Your Salon Revenue',
            excerpt: 'Learn proven strategies to increase your salon\'s profitability and attract more clients.',
            image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
            category: 'Business Growth',
            date: 'Feb 8, 2026',
            readTime: '5 min read'
        },
        {
            title: 'How to Build Customer Loyalty in Your Spa',
            excerpt: 'Discover effective techniques to turn first-time visitors into loyal, returning customers.',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
            category: 'Customer Experience',
            date: 'Feb 5, 2026',
            readTime: '6 min read'
        },
        {
            title: 'Managing Staff Schedules Like a Pro',
            excerpt: 'Master the art of staff scheduling to maximize productivity and employee satisfaction.',
            image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
            category: 'Operations',
            date: 'Feb 2, 2026',
            readTime: '7 min read'
        },
        {
            title: 'Social Media Marketing for Salons',
            excerpt: 'Effective strategies to grow your salon\'s online presence and attract new clients.',
            image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
            category: 'Marketing',
            date: 'Jan 30, 2026',
            readTime: '6 min read'
        },
        {
            title: 'Understanding Your Salon Analytics',
            excerpt: 'Learn how to read and use your business data to make informed decisions.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
            category: 'Analytics',
            date: 'Jan 28, 2026',
            readTime: '5 min read'
        },
        {
            title: 'Creating a Memorable Client Experience',
            excerpt: 'Small touches that make a big difference in how clients perceive your business.',
            image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80',
            category: 'Customer Experience',
            date: 'Jan 25, 2026',
            readTime: '4 min read'
        }
    ];

    const categories = ['All', 'Industry Trends', 'Business Growth', 'Customer Experience', 'Operations', 'Marketing', 'Analytics'];

    return (
        <div className="min-h-screen bg-white">
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

            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-50 to-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Vora Blog</h1>
                    <p className="text-xl text-gray-600">Insights, tips, and stories from the world of salon & spa management</p>
                </div>
            </section>

            {/* Categories */}
            <section className="border-b border-gray-100 sticky top-0 bg-white z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex gap-3 overflow-x-auto">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${index === 0
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-br from-rose-500 to-indigo-600 rounded-3xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-12 text-white flex flex-col justify-center">
                            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 w-fit">
                                {featuredPost.category}
                            </span>
                            <h2 className="text-4xl font-bold mb-4">{featuredPost.title}</h2>
                            <p className="text-white/90 text-lg mb-6">{featuredPost.excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-white/80 mb-6">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {featuredPost.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {featuredPost.readTime}
                                </span>
                            </div>
                            <button className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors w-fit">
                                Read Article
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="hidden md:block">
                            <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <article key={index} className="group cursor-pointer">
                            <div className="rounded-2xl overflow-hidden mb-4">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <Tag className="w-4 h-4 text-rose-500" />
                                <span className="text-sm font-medium text-rose-500">{post.category}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-rose-500 transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {post.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {post.readTime}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Blog;
