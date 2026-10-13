import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle,
  ExternalLink,
  HardDrive,
  ArrowRight,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { GOOGLE_BUSINESS_PROFILE } from '../lib/googleBusinessProfile';

export interface HeroPortfolioSlide {
  id: string;
  title: string;
  clientName: string;
  category: string;
  image: string;
  badge: string;
  metric: string;
  budgetFormatted: string;
  description: string;
  location: string;
}

export const HERO_PORTFOLIO_SLIDES: HeroPortfolioSlide[] = [
  {
    id: 'proj_apex_apparel',
    title: 'Apex Luxury Apparel E-Commerce Storefront',
    clientName: 'Apex Retail Brands',
    category: 'E-Commerce & Headless Store',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1920&q=85',
    badge: 'PayFast & Ozow Instant EFT',
    metric: '99+ Core Web Vitals',
    budgetFormatted: 'R28,500',
    description: 'High-speed headless e-commerce store with Algolia search, custom lookbook, and parcel tracking integration.',
    location: 'Gauteng & Nationwide',
  },
  {
    id: 'proj_lumina_health',
    title: 'Lumina Patient Portal & Clinic Directory',
    clientName: 'Lumina Health Systems',
    category: 'Healthcare & Web Applications',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=85',
    badge: 'POPIA & HIPAA Compliant',
    metric: '24/7 Live Doctor Booking',
    budgetFormatted: 'R42,000',
    description: 'Digital patient triage portal with multi-clinic directory, SMS reminders, and encrypted records.',
    location: 'Rustenburg & Pretoria',
  },
  {
    id: 'proj_greenleaf_solar',
    title: 'GreenLeaf Clean Energy Growth Funnel & SEO',
    clientName: 'GreenLeaf Clean Energy',
    category: 'Commercial Solar & Lead Gen',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1920&q=85',
    badge: 'Solar Kilowatt Calculator',
    metric: '#1 Google Clean Energy Rank',
    budgetFormatted: 'R12,000',
    description: 'High-converting commercial solar lead generation funnel and national keyword domination strategy.',
    location: 'North West & South Africa',
  },
  {
    id: 'proj_vuka_construction',
    title: 'Vuka Construction & Concrete Polishing',
    clientName: 'Vuka Construction',
    category: 'Construction & Civil Trades',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=85',
    badge: 'Boksburg & Gauteng Contractor',
    metric: 'Instant WhatsApp Dispatch',
    budgetFormatted: 'R14,800',
    description: 'Contractor website with concrete polishing showcase, project galleries, and direct lead capture.',
    location: 'Boksburg & Gauteng',
  },
  {
    id: 'proj_urban_bistro',
    title: 'Urban Bistro Culinary Website & Booking',
    clientName: 'Urban Hospitality Group',
    category: 'Hospitality & Online Reservations',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=85',
    badge: 'OpenTable Real-time Sync',
    metric: 'Interactive Tasting Menu',
    budgetFormatted: 'R9,800',
    description: 'Atmospheric restaurant website with live table reservations, seasonal menu viewer, and wine pairing guide.',
    location: 'Rustenburg & Johannesburg',
  },
  {
    id: 'proj_platinum_security',
    title: 'Platinum City Tactical Security & Armed Response',
    clientName: 'Platinum City Security',
    category: 'Security & Tactical Guarding',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1920&q=85',
    badge: 'PSIRA Accredited Security',
    metric: 'Emergency Panic Button Link',
    budgetFormatted: 'R16,000',
    description: 'Surveillance & tactical guarding portal with 24/7 WhatsApp dispatch and CCTV quote estimator.',
    location: 'Rustenburg & Brits',
  },
  {
    id: 'proj_ssw_borehole',
    title: 'SSW Borehole Drilling & Agricultural Irrigation',
    clientName: 'SSW Borehole Drilling',
    category: 'Borehole Drilling & Water Systems',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1920&q=85',
    badge: 'Hydrogeological Surveys',
    metric: '#1 Rustenburg Water Drilling',
    budgetFormatted: 'R15,000',
    description: 'Borehole depth surveyor, solar submersible pump spec sheets, and agricultural irrigation quotes.',
    location: 'North West Farmlands',
  },
  {
    id: 'proj_musas_maintenance',
    title: "Musa's Maintenance & Premium Tiling",
    clientName: "Musa's Maintenance Services",
    category: 'Home Renovation & Plastering',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=85',
    badge: 'Before & After Transformation Gallery',
    metric: 'Randburg & Malibongwe SEO',
    budgetFormatted: 'R8,500',
    description: 'Local home improvement showcase with square-meter tiling estimator and one-tap calling.',
    location: 'Randburg & Malibongwe',
  },
];

