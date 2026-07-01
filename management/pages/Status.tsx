import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Clock, Activity } from 'lucide-react';

const Status = () => {
    const currentStatus = {
        status: 'operational',
        message: 'All Systems Operational',
        lastUpdated: 'Feb 13, 2026 at 6:00 PM IST'
    };

    const systems = [
        { name: 'API', status: 'operational', uptime: '99.99%' },
        { name: 'Dashboard', status: 'operational', uptime: '99.98%' },
        { name: 'Appointments', status: 'operational', uptime: '99.97%' },
        { name: 'Billing System', status: 'operational', uptime: '99.99%' },
        { name: 'Customer Portal', status: 'operational', uptime: '99.96%' },
        { name: 'Mobile App', status: 'operational', uptime: '99.95%' },
        { name: 'Notifications', status: 'operational', uptime: '99.94%' },
        { name: 'Reports & Analytics', status: 'operational', uptime: '99.98%' }
    ];

    const incidents = [
        {
            date: 'Feb 10, 2026',
            title: 'Scheduled Maintenance',
            description: 'Database optimization and performance improvements',
            status: 'resolved',
            duration: '2 hours'
        },
        {
            date: 'Feb 5, 2026',
            title: 'Minor API Slowdown',
            description: 'Temporary increase in API response times due to high traffic',
            status: 'resolved',
            duration: '45 minutes'
        },
        {
            date: 'Jan 28, 2026',
            title: 'Scheduled Maintenance',
            description: 'Security updates and system upgrades',
            status: 'resolved',
            duration: '3 hours'
        }
    ];

    const uptime = [
        { day: 'Mon', percentage: 100 },
        { day: 'Tue', percentage: 100 },
        { day: 'Wed', percentage: 99.8 },
        { day: 'Thu', percentage: 100 },
        { day: 'Fri', percentage: 100 },
        { day: 'Sat', percentage: 100 },
        { day: 'Sun', percentage: 100 }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return 'text-green-600 bg-green-100';
            case 'degraded':
                return 'text-yellow-600 bg-yellow-100';
            case 'outage':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'operational':
                return <CheckCircle2 className="w-5 h-5" />;
            case 'degraded':
                return <AlertCircle className="w-5 h-5" />;
            case 'outage':
                return <AlertCircle className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

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

            {/* Current Status Banner */}
            <section className="bg-gradient-to-br from-green-500 to-emerald-600 text-white py-16">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <CheckCircle2 className="w-12 h-12" />
                        <h1 className="text-5xl font-bold">{currentStatus.message}</h1>
                    </div>
                    <p className="text-white/90 text-lg">Last updated: {currentStatus.lastUpdated}</p>
                </div>
            </section>

            {/* Uptime Chart */}
            <section className="max-w-5xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl border border-gray-100 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-gray-700" />
                        <h2 className="text-2xl font-bold text-gray-900">7-Day Uptime</h2>
                    </div>
                    <div className="flex items-end gap-4 h-48">
                        {uptime.map((day, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-gray-100 rounded-lg overflow-hidden flex-1 flex items-end">
                                    <div
                                        className={`w-full rounded-t-lg transition-all ${day.percentage === 100 ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}
                                        style={{ height: `${day.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-medium text-gray-600">{day.day}</span>
                                <span className="text-xs text-gray-500">{day.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Systems Status */}
            <section className="max-w-5xl mx-auto px-6 pb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">System Status</h2>
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
                    {systems.map((system, index) => (
                        <div key={index} className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${getStatusColor(system.status)}`}>
                                    {getStatusIcon(system.status)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{system.name}</h3>
                                    <p className="text-sm text-gray-500">Uptime: {system.uptime}</p>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-green-600 capitalize">{system.status}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Incident History */}
            <section className="max-w-5xl mx-auto px-6 pb-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Incidents</h2>
                <div className="space-y-4">
                    {incidents.map((incident, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-gray-100 p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{incident.title}</h3>
                                    <p className="text-sm text-gray-500">{incident.date}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    Resolved
                                </span>
                            </div>
                            <p className="text-gray-600 mb-2">{incident.description}</p>
                            <p className="text-sm text-gray-500">Duration: {incident.duration}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Subscribe */}
            <section className="max-w-5xl mx-auto px-6 pb-20">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-gray-300 mb-8 text-lg">Subscribe to get notified about system updates and incidents</p>
                    <div className="flex gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                        <button className="px-6 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Status;
