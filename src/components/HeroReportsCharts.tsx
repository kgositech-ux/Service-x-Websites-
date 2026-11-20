import React, { useState } from 'react';
import { TrendingUp, BarChart3, Gauge, ArrowUpRight, Sparkles } from 'lucide-react';

interface MonthlyReportPoint {
  month: string;
  leads: number;
  aiCitations: number;
  calls: number;
  lcpSeconds: number;
}

const REPORT_SERIES: MonthlyReportPoint[] = [
  { month: 'Jun', leads: 118, aiCitations: 24, calls: 64, lcpSeconds: 1.1 },
  { month: 'Jul', leads: 156, aiCitations: 41, calls: 82, lcpSeconds: 0.9 },
  { month: 'Aug', leads: 204, aiCitations: 63, calls: 109, lcpSeconds: 0.9 },
  { month: 'Sep', leads: 248, aiCitations: 86, calls: 134, lcpSeconds: 0.8 },
  { month: 'Oct', leads: 296, aiCitations: 108, calls: 158, lcpSeconds: 0.8 },
  { month: 'Nov', leads: 342, aiCitations: 128, calls: 184, lcpSeconds: 0.7 },
];

interface ChannelBreakdownItem {
  id: string;
  label: string;
  share: number;
  leadsCount: number;
  convRate: string;
  stroke: string;
  barClass: string;
  dotClass: string;
  textClass: string;
}

const CHANNEL_BREAKDOWN: ChannelBreakdownItem[] = [
  {
    id: 'local-seo',
    label: 'Google Search & Maps',
    share: 46,
    leadsCount: 157,
    convRate: '5.4%',
    stroke: '#f59e0b',
    barClass: 'bg-amber-400',
    dotClass: 'bg-amber-400',
    textClass: 'text-amber-300',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp Direct',
    share: 28,
    leadsCount: 96,
    convRate: '6.8%',
    stroke: '#10b981',
    barClass: 'bg-emerald-400',
    dotClass: 'bg-emerald-400',
    textClass: 'text-emerald-300',
  },
  {
    id: 'ai-search',
    label: 'AI Overviews & ChatGPT',
    share: 17,
    leadsCount: 58,
    convRate: '4.9%',
    stroke: '#22d3ee',
    barClass: 'bg-cyan-400',
    dotClass: 'bg-cyan-400',
    textClass: 'text-cyan-300',
  },
  {
    id: 'referrals',
    label: 'Verified Reviews & Direct',
    share: 9,
    leadsCount: 31,
    convRate: '7.2%',
    stroke: '#6366f1',
    barClass: 'bg-indigo-400',
    dotClass: 'bg-indigo-400',
    textClass: 'text-indigo-300',
  },
];

interface BenchmarkBar {
  label: string;
  oursValue: number;
  industryValue: number;
  unit: string;
  oursLabel: string;
  industryLabel: string;
  higherIsBetter: boolean;
}

const SPEED_BENCHMARKS: BenchmarkBar[] = [
  {
    label: 'Core Web Vitals Score',
    oursValue: 100,
    industryValue: 64,
    unit: '/100',
    oursLabel: '100 / 100',
    industryLabel: '64 avg',
    higherIsBetter: true,
  },
  {
    label: 'Mobile Load Speed (LCP)',
    oursValue: 92,
    industryValue: 38,
    unit: 's',
    oursLabel: '0.7s Load',
    industryLabel: '3.4s avg',
    higherIsBetter: true,
  },
  {
    label: 'Local Lead Conversion',
    oursValue: 86,
    industryValue: 34,
    unit: '%',
    oursLabel: '4.85% CVR',
    industryLabel: '1.9% avg',
    higherIsBetter: true,
  },
];

interface HeroReportsChartsProps {
  standalone?: boolean;
}

