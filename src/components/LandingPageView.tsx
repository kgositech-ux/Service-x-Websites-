import React, { useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ExternalLink,
  Star,
  Shield,
  Zap,
  Globe,
  DollarSign,
  Search,
  LayoutDashboard,
  ShoppingBag,
  Mail,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Share2,
  HardDrive,
  Menu,
} from 'lucide-react';
import { LandingPageItem, LANDING_PAGES, LANDING_PAGE_CATEGORIES } from '../lib/landingPagesData';
import { GOOGLE_BUSINESS_PROFILE } from '../lib/googleBusinessProfile';
import { useTheme } from '../context/ThemeContext';

interface LandingPageViewProps {
  page: LandingPageItem;
  onBack: () => void;
  onSelectPage: (slug: string) => void;
  onOpenDashboard?: () => void;
  onOpenDriveBackup?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  page,
  onBack,
  onSelectPage,
  onOpenDashboard,
  onOpenDriveBackup,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Scroll to top on mount or page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page.slug]);

  // Icon mapping helper
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Phone':
        return <Phone className="w-5 h-5 text-amber-500" />;
      case 'MessageCircle':
        return <MessageCircle className="w-5 h-5 text-emerald-500" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-rose-500" />;
      case 'Star':
        return <Star className="w-5 h-5 text-amber-400 fill-amber-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-cyan-500" />;
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case 'Search':
        return <Search className="w-5 h-5 text-purple-500" />;
      case 'LayoutDashboard':
        return <LayoutDashboard className="w-5 h-5 text-indigo-500" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-pink-500" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-teal-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
  };

  // Find related pages in the same category
  const relatedPages = LANDING_PAGES.filter(
    (p) => p.categoryGroup === page.categoryGroup && p.slug !== page.slug
  ).slice(0, 4);

  return (
    <article
      className={`min-h-screen pb-20 transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0f17] text-slate-100'
      }`}
    >
      {/* Top Sticky Navigation Bar */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-200 shadow-2xs'
            : 'bg-[#0d121c]/95 border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Back button */}
          <button
            onClick={onBack}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Main Website</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Quick Category Dropdown / Switcher */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] uppercase tracking-wider font-bold text-amber-500 dark:text-amber-400 hidden md:inline truncate">
              {page.category}
            </span>
            <span className="text-slate-400 hidden md:inline">•</span>
            <select
              value={page.slug}
              onChange={(e) => onSelectPage(e.target.value)}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-colors outline-none max-w-[200px] sm:max-w-[280px] truncate ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-800 focus:border-amber-500'
                  : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-amber-400'
              }`}
              aria-label="Switch to another page"
            >
              {LANDING_PAGE_CATEGORIES.map((cat) => (
                <optgroup key={cat.group} label={cat.name}>
                  {cat.pages.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Direct CTA: WhatsApp or Call */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/27601375180?text=${encodeURIComponent(
                `Hello Service Websites, I am interested in ${page.title}. Could you provide a quote?`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Quote</span>
              <span className="sm:hidden">Quote</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Breadcrumb */}
        <nav
          className={`flex items-center gap-1.5 text-xs ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}
          aria-label="Breadcrumb"
        >
          <button
            onClick={onBack}
            className="hover:underline text-amber-600 dark:text-amber-400 font-medium"
          >
            Home
          </button>
          <span>/</span>
          <span className="capitalize">{page.category}</span>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-none">
            {page.title}
          </span>
        </nav>

        {/* Hero Section */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-500 dark:text-amber-300 border border-amber-400/30">
              {page.badge}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <Clock className="w-3 h-3 inline-block mr-1" />
              {page.readTime}
            </span>
            <a
              href={GOOGLE_BUSINESS_PROFILE.shareUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 inline-flex items-center gap-1 hover:underline"
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>Verified Google Profile (5.0 ★)</span>
            </a>
          </div>

          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight leading-tight ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}
          >
            {page.headline}
          </h1>

          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            {page.subheadline}
          </p>

          {/* Quick Metric Bar */}
          <div
            className={`p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#101623] border-slate-800'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Estimated Investment
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {page.pricingEstimate}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Typical Turnaround
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                {page.turnaroundTime}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Target Audience
              </span>
              <span
                className={`font-medium line-clamp-1 ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                {page.targetAudience}
              </span>
            </div>
          </div>
        </section>

        {/* Detailed Overview */}
        <section
          className={`space-y-4 text-sm sm:text-base leading-relaxed pt-2 border-t ${
            isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'
          }`}
        >
          <h2
            className={`text-lg sm:text-xl font-bold font-serif ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Executive Overview & South African Market Context
          </h2>
          {page.overview.map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>

        {/* Key Features & Capabilities */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2
              className={`text-lg sm:text-xl font-bold font-serif ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Core Capabilities & Technical Highlights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {page.features.map((feature, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border space-y-2 transition-all hover:scale-[1.01] ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                    : 'bg-[#101623] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl border ${
                      isLight
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'bg-amber-500/10 border-amber-400/20 text-amber-400'
                    }`}
                  >
                    {renderIcon(feature.iconName)}
                  </div>
                  <h3
                    className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}
                  >
                    {feature.title}
                  </h3>
                </div>
                <p
                  className={`text-xs sm:text-sm leading-relaxed pl-1 ${
                    isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Deliverables / What's Included */}
        <section
          className={`p-6 sm:p-8 rounded-2xl border space-y-4 ${
            isLight
              ? 'bg-gradient-to-br from-amber-50/60 to-white border-amber-200 shadow-sm'
              : 'bg-gradient-to-br from-[#121824] to-[#0d121c] border-amber-500/30'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h2
              className={`text-lg sm:text-xl font-bold font-serif ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Every Engagement Includes:
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {page.deliverables.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        {page.faq && page.faq.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              <h2
                className={`text-lg sm:text-xl font-bold font-serif ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {page.faq.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-800'
                      : 'bg-[#101623] border-slate-800 text-slate-200'
                  }`}
                >
                  <h3 className="font-bold text-xs sm:text-sm text-amber-500 dark:text-amber-300">
                    Q: {f.question}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    A: {f.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section
          className={`p-6 sm:p-8 rounded-3xl border text-center space-y-4 relative overflow-hidden shadow-xl ${
            isLight
              ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 border-amber-300'
              : 'bg-gradient-to-r from-amber-500/20 via-blue-900/40 to-slate-900 text-white border-amber-500/40'
          }`}
        >
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight">
              {page.ctaHeading}
            </h2>
            <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
              {page.ctaText}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/27601375180?text=${encodeURIComponent(
                `Hello Service Websites, I would like to enquire about ${page.title}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2 transition-transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp (+27 60 137 5180)</span>
            </a>

            <a
              href="tel:0601375180"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call 060 137 5180</span>
            </a>

            <a
              href={GOOGLE_BUSINESS_PROFILE.shareUrl}
              target="_blank"
              rel="noreferrer"
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 ${
                isLight
                  ? 'bg-white/80 border-slate-300 text-slate-900 hover:bg-white'
                  : 'bg-slate-900/80 border-slate-700 text-slate-100 hover:bg-slate-900'
              }`}
            >
              <span>View Google Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-[11px] opacity-75">
            Office: Moumo Street, Tlhabane, Rustenburg · 24/7 Response · Nationwide Delivery
          </p>
        </section>

        {/* Related Pages in the same cluster */}
        {relatedPages.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-base font-bold font-serif ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Explore Related {page.category} Services
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Read complementary guides and service specifications
                </p>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1"
              >
                <span>View all services</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedPages.map((rp) => (
                <div
                  key={rp.slug}
                  onClick={() => onSelectPage(rp.slug)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-amber-400/60 shadow-2xs'
                      : 'bg-[#101623] border-slate-800 hover:border-amber-400/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-amber-500 dark:text-amber-400">
                      {rp.badge}
                    </span>
                    <span className="text-[10px] text-slate-400">{rp.readTime}</span>
                  </div>
                  <h4
                    className={`font-bold text-sm leading-snug ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {rp.title}
                  </h4>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {rp.metaDescription}
                  </p>
                  <div className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <span>Read guide</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