interface HeroSectionProps {
  onOpenDriveBackup?: () => void;
  onOpenDashboard: () => void;
  allProjectsCount: number;
  onSelectProject?: (projectId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDriveBackup,
  onOpenDashboard,
  allProjectsCount,
  onSelectProject,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const totalSlides = HERO_PORTFOLIO_SLIDES.length;
  const currentSlide = HERO_PORTFOLIO_SLIDES[currentSlideIndex];

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  // Auto sliding carousel interval
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, nextSlide]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchStartXRef.current - touchEndXRef.current;
      if (diff > 50) {
        nextSlide();
      } else if (diff < -50) {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <section
      id="hero"
      aria-label="Service Websites Hero Showcase"
      className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950 text-white min-h-[580px] sm:min-h-[660px] md:min-h-[720px] flex flex-col justify-between transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* =========================================================================
          BACKGROUND SLIDING CAROUSEL OF PORTFOLIO IMAGES
          ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {HERO_PORTFOLIO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          const isNext = (index === (currentSlideIndex + 1) % totalSlides);
          const isPrev = (index === (currentSlideIndex - 1 + totalSlides) % totalSlides);

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-out will-change-transform ${
                isActive
                  ? 'opacity-100 scale-100 z-10'
                  : isNext
                  ? 'opacity-0 scale-105 z-0 translate-x-12'
                  : isPrev
                  ? 'opacity-0 scale-95 z-0 -translate-x-12'
                  : 'opacity-0 scale-95 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={`${slide.title} by ${slide.clientName} - Professional Web Design in Rustenburg`}
                className="w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out scale-105"
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          );
        })}

        {/* Sophisticated Multi-Layer Cinematic Scrim & Vignette Overlays */}
        {/* Layer 1: Dark radial vignette */}
        <div className="absolute inset-0 bg-radial from-slate-950/40 via-slate-950/75 to-slate-950/95 z-10" />

        {/* Layer 2: Directional gradient for readable foreground text */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50 z-10" />

        {/* Layer 3: Subtle horizontal gradient from left for desktop headline emphasis */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent z-10" />

        {/* Layer 4: Ambient glow accents */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none z-10" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none z-10" />
      </div>

      {/* =========================================================================
          TOP BAR INSIDE HERO: Live Agency Status & Carousel Controls
          ========================================================================= */}
      <div className="relative z-20 p-4 sm:p-6 md:p-8 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Location & Status */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Rustenburg, North West Premium Web Designers</span>
          </span>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-700/60 text-slate-300 text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Core Web Vitals 100</span>
          </span>
        </div>

        {/* Right: Carousel HUD controls (Prev, Next, Play/Pause, Slide counter) */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/70 rounded-full px-2.5 py-1 shadow-lg text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            className="p-1 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause carousel background' : 'Resume carousel background'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <span className="text-slate-500" aria-hidden="true">|</span>

          <button
            onClick={prevSlide}
            aria-label="Previous portfolio image"
            className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Previous portfolio work"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono text-[11px] text-amber-300 font-semibold px-1">
            {String(currentSlideIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(totalSlides).padStart(2, '0')}
          </span>

          <button
            onClick={nextSlide}
            aria-label="Next portfolio image"
            className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Next portfolio work"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN HERO HEADLINE, EDITORIAL INTRO, & CTA ACTION CLUSTER
          ========================================================================= */}
      <div className="relative z-20 px-4 sm:px-6 md:px-10 py-4 sm:py-6 max-w-3xl space-y-5">
        {/* Subtle Category Kicker */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Tailored Web Engineering & High-Converting Digital Presence</span>
        </div>

        {/* Semantic H1 Headline for Local SEO & Search Intent */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.1] text-white text-shadow-sm">
          Web Design & Local SEO in Rustenburg
        </h1>

        {/* Value Proposition & Subheading */}
        <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-sm">
          Fast-loading, high-converting websites designed specifically for Rustenburg and South African businesses. We build Google-optimised, mobile-first web experiences engineered to convert local searches into WhatsApp inquiries, phone calls, and paying clients.
        </p>

        {/* High Impact Action Row */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
          {/* Primary CTA */}
          <a
            href="https://wa.me/27601375180?text=Hi%20Service%20Websites,%20I%20would%20like%20a%20website%20quote"
            target="_blank"
            rel="noreferrer"
            className="px-5 sm:px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-400/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>Get a Free WhatsApp Quote</span>
          </a>

          {/* Google Business Profile */}
          <a
            href={GOOGLE_BUSINESS_PROFILE.shareUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 sm:px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-md font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md hover:border-slate-600"
          >
            <span className="w-4 h-4 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-[10px]">
              G
            </span>
            <span>Google Business Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* Google Drive Projects Backup */}
          {onOpenDriveBackup && (
            <button
              onClick={onOpenDriveBackup}
              className="px-4 sm:px-5 py-3.5 rounded-2xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-200 border border-blue-700/60 backdrop-blur-md font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer hover:border-blue-500"
              title="Add all client projects to your Google Drive folder"
            >
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span>Add Projects to Drive</span>
            </button>
          )}

          {/* Explore All Portfolio */}
          <a
            href="#portfolio"
            className="px-4 sm:px-5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/90 text-slate-200 border border-slate-700/60 backdrop-blur-md font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Explore All Projects ({allProjectsCount})</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </a>

          {/* Client Portal Link */}
          <button
            onClick={onOpenDashboard}
            className="px-4 sm:px-5 py-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border border-slate-800 backdrop-blur-md font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            <span>Client Portal</span>
          </button>
        </div>

        {/* Agency Trust Bar / Performance Metrics */}
        <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-left border-t border-slate-800/80">
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/40 backdrop-blur-xs border border-slate-800/50">
            <div className="text-amber-400 font-bold text-xs sm:text-sm flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>&lt; 1.0s Speed</span>
            </div>
            <p className="text-[11px] text-slate-400">Google Core Web Vitals 100</p>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/40 backdrop-blur-xs border border-slate-800/50">
            <div className="text-emerald-400 font-bold text-xs sm:text-sm flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>R8,500 - R42k</span>
            </div>
            <p className="text-[11px] text-slate-400">Transparent Fixed Pricing</p>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/40 backdrop-blur-xs border border-slate-800/50">
            <div className="text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>5.0 Star Rating</span>
            </div>
            <p className="text-[11px] text-slate-400">Verified Google Reviews</p>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/40 backdrop-blur-xs border border-slate-800/50">
            <div className="text-blue-400 font-bold text-xs sm:text-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>24/7 WhatsApp</span>
            </div>
            <p className="text-[11px] text-slate-400">Direct Contractor Dispatch</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM DOCK: Interactive Current Portfolio Work HUD & Thumbnail Strip
          ========================================================================= */}
      <div className="relative z-20 p-4 sm:p-6 md:p-8 pt-4 border-t border-slate-800/70 bg-slate-950/75 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Current Featured Portfolio Metadata Callout */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400/40 shrink-0 shadow-md">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                Featured Work · {currentSlide.category}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {currentSlide.location}
              </span>
              <span className="text-xs font-semibold text-emerald-400 hidden xs:inline">
                {currentSlide.budgetFormatted}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-md sm:max-w-lg mt-0.5">
              {currentSlide.title}
            </h4>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-xl">
              {currentSlide.description}
            </p>
          </div>
        </div>

        {/* Thumbnail Selector Strip & Slide Indicators */}
        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto overflow-x-auto max-w-full pb-1 md:pb-0">
          {HERO_PORTFOLIO_SLIDES.map((slide, idx) => {
            const isSelected = idx === currentSlideIndex;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Show ${slide.title}`}
                className={`relative group rounded-lg overflow-hidden transition-all duration-300 focus:outline-hidden cursor-pointer ${
                  isSelected
                    ? 'w-12 sm:w-14 h-8 sm:h-9 ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-950 opacity-100 scale-105'
                    : 'w-7 sm:w-8 h-7 sm:h-8 opacity-50 hover:opacity-90 hover:scale-100'
                }`}
                title={`${slide.clientName} - ${slide.category}`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 ${
                    isSelected ? 'bg-amber-400/10' : 'bg-slate-950/40 group-hover:bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
