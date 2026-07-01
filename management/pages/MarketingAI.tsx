
import React, { useState, useMemo, useEffect } from 'react';
import {
  Send, Sparkles, MessageSquare, Clock, Smartphone, ChevronRight, Zap, Users,
  Mail, Plus, Filter, MoreHorizontal, Calendar, Trash2, TrendingUp, Search,
  MousePointerClick, BarChart3, X, SlidersHorizontal, ArrowRight, Target, ChevronDown
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Campaign, Segment, SegmentCriteria, Package } from '../types';
import { SidePanel } from '../components/SidePanel';
import { usePlan } from '../components/PlanContext';

const API_BASE_URL = 'http://127.0.0.1:8000/api';


const MetricHighlight = ({ label, value, trend, icon: Icon }: any) => {
  const isNegative = trend.toString().startsWith('-');
  return (
    <div className={`p-5 border border-white/5 shadow-xl flex flex-col group transition-all cursor-pointer duration-300 rounded-[30px] relative overflow-hidden ${isNegative
      ? 'bg-gradient-to-br from-[#330a12] via-[#7f1d2e] to-[#330a12]'
      : 'bg-gradient-to-br from-gray-900 via-[#1e1b4b] to-[#581c87]'
      }`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
          <Icon size={18} className="text-white" />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${isNegative
          ? 'bg-rose-500/20 text-rose-200 border-rose-500/20'
          : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/20'
          }`}>{trend}</span>
      </div>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 relative z-10 ${isNegative ? 'text-rose-200/70' : 'text-indigo-200/60'}`}>{label}</p>
      <div className="flex items-baseline gap-2 relative z-10">
        <span className="text-2xl font-black text-white">{value}</span>
      </div>
    </div>
  );
};


