import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  Eye,
  TrendingUp,
  Percent,
  Compass,
  Laptop,
  Smartphone,
  Tablet,
  Radio,
  ArrowUpRight,
  ArrowDownRight,
  Pause,
  Play,
  Filter,
  RefreshCw,
  Zap,
  Globe2,
  Calendar,
} from 'lucide-react';
import { VisitorSession, TrafficStats } from '../types';

interface AnalyticsDashboardProps {
  activeVisitors: number;
  setActiveVisitors: React.Dispatch<React.SetStateAction<number>>;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  activeVisitors,
  setActiveVisitors,
}) => {
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'realtime' | '24h' | '7d' | '30d'>('realtime');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  // Simulated live visitor stream
  const [recentSessions, setRecentSessions] = useState<VisitorSession[]>([
    {
      id: 'v_101',
      ipMasked: '172.56.**.**',
      page: '/services/ecommerce-redesign',
      country: 'United States (San Francisco)',
      device: 'desktop',
      referrer: 'Google Organic',
      durationSeconds: 142,
      isConverted: true,
      timestamp: 'Just now',
    },
    {
      id: 'v_102',
      ipMasked: '82.165.**.**',
      page: '/pricing-calculator',
      country: 'United Kingdom (London)',
      device: 'mobile',
      referrer: 'Direct',
      durationSeconds: 45,
      isConverted: false,
      timestamp: '12s ago',
    },
    {
      id: 'v_103',
      ipMasked: '194.25.**.**',
      page: '/portfolio/apex-retail',
      country: 'Germany (Berlin)',
      device: 'desktop',
      referrer: 'LinkedIn / Social',
      durationSeconds: 210,
      isConverted: true,
      timestamp: '28s ago',
    },
    {
      id: 'v_104',
      ipMasked: '24.114.**.**',
      page: '/consultation-booking',
      country: 'Canada (Toronto)',
      device: 'tablet',
      referrer: 'Referral / Partner',
      durationSeconds: 98,
      isConverted: true,
      timestamp: '45s ago',
    },
    {
      id: 'v_105',
      ipMasked: '103.28.**.**',
      page: '/',
      country: 'Australia (Sydney)',
      device: 'mobile',
      referrer: 'Google Organic',
      durationSeconds: 32,
      isConverted: false,
      timestamp: '1m ago',
    },
  ]);

  // Dynamic real-time visitor oscillation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Fluctuate visitor count around 40-58
      setActiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = Math.max(38, Math.min(64, prev + delta));
        return next;
      });

      // Periodically inject a new visitor session
      const samplePages = [
        '/services/ecommerce-redesign',
        '/pricing-calculator',
        '/portfolio/lumina-portal',
        '/consultation-booking',
        '/services/custom-web-apps',
        '/about-us',
        '/',
      ];
      const sampleLocations = [
        'United States (New York)',
        'United States (Austin)',
        'United Kingdom (Manchester)',
        'Germany (Munich)',
        'France (Paris)',
        'Japan (Tokyo)',
        'Netherlands (Amsterdam)',
      ];
      const sampleReferrers = [
        'Google Organic',
        'Direct',
        'LinkedIn / Social',
        'Referral / Partner',
        'Twitter / X',
      ];
      const devices: ('desktop' | 'mobile' | 'tablet')[] = ['desktop', 'mobile', 'tablet'];

      const randomPage = samplePages[Math.floor(Math.random() * samplePages.length)];
      const randomLoc = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
      const randomRef = sampleReferrers[Math.floor(Math.random() * sampleReferrers.length)];
      const randomDev = devices[Math.floor(Math.random() * devices.length)];
      const isConverted = Math.random() > 0.65;

      const newSession: VisitorSession = {
        id: `v_${Date.now()}`,
        ipMasked: `${Math.floor(Math.random() * 200) + 20}.${Math.floor(Math.random() * 250)}.**.**`,
        page: randomPage,
        country: randomLoc,
        device: randomDev,
        referrer: randomRef,
        durationSeconds: Math.floor(Math.random() * 180) + 10,
        isConverted,
        timestamp: 'Just now',
      };

      setRecentSessions((prev) => [newSession, ...prev.slice(0, 9)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveStreaming, setActiveVisitors]);

  // Traffic Stats definition
  const stats: TrafficStats = {
    activeVisitors,
    totalVisitors: 28490,
    pageViews: 104820,
    bounceRate: 34.2,
    conversionRate: 4.85,
    conversions: 1382,
    avgSessionDuration: '3m 42s',
    dailyTrend: [
      { time: '00:00', visitors: 820, pageViews: 2450, conversions: 38 },
      { time: '04:00', visitors: 540, pageViews: 1620, conversions: 22 },
      { time: '08:00', visitors: 1840, pageViews: 6200, conversions: 96 },
      { time: '12:00', visitors: 2680, pageViews: 9400, conversions: 148 },
      { time: '16:00', visitors: 3120, pageViews: 11200, conversions: 172 },
      { time: '20:00', visitors: 2190, pageViews: 7800, conversions: 110 },
    ],
    sources: [
      { source: 'Google Organic', visitors: 12820, conversionRate: 5.4, color: 'bg-emerald-500' },
      { source: 'Direct Visitors', visitors: 7120, conversionRate: 6.2, color: 'bg-blue-500' },
      { source: 'LinkedIn & Social', visitors: 4890, conversionRate: 3.8, color: 'bg-indigo-500' },
      { source: 'Agency Referral Partners', visitors: 3660, conversionRate: 8.9, color: 'bg-purple-500' },
    ],
    devices: [
      { device: 'Desktop', percentage: 63, visitors: 17948 },
      { device: 'Mobile Smartphone', percentage: 32, visitors: 9116 },
      { device: 'Tablet / iPad', percentage: 5, visitors: 1424 },
    ],
    topPages: [
      { path: '/services/ecommerce-redesign', name: 'E-Commerce Redesign', views: 34120, conversion: 6.8 },
      { path: '/pricing-calculator', name: 'Instant Project Estimator', views: 24900, conversion: 8.4 },
      { path: '/portfolio/lumina-portal', name: 'Lumina Patient Portal Study', views: 16800, conversion: 4.9 },
      { path: '/consultation-booking', name: 'Book 30-min Strategy Call', views: 12450, conversion: 14.2 },
      { path: '/services/custom-web-apps', name: 'Full-Stack Web Apps', views: 9800, conversion: 5.1 },
    ],
    funnel: [
      { step: '1. Website Visitors', count: 28490, dropoff: '0%', rate: 100 },
      { step: '2. Explored Services & Pricing', count: 16638, dropoff: '-41.6%', rate: 58.4 },
      { step: '3. Generated Project Quote', count: 6866, dropoff: '-58.7%', rate: 24.1 },
      { step: '4. Signed Up Client Account', count: 3504, dropoff: '-48.9%', rate: 12.3 },
      { step: '5. Commissioned & Paid Project', count: 1382, dropoff: '-60.5%', rate: 4.85 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header with real-time beacon and controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/70 backdrop-blur-md p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Real-Time Visitor Traffic & Conversions</span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Live monitoring for <span className="text-cyan-300 font-medium">service4websites.netlify.app</span> and client acquisition funnels
              </p>
            </div>
          </div>
        </div>

        {/* Live Simulator Controls & Timeframe */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isLiveStreaming
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLiveStreaming ? 'Live Pulse Active' : 'Live Paused'}</span>
          </button>

          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 flex items-center gap-1 text-xs">
            {(['realtime', '24h', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTimeframe(t)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedTimeframe === t
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'realtime' ? 'Real-Time' : t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Visitors Now */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Visitors Now</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {activeVisitors}
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18% vs avg
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Users currently interacting with site pages
          </p>
        </div>

        {/* Overall Conversion Rate */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Conversion Rate</span>
            <Percent className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {stats.conversionRate}%
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +1.2% industry
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Visitor-to-client conversion efficiency
          </p>
        </div>

        {/* Total Conversions */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Goal Conversions</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {stats.conversions.toLocaleString()}
            </span>
            <span className="text-xs text-indigo-300 font-medium">30 days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Inquiries, signed up clients & deposits
          </p>
        </div>

        {/* Total Page Views */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Page Views</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {stats.pageViews.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">3.7 / session</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Low bounce rate: <strong className="text-slate-300">{stats.bounceRate}%</strong>
          </p>
        </div>
      </div>

      {/* Conversion Funnel & Hourly Trend Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Full Funnel Breakdown (7 columns) */}
        <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Client Acquisition & Conversion Funnel</span>
              </h3>
              <p className="text-xs text-slate-400">
                Step-by-step conversion pipeline from anonymous visitor to paying client
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              4.85% End-to-End
            </span>
          </div>

          <div className="space-y-3.5">
            {stats.funnel.map((step, idx) => (
              <div key={step.step} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{step.step}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{step.count.toLocaleString()}</span>
                    <span className="font-bold text-cyan-400 w-12 text-right">
                      {step.rate}%
                    </span>
                    {idx > 0 && (
                      <span className="text-[10px] text-rose-400 font-medium w-14 text-right">
                        {step.dropoff}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
                    style={{ width: `${step.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-950/40 p-2 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Avg Exploration</span>
              <span className="text-sm font-bold text-white">{stats.avgSessionDuration}</span>
            </div>
            <div className="bg-slate-950/40 p-2 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Lead Velocity</span>
              <span className="text-sm font-bold text-emerald-400">+24% / week</span>
            </div>
            <div className="bg-slate-950/40 p-2 rounded-xl">
              <span className="text-[11px] text-slate-400 block">CAC Payback</span>
              <span className="text-sm font-bold text-cyan-400">14 Days</span>
            </div>
          </div>
        </div>

        {/* Traffic Sources & Conversion by Channel (5 columns) */}
        <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>Acquisition Channels & Conversion</span>
              </h3>
              <p className="text-xs text-slate-400">Conversion efficiency across channels</p>
            </div>
          </div>

          <div className="space-y-3">
            {stats.sources.map((src) => (
              <div
                key={src.source}
                className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${src.color}`} />
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      {src.source}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {src.visitors.toLocaleString()} visitors
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">
                    {src.conversionRate}%
                  </span>
                  <span className="text-[10px] text-slate-400">conversion rate</span>
                </div>
              </div>
            ))}
          </div>

          {/* Device Breakdown */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Device Split
            </span>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 p-2 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs">
                <Laptop className="w-3.5 h-3.5 text-blue-400" />
                <div>
                  <div className="font-semibold text-white">63%</div>
                  <div className="text-[10px] text-slate-400">Desktop</div>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2 p-2 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <div>
                  <div className="font-semibold text-white">32%</div>
                  <div className="text-[10px] text-slate-400">Mobile</div>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2 p-2 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs">
                <Tablet className="w-3.5 h-3.5 text-purple-400" />
                <div>
                  <div className="font-semibold text-white">5%</div>
                  <div className="text-[10px] text-slate-400">Tablet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Live Activity Stream & Top Converting Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time live incoming visitors log (7 columns) */}
        <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-bold text-white">
                Live Visitor Activity Stream
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Auto-refreshing</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      session.device === 'desktop'
                        ? 'bg-blue-500/15 text-blue-400'
                        : session.device === 'mobile'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-purple-500/15 text-purple-400'
                    }`}
                  >
                    {session.device === 'desktop' ? (
                      <Laptop className="w-3.5 h-3.5" />
                    ) : session.device === 'mobile' ? (
                      <Smartphone className="w-3.5 h-3.5" />
                    ) : (
                      <Tablet className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate">
                      {session.page}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 truncate">
                      <span>{session.country}</span>
                      <span>•</span>
                      <span>{session.referrer}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {session.isConverted ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] border border-emerald-500/30">
                      <Zap className="w-3 h-3" />
                      Converted
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">{session.durationSeconds}s on page</span>
                  )}
                  <div className="text-[10px] text-slate-400 mt-0.5">{session.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Converting Landing Pages (5 columns) */}
        <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <span>Highest Converting Pages</span>
            </h3>
            <span className="text-xs text-slate-400">Ranked by Conversion</span>
          </div>

          <div className="space-y-3">
            {stats.topPages.map((page) => (
              <div
                key={page.path}
                className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{page.name}</span>
                  <span className="font-bold text-emerald-400">{page.conversion}% conv</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[200px]">{page.path}</span>
                  <span>{page.views.toLocaleString()} views</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                    style={{ width: `${Math.min(100, page.conversion * 6.5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