export const HeroReportsCharts: React.FC<HeroReportsChartsProps> = ({ standalone = false }) => {
  const [activeMonthIdx, setActiveMonthIdx] = useState<number>(REPORT_SERIES.length - 1);
  const [hoveredChannelId, setHoveredChannelId] = useState<string | null>(null);
  const [rightPanelMode, setRightPanelMode] = useState<'channels' | 'benchmarks'>('channels');

  const activePoint = REPORT_SERIES[activeMonthIdx];

  // SVG Area/Line chart geometry (viewBox 420 x 148)
  const chartW = 420;
  const chartH = 148;
  const padLeft = 34;
  const padRight = 14;
  const padTop = 16;
  const padBottom = 26;
  const plotW = chartW - padLeft - padRight;
  const plotH = chartH - padTop - padBottom;
  const maxY = 380;

  const getX = (idx: number) =>
    padLeft + (idx / (REPORT_SERIES.length - 1)) * plotW;
  const getY = (val: number) =>
    padTop + plotH - (val / maxY) * plotH;

  const buildSmoothPath = (values: number[]) => {
    const pts = values.map((v, i) => ({ x: getX(i), y: getY(v) }));
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cx1 = curr.x + (next.x - curr.x) * 0.42;
      const cx2 = curr.x + (next.x - curr.x) * 0.58;
      d += ` C ${cx1.toFixed(1)} ${curr.y.toFixed(1)}, ${cx2.toFixed(1)} ${next.y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
    }
    return d;
  };

  const leadsLinePath = buildSmoothPath(REPORT_SERIES.map((d) => d.leads));
  const leadsAreaPath = `${leadsLinePath} L ${getX(REPORT_SERIES.length - 1).toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${getX(0).toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;

  const citationsLinePath = buildSmoothPath(REPORT_SERIES.map((d) => d.aiCitations));
  const citationsAreaPath = `${citationsLinePath} L ${getX(REPORT_SERIES.length - 1).toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${getX(0).toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;

  // Donut SVG geometry
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div
      className={standalone ? 'space-y-3' : 'pt-4 border-t border-slate-800/80 space-y-3'}
      aria-label="Agency performance reports and analytics charts"
    >
      {/* Top Report Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-400">
            <BarChart3 className="w-3.5 h-3.5" />
          </span>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
              Client Performance & Search Reports
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-400">
              Verified 6-month Rustenburg client acquisition, AI citations &amp; speed telemetry (Jun–Nov 2026)
            </p>
          </div>
        </div>

        {/* Summary KPI Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] tabular-nums">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold inline-flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+190% Leads (6 mo)</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold">
            5.0 ★ (47 Reviews)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold">
            0.7s LCP · 100 CWV
          </span>
        </div>
      </div>

      {/* Dual Graphic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* LEFT CHART: Monthly Inbound Leads & AI Citations Trend (Area/Line Chart) */}
        <div className="lg:col-span-7 p-3.5 sm:p-4 rounded-2xl bg-slate-900/75 backdrop-blur-md border border-slate-800/90 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Inbound Leads &amp; AI Citations Report</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Select or tap any month to inspect client report totals
              </p>
            </div>

            {/* Active Month Readout */}
            <div className="flex items-center gap-2.5 text-[11px] tabular-nums bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-xl">
              <span className="font-bold text-slate-200">{activePoint.month} 2026:</span>
              <span className="font-bold text-amber-300">{activePoint.leads} leads</span>
              <span className="text-slate-600">·</span>
              <span className="font-bold text-cyan-300">{activePoint.aiCitations} AI cites</span>
            </div>
          </div>

          {/* Interactive SVG Area + Line Chart */}
          <div className="w-full">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-auto overflow-visible"
              role="img"
              aria-label="Six month area chart showing growth in qualified inbound leads from 118 in June to 342 in November and AI search citations from 24 to 128"
            >
              <defs>
                <linearGradient id="heroLeadsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="heroCitationsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Labels */}
              {[0, 100, 200, 300, 380].map((tick) => {
                const y = getY(tick);
                return (
                  <g key={tick}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={chartW - padRight}
                      y2={y}
                      stroke="#1e293b"
                      strokeDasharray={tick === 0 ? undefined : '3 3'}
                      strokeWidth="1"
                    />
                    <text
                      x={padLeft - 6}
                      y={y + 3}
                      textAnchor="end"
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="ui-monospace, SFMono-Regular, monospace"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Vertical Active Highlight Guide */}
              <line
                x1={getX(activeMonthIdx)}
                y1={padTop}
                x2={getX(activeMonthIdx)}
                y2={padTop + plotH}
                stroke="#475569"
                strokeDasharray="2 2"
                strokeWidth="1"
              />

              {/* Area Fills */}
              <path d={leadsAreaPath} fill="url(#heroLeadsFill)" />
              <path d={citationsAreaPath} fill="url(#heroCitationsFill)" />

              {/* Trend Lines */}
              <path
                d={leadsLinePath}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d={citationsLinePath}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Data Points + Interactive Hit Targets + X Labels */}
              {REPORT_SERIES.map((pt, idx) => {
                const cx = getX(idx);
                const cyLeads = getY(pt.leads);
                const cyCites = getY(pt.aiCitations);
                const isSelected = idx === activeMonthIdx;

                return (
                  <g
                    key={pt.month}
                    onMouseEnter={() => setActiveMonthIdx(idx)}
                    onClick={() => setActiveMonthIdx(idx)}
                    className="cursor-pointer"
                  >
                    {/* Invisible generous hover/tap column */}
                    <rect
                      x={cx - plotW / (REPORT_SERIES.length * 2)}
                      y={padTop}
                      width={plotW / REPORT_SERIES.length}
                      height={plotH + 22}
                      fill="transparent"
                    />

                    {/* Leads dot */}
                    <circle
                      cx={cx}
                      cy={cyLeads}
                      r={isSelected ? 5 : 3.2}
                      fill="#0f172a"
                      stroke="#fbbf24"
                      strokeWidth={isSelected ? 2.5 : 1.8}
                    />

                    {/* Citations dot */}
                    <circle
                      cx={cx}
                      cy={cyCites}
                      r={isSelected ? 4.5 : 2.8}
                      fill="#0f172a"
                      stroke="#22d3ee"
                      strokeWidth={isSelected ? 2.2 : 1.6}
                    />

                    {/* Value label above active Leads point */}
                    {isSelected && (
                      <g>
                        <rect
                          x={Math.min(Math.max(cx - 18, padLeft), chartW - padRight - 36)}
                          y={Math.max(cyLeads - 20, 1)}
                          width="36"
                          height="14"
                          rx="4"
                          fill="#fbbf24"
                        />
                        <text
                          x={Math.min(Math.max(cx, padLeft + 18), chartW - padRight - 18)}
                          y={Math.max(cyLeads - 10, 11)}
                          textAnchor="middle"
                          fill="#020617"
                          fontSize="9"
                          fontWeight="800"
                        >
                          {pt.leads}
                        </text>
                      </g>
                    )}

                    {/* X-axis month label */}
                    <text
                      x={cx}
                      y={chartH - 6}
                      textAnchor="middle"
                      fill={isSelected ? '#fbbf24' : '#94a3b8'}
                      fontSize="9.5"
                      fontWeight={isSelected ? '700' : '500'}
                    >
                      {pt.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Chart Legend & Quick Footnotes */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/70 text-[10px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-slate-200 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Qualified Leads / mo
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-200 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                AI Search Citations (GEO)
              </span>
            </div>
            <span className="tabular-nums text-emerald-300 font-semibold">
              {activePoint.calls} Phone &amp; WhatsApp Calls ({activePoint.month})
            </span>
          </div>
        </div>

        {/* RIGHT CHART: Lead Attribution Donut OR Speed Benchmarks Bar Chart */}
        <div className="lg:col-span-5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/75 backdrop-blur-md border border-slate-800/90 flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              {rightPanelMode === 'channels' ? (
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>
                {rightPanelMode === 'channels' ? 'Lead Attribution Share' : 'Speed & CVR Benchmarks'}
              </span>
            </div>

            {/* Clean two-tab toggle */}
            <div className="inline-flex rounded-lg bg-slate-950/90 border border-slate-800 p-0.5 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setRightPanelMode('channels')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  rightPanelMode === 'channels'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Channels
              </button>
              <button
                type="button"
                onClick={() => setRightPanelMode('benchmarks')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  rightPanelMode === 'benchmarks'
                    ? 'bg-emerald-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Speed Report
              </button>
            </div>
          </div>

          {rightPanelMode === 'channels' ? (
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-3.5 py-1">
              {/* Interactive SVG Donut Chart */}
              <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="12"
                  />
                  {CHANNEL_BREAKDOWN.map((item) => {
                    const dashLength = (item.share / 100) * circumference;
                    const dashOffset = -((cumulativePercent / 100) * circumference);
                    cumulativePercent += item.share;
                    const isFocused = hoveredChannelId === item.id;

                    return (
                      <circle
                        key={item.id}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke={item.stroke}
                        strokeWidth={isFocused ? 14 : 11.5}
                        strokeDasharray={`${dashLength} ${circumference}`}
                        strokeDashoffset={dashOffset}
                        onMouseEnter={() => setHoveredChannelId(item.id)}
                        onMouseLeave={() => setHoveredChannelId(null)}
                        className="transition-all duration-200 cursor-pointer"
                      />
                    );
                  })}
                </svg>

                {/* Center Readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none tabular-nums">
                  {hoveredChannelId ? (
                    <>
                      <span className="text-sm font-black text-white leading-none">
                        {CHANNEL_BREAKDOWN.find((c) => c.id === hoveredChannelId)?.share}%
                      </span>
                      <span className="text-[9px] text-slate-400 mt-0.5">
                        {CHANNEL_BREAKDOWN.find((c) => c.id === hoveredChannelId)?.leadsCount} leads
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-black text-white leading-none">342</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Nov Leads</span>
                    </>
                  )}
                </div>
              </div>

              {/* Channel Share Bars */}
              <div className="flex-1 w-full space-y-2">
                {CHANNEL_BREAKDOWN.map((item) => {
                  const isFocused = hoveredChannelId === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredChannelId(item.id)}
                      onMouseLeave={() => setHoveredChannelId(null)}
                      className={`space-y-1 rounded-lg px-1.5 py-0.5 transition-colors cursor-default ${
                        isFocused ? 'bg-slate-800/70' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] tabular-nums">
                        <span className="flex items-center gap-1.5 text-slate-200 font-medium truncate">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${item.dotClass}`} />
                          <span className="truncate">{item.label}</span>
                        </span>
                        <span className={`font-bold shrink-0 ml-2 ${item.textClass}`}>
                          {item.share}% · {item.convRate}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.barClass} transition-all duration-500`}
                          style={{ width: `${item.share}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Grouped Horizontal Comparison Bar Chart: Us vs Industry Avg */
            <div className="space-y-2.5 py-1">
              {SPEED_BENCHMARKS.map((row) => (
                <div key={row.label} className="space-y-1 tabular-nums">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-200 font-medium">{row.label}</span>
                    <span className="text-emerald-300 font-bold">{row.oursLabel}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-amber-300 font-semibold w-12 shrink-0">
                        Our Sites
                      </span>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400"
                          style={{ width: `${row.oursValue}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 w-12 shrink-0">
                        {row.industryLabel}
                      </span>
                      <div className="flex-1 h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-600"
                          style={{ width: `${row.industryValue}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer line with fixed package pricing & 24/7 response */}
          <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-800/70 text-[10px] text-slate-400 tabular-nums">
            <span>Packages: <strong className="text-emerald-300">R8,500 – R42k</strong></span>
            <span>Support: <strong className="text-blue-300">24/7 Open Hours</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