const MarketingAI: React.FC = () => {
  const { checkPermission } = usePlan();
  const [activeTab, setActiveTab] = useState<'composer' | 'campaigns' | 'segments' | 'templates'>('campaigns');
  const [packageName, setPackageName] = useState('Essential Glow');
  const [tone, setTone] = useState('Elegant');
  const [generatedMsg, setGeneratedMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [campaignSearch, setCampaignSearch] = useState('');
  const [campaignFilter, setCampaignFilter] = useState<'All' | 'Sent' | 'Scheduled'>('All');
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  // Segment SidePanel State
  const [isSegmentPanelOpen, setIsSegmentPanelOpen] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [segmentRules, setSegmentRules] = useState<SegmentCriteria>({ minSpend: 0, minVisits: 0, lastCheckInDays: 0 });

  // Template SidePanel State
  const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState({ name: '', content: '', type: 'SMS' });

  const estimatedReach = useMemo(() => {
    let reach = 1200;
    if (segmentRules.minSpend && segmentRules.minSpend > 0) reach -= (segmentRules.minSpend / 100);
    if (segmentRules.minVisits && segmentRules.minVisits > 0) reach -= (segmentRules.minVisits * 50);
    if (segmentRules.lastCheckInDays && segmentRules.lastCheckInDays > 0) reach = Math.floor(reach * (segmentRules.lastCheckInDays / 365));
    return Math.max(12, Math.floor(reach));
  }, [segmentRules]);

  const fetchMarketingData = async () => {
    const token = localStorage.getItem('vora_token');
    const headers = { 'Authorization': `Token ${token}` };

    try {
      const campRes = await fetch(`${API_BASE_URL}/marketing/campaigns/`, { headers });
      if (campRes.ok) setCampaigns(await campRes.json());

      const segRes = await fetch(`${API_BASE_URL}/marketing/segments/`, { headers });
      if (segRes.ok) setSegments(await segRes.json());

      const packRes = await fetch(`${API_BASE_URL}/packages/packages/`, { headers });
      if (packRes.ok) setPackages(await packRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  useEffect(() => {
    if (packages.length > 0 && packageName === 'Essential Glow') {
      setPackageName(packages[0].name);
    }
  }, [packages, packageName]);

  const handleNewCampaign = () => {
    setActiveTab('composer');
  };

  const generateAIContent = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a professional marketing message for a Salon client about a package called "${packageName}". The tone should be "${tone}". Include a call to action. Keep it short.`,
      });
      setGeneratedMsg(response.text || 'Failed to generate message.');
    } catch (error) {
      setGeneratedMsg("Luxury awaits! Book our Essential Glow package today and shine like never before. Exclusive spots open.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSegment = async () => {
    const token = localStorage.getItem('vora_token');
    const newSegment = {
      name: segmentName,
      criteria: `${segmentRules.minSpend ? 'Spend > ₹' + segmentRules.minSpend : ''} ${segmentRules.minVisits ? 'Visits > ' + segmentRules.minVisits : ''}`.trim(),
      member_count: estimatedReach,
      rules: segmentRules
    };

    try {
      const res = await fetch(`${API_BASE_URL}/marketing/segments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSegment)
      });
      if (res.ok) {
        fetchMarketingData();
        setIsSegmentPanelOpen(false);
        setSegmentName('');
        setSegmentRules({ minSpend: 0, minVisits: 0, lastCheckInDays: 0 });
      }
    } catch (e) { console.error(e); }
  };

  const handleSaveTemplate = async () => {
    const token = localStorage.getItem('vora_token');
    try {
      const res = await fetch(`${API_BASE_URL}/marketing/templates/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: templateForm.name,
          content: templateForm.content,
          template_type: templateForm.type
        })
      });
      if (res.ok) {
        fetchMarketingData();
        setIsTemplatePanelOpen(false);
        setTemplateForm({ name: '', content: '', type: 'SMS' });
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            Growth Center
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scale your salon with targeted outreach</p>
        </div>
        <div className="flex bg-white p-1 rounded-[30px] border border-gray-100 shadow-sm overflow-x-auto scrollbar-hide">
          {(['composer', 'campaigns', 'segments', 'templates'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm space-y-6">
              <div className="space-y-5">
                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Service Focus</label>
                  <button
                    onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[20px] px-5 h-12 text-sm font-bold text-left flex items-center justify-between hover:bg-white hover:border-gray-200 transition-all text-gray-900"
                  >
                    {packageName}
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isServiceDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isServiceDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[20px] shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                      {packages.length === 0 ? (
                        <div className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest italic">No packages found</div>
                      ) : packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => { setPackageName(pkg.name); setIsServiceDropdownOpen(false); }}
                          className="w-full text-left px-5 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition-colors border-b border-gray-50 last:border-0"
                        >
                          {pkg.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Brand Tone</label>
                  <div className="grid grid-cols-3 gap-2 bg-gray-50/50 p-1 rounded-[24px] border border-gray-100/50 h-10 items-center">
                    {['Elegant', 'Energetic', 'Urgent'].map(t => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`h-full rounded-[20px] text-[9px] font-black uppercase tracking-widest transition-all ${tone === t ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 h-10 rounded-[24px] bg-white border border-gray-100 text-gray-600 font-black text-[9px] uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">
                    <Smartphone size={14} /> SMS
                  </button>
                  <button className="flex items-center justify-center gap-2 h-10 rounded-[24px] bg-white border border-gray-100 text-gray-600 font-black text-[9px] uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">
                    <Mail size={14} /> Email
                  </button>
                </div>
              </div>

              <button
                onClick={() => checkPermission('marketing') && generateAIContent()}
                disabled={loading}
                className="w-full h-12 bg-rose-500 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? 'Consulting Vora AI...' : <><Sparkles size={16} /> Generate Creative</>}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-4 lg:pt-0">
            {/* iPhone 14 Pro Max - Space Black Frame without outer glow */}
            <div className="relative flex-shrink-0 mx-auto group" style={{ width: '290px', height: '628px' }}>

              {/* Volume / Side Buttons */}
              {/* Silent Switch */}
              <div className="absolute rounded-r-sm transition-all duration-300" style={{ left: '-3px', top: '110px', width: '4px', height: '26px', background: '#3a3a3a', boxShadow: '1px 0 0 #222, 2px 0 0 #555', zIndex: 1 }}></div>
              {/* Vol Up */}
              <div className="absolute rounded-r-sm transition-all duration-300" style={{ left: '-3px', top: '155px', width: '4px', height: '56px', background: '#3a3a3a', boxShadow: '1px 0 0 #222, 2px 0 0 #555', zIndex: 1 }}></div>
              {/* Vol Down */}
              <div className="absolute rounded-r-sm transition-all duration-300" style={{ left: '-3px', top: '225px', width: '4px', height: '56px', background: '#3a3a3a', boxShadow: '1px 0 0 #222, 2px 0 0 #555', zIndex: 1 }}></div>
              {/* Power Button */}
              <div className="absolute rounded-l-sm transition-all duration-300" style={{ right: '-3px', top: '175px', width: '4px', height: '80px', background: '#3a3a3a', boxShadow: '-1px 0 0 #222, -2px 0 0 #555', zIndex: 1 }}></div>

              {/* Phone Body - Space Black */}
              <div
                className="relative w-full h-full flex flex-col transition-transform duration-500"
                style={{
                  background: 'linear-gradient(160deg, #2e2e30 0%, #1c1c1e 40%, #0e0e0f 100%)',
                  borderRadius: '50px',
                  border: '2px solid #4a4a4c',
                  padding: '8px',
                  zIndex: 2
                }}
              >
                {/* Screen Bezel */}
                <div
                  className="relative flex-1 overflow-hidden flex flex-col"
                  style={{
                    background: '#000',
                    borderRadius: '42px',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Subtle screen glare */}
                  <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-50" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)', borderRadius: '42px 42px 0 0' }}></div>

                  {/* Dynamic Island */}
                  <div
                    className="absolute z-50 flex items-center justify-between px-2.5"
                    style={{ top: '12px', left: '50%', transform: 'translateX(-50%)', width: '118px', height: '34px', background: '#000', borderRadius: '20px' }}
                  >
                    {/* Mic dot */}
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1a1a1a', boxShadow: 'inset 0 0 2px rgba(255,255,255,0.1)' }}></div>
                    {/* Camera Lens */}
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #1a2a3a 0%, #060a10 70%)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 0 4px rgba(50,100,255,0.3), 0 0 2px rgba(0,0,0,1)' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(30,60,120,0.8)', margin: '3.5px auto' }}></div>
                    </div>
                  </div>

                  {/* iOS Status Bar */}
                  <div className="flex items-center justify-between px-6 pt-6 pb-1 shrink-0" style={{ fontSize: '11px', fontWeight: '700', color: '#000', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', background: '#ffffff' }}>
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" opacity="0.35" /><rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" /><path d="M23 4.5V7.5C23.8 7.2 24.5 6.4 24.5 6C24.5 5.6 23.8 4.8 23 4.5Z" fill="currentColor" opacity="0.4" /></svg>
                    </div>
                  </div>

                  {/* iMessage-style content area */}
                  <div className="flex-1 flex flex-col" style={{ background: '#ffffff', overflowY: 'hidden' }}>

                    {/* Contact Header */}
                    <div className="flex flex-col items-center py-3 px-4 shrink-0">
                      <div
                        className="flex items-center justify-center text-white font-black"
                        style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1c1c2e 0%, #2d2d44 100%)', fontSize: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
                      >S</div>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: '#1c1c1e', marginTop: '4px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>Srees Beauty</p>
                      <p style={{ fontSize: '10px', color: '#8e8e93', marginTop: '1px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>Business · iMessage</p>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 flex flex-col px-3 py-3 overflow-hidden" style={{ gap: '6px', background: '#fff' }}>
                      {/* Timestamp */}
                      <div className="flex justify-center mb-2 mt-2">
                        <span style={{ fontSize: '10px', color: '#8e8e93', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', fontWeight: '600' }}>Today 9:41 AM</span>
                      </div>

                      {/* Received Message Bubble */}
                      <div className="flex items-end gap-2 animate-in slide-in-from-left-4 duration-500">
                        <div
                          className="flex items-center justify-center text-white shrink-0 shadow-sm"
                          style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #1c1c2e, #2d2d44)', fontSize: '10px', fontWeight: '900' }}
                        >S</div>
                        <div
                          className="relative px-3 py-2.5 shadow-sm"
                          style={{
                            background: '#e9e9eb',
                            borderRadius: '18px 18px 18px 4px',
                            maxWidth: '200px',
                            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
                          }}
                        >
                          <p style={{ fontSize: '14px', color: '#1c1c1e', lineHeight: '1.35', fontWeight: '500', letterSpacing: '-0.2px' }}>
                            {generatedMsg || 'Hi! ✨ Transform your look with our exclusive Essential Glow package — a luxury experience designed just for you.'}
                          </p>
                        </div>
                      </div>

                      {/* Delivered indicator */}
                      <div className="flex justify-end mt-1">
                        <span style={{ fontSize: '9px', color: '#a1a1aa', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', fontWeight: '500' }}>Delivered</span>
                      </div>
                    </div>

                    {/* iOS Compose Bar */}
                    <div className="flex items-center gap-2 px-3 pb-6 pt-2 shrink-0" style={{ borderTop: '0.5px solid rgba(0,0,0,0.12)', background: 'rgba(249,249,249,0.95)' }}>
                      <div
                        className="flex items-center justify-center cursor-pointer shrink-0"
                        style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#e9e9eb', color: '#8e8e93' }}
                      >
                        <Plus size={16} />
                      </div>
                      <div
                        className="flex-1 flex items-center px-4"
                        style={{ background: '#fff', border: '1px solid #d1d1d6', borderRadius: '20px', height: '34px' }}
                      >
                        <span style={{ fontSize: '14px', color: '#c7c7cc', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', letterSpacing: '-0.2px' }}>iMessage</span>
                      </div>
                      <div
                        className="flex items-center justify-center cursor-pointer shrink-0"
                        style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#34aadc' }}
                      >
                        <Send size={13} color="white" className="-ml-0.5" />
                      </div>
                    </div>

                    {/* Home Indicator Bar inside screen to stay at bottom */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-[#1a1a1a] rounded-full z-50 opacity-40 mix-blend-multiply"></div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricHighlight
              label="Avg. Open Rate"
              value={`${(campaigns.filter(c => c.status === 'Sent').reduce((acc, c) => acc + Number(c.open_rate || 0), 0) / (campaigns.filter(c => c.status === 'Sent').length || 1)).toFixed(1)}%`}
              trend="+4.2%"
              icon={TrendingUp}
            />
            <MetricHighlight
              label="Engagement"
              value={`${(campaigns.filter(c => c.status === 'Sent').reduce((acc, c) => acc + Number(c.click_rate || 0), 0) / (campaigns.filter(c => c.status === 'Sent').length || 1)).toFixed(1)}%`}
              trend="+1.5%"
              icon={MousePointerClick}
            />
            <MetricHighlight
              label="Active Campaigns"
              value={campaigns.filter(c => c.status === 'Scheduled').length.toString()}
              trend="Live"
              icon={Zap}
            />
            <MetricHighlight
              label="Total REACH"
              value={campaigns.reduce((acc, c) => acc + (c.recipientCount || 0), 0).toLocaleString()}
              trend="+12%"
              icon={BarChart3}
            />
          </div>

          <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Active Campaigns</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Performance audit and tracking</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="relative group w-full md:w-64">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="text"
                    placeholder="Find campaign..."
                    value={campaignSearch}
                    onChange={(e) => setCampaignSearch(e.target.value)}
                    className="w-full h-10 bg-white border border-gray-100 rounded-[30px] pl-14 pr-6 text-xs font-bold shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all outline-none"
                  />
                </div>

                <div className="flex bg-gray-50/50 border border-gray-100 p-1 rounded-[30px] h-10 items-center">
                  {(['All', 'Sent', 'Scheduled'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setCampaignFilter(f)}
                      className={`px-6 h-full rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${campaignFilter === f ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => checkPermission('marketing') && handleNewCampaign()}
                  className="flex items-center gap-2 px-6 h-10 bg-rose-500 text-white rounded-[30px] text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-100"
                >
                  <Plus size={14} /> New Campaign
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign Overview</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Channel</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Engagement Stats</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {campaigns
                    .filter(c =>
                      (campaignFilter === 'All' || c.status === campaignFilter) &&
                      c.name.toLowerCase().includes(campaignSearch.toLowerCase())
                    )
                    .map(camp => (
                      <tr key={camp.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                        <td className="px-8 py-5">
                          <div>
                            <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{camp.name}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{(camp.recipientCount ?? camp.recipient_count ?? 0).toLocaleString()} Contacts</p>
                              <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{camp.scheduledDate ?? camp.scheduled_date ?? 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${camp.channel === 'SMS' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                              {camp.channel === 'SMS' ? <Smartphone size={18} /> : <Mail size={18} />}
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${camp.status === 'Sent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                              {camp.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          {camp.status === 'Sent' ? (
                            <div className="flex items-center justify-center gap-8">
                              <div className="text-center">
                                <p className="text-xs font-black text-gray-900">{camp.openRate ?? camp.open_rate ?? 0}%</p>
                                <p className="text-[8px] text-gray-300 uppercase font-black tracking-widest">Opened</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-black text-gray-900">{camp.clickRate ?? camp.click_rate ?? 0}%</p>
                                <p className="text-[8px] text-gray-300 uppercase font-black tracking-widest">Clicked</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-black text-blue-600">{camp.conversionRate ?? camp.conversion_rate ?? 0}%</p>
                                <p className="text-[8px] text-gray-300 uppercase font-black tracking-widest">Conv.</p>
                              </div>
                            </div>
                          ) : <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest block text-center italic">Calculated on send</span>}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="px-4 py-2 bg-gray-50 text-gray-900 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">
                              Details
                            </button>
                            <button className="p-2.5 text-gray-300 hover:text-gray-900 bg-transparent group-hover:bg-white rounded-xl transition-all border border-transparent group-hover:border-gray-100 shadow-sm shadow-transparent group-hover:shadow-gray-200/50">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing {campaigns.length} campaigns in total</p>
              <div className="flex items-center gap-2">
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                  View Performance Report <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'segments' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => checkPermission('marketing') && setIsSegmentPanelOpen(true)}
              className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[30px] p-5 flex flex-col items-center justify-center gap-3 group hover:border-rose-300 hover:bg-white transition-all duration-300 min-h-[220px]"
            >
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:text-rose-500 shadow-sm border border-gray-100 transition-all group-hover:scale-110">
                <Plus size={20} />
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">New Segment</p>
                <p className="text-[9px] font-bold text-gray-400 mt-1">Define AI Target</p>
              </div>
            </button>

            {segments.map(segment => (
              <div key={segment.id} className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm hover:border-blue-200 transition-all group relative overflow-hidden flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-transparent group-hover:text-blue-500 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                    <Users size={18} />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-8 w-8 rounded-full hover:bg-rose-50 flex items-center justify-center text-gray-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1 truncate">{segment.name}</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-gray-900 font-mono leading-none">{(segment.memberCount ?? segment.member_count ?? 0).toLocaleString()}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Reach</span>
                  </div>
                </div>

                <div className="flex-1 mb-6">
                  <div className="flex flex-wrap gap-1.5 content-start">
                    {(segment.criteria || '').split(' ').slice(0, 4).map((c, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-50 text-[8px] font-bold text-gray-400 uppercase tracking-widest rounded-md border border-gray-100">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50">
                  <button className="w-full py-3 bg-gray-900 text-white rounded-[24px] font-black text-[9px] uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-100 group-hover:shadow-rose-100">
                    Reach Audience <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => checkPermission('marketing') && setIsTemplatePanelOpen(true)}
              className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[30px] p-5 flex flex-col items-center justify-center gap-3 group hover:border-rose-300 hover:bg-white transition-all duration-300 min-h-[200px]"
            >
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:text-rose-500 shadow-sm border border-gray-100 transition-all group-hover:scale-110">
                <Plus size={20} />
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">New Template</p>
                <p className="text-[9px] font-bold text-gray-400 mt-1">Design Custom</p>
              </div>
            </button>

            {[
              { name: 'Happy Birthday', desc: 'Personalized premium greeting + 20% gift voucher.', type: 'SMS', color: 'bg-blue-600' },
              { name: 'VIP Monthly', desc: 'Luxury hair trends, highlights, and staff picks.', type: 'Email', color: 'bg-indigo-600' },
              { name: 'Post-Visit Follow', desc: 'Feedback link + loyalty points summary.', type: 'SMS', color: 'bg-emerald-600' },
              { name: 'Win-Back Exclusive', desc: 'Custom package for returning legacy clients.', type: 'Email', color: 'bg-rose-500' },
            ].map((template, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm hover:border-blue-200 transition-all group relative overflow-hidden flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${template.type === 'SMS' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                    {template.type}
                  </span>
                  <button className="text-gray-300 hover:text-gray-900 transition-colors"><MoreHorizontal size={14} /></button>
                </div>

                <div className="mb-4">
                  <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1 truncate">{template.name}</h3>
                  <p className="text-[9px] font-bold text-gray-400 leading-relaxed line-clamp-2">{template.desc}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50">
                  <button className="w-full py-3 bg-gray-900 text-white rounded-[24px] font-black text-[9px] uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-100 group-hover:shadow-rose-100">
                    Use Template <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Segment SidePanel */}
      <SidePanel
        isOpen={isSegmentPanelOpen}
        onClose={() => setIsSegmentPanelOpen(false)}
        title="Create Smart Segment"
        subtitle="Define your target audience"
        footer={
          <div className="flex items-center justify-between gap-6 w-full">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Est. Reach</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-black text-rose-500 font-mono leading-none">{estimatedReach.toLocaleString()}</p>
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Clients</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSegmentPanelOpen(false)}
                className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!segmentName}
                onClick={handleSaveSegment}
                className="px-8 py-2.5 bg-gray-900 text-white rounded-none font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all disabled:opacity-50"
              >
                Save Segment
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Segment Name</label>
            <input
              type="text"
              placeholder="e.g., High Spenders Q1"
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <TrendingUp size={14} /> Min. Lifetime Spend (₹)
              </label>
              <input
                type="range" min="0" max="100000" step="5000"
                className="w-full accent-rose-500 h-1 bg-rose-100/50 rounded-lg cursor-pointer appearance-none"
                value={segmentRules.minSpend}
                onChange={(e) => setSegmentRules({ ...segmentRules, minSpend: parseInt(e.target.value) })}
              />
              <div className="flex justify-between items-center px-1">
                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">₹0</span>
                <span className="bg-rose-50 px-3 py-1 rounded-full text-[10px] font-black text-rose-500 border border-rose-100">₹{segmentRules.minSpend?.toLocaleString()}</span>
                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">₹100k+</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Calendar size={14} /> Min. Visit Frequency
              </label>
              <input
                type="range" min="0" max="50" step="1"
                className="w-full accent-rose-500 h-1 bg-rose-100/50 rounded-lg cursor-pointer appearance-none"
                value={segmentRules.minVisits}
                onChange={(e) => setSegmentRules({ ...segmentRules, minVisits: parseInt(e.target.value) })}
              />
              <div className="flex justify-between items-center px-1">
                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">0</span>
                <span className="bg-rose-50 px-3 py-1 rounded-full text-[10px] font-black text-rose-500 border border-rose-100">{segmentRules.minVisits} Visits</span>
                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">50+</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-50">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Clock size={14} /> Inactivity Period
            </label>
            <div className="flex bg-[#f5f6fa] p-1 gap-1 rounded-[30px]">
              {[30, 60, 90, 180, 365].map(days => (
                <button
                  key={days}
                  onClick={() => setSegmentRules({ ...segmentRules, lastCheckInDays: days })}
                  className={`flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest rounded-[30px] transition-all ${segmentRules.lastCheckInDays === days ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {days}d+
                </button>
              ))}
            </div>
          </div>
        </div>
      </SidePanel>

      {/* Template SidePanel */}
      <SidePanel
        isOpen={isTemplatePanelOpen}
        onClose={() => setIsTemplatePanelOpen(false)}
        title="Create Campaign Template"
        subtitle="Design your re-usable layout"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setIsTemplatePanelOpen(false)}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!templateForm.name || !templateForm.content}
              onClick={handleSaveTemplate}
              className="px-8 py-2.5 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all disabled:opacity-50"
            >
              Create Template
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Template Name</label>
            <input
              type="text"
              placeholder="e.g., Summer Refresh"
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300"
              value={templateForm.name}
              onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Message Content</label>
            <textarea
              placeholder="Enter your marketing copy..."
              rows={6}
              className="w-full bg-[#f5f6fa] border-0 px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-rose-100 transition-all outline-none placeholder:text-gray-300 resize-none"
              value={templateForm.content}
              onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Channel Type</label>
            <div className="flex bg-[#f5f6fa] p-1 gap-1 rounded-[30px]">
              {['SMS', 'Email'].map(t => (
                <button
                  key={t}
                  onClick={() => setTemplateForm({ ...templateForm, type: t })}
                  className={`flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest rounded-[30px] transition-all ${templateForm.type === t ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SidePanel>
    </div>
  );
};

export default MarketingAI;
