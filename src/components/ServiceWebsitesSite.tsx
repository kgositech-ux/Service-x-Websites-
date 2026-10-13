import React, { useState, useMemo } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Globe,
  Clock,
  ExternalLink,
  Star,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Layers,
  ShoppingBag,
  Sparkles,
  Search,
  LayoutDashboard,
  Menu,
  X,
  Facebook,
  Instagram,
  Sun,
  Moon,
  Filter,
  Calendar,
  Building,
  DollarSign,
  Tag,
  Check,
  Shield,
  Zap,
  Navigation,
  HardDrive,
  LogOut,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ProjectItem } from '../types';
import { GOOGLE_BUSINESS_PROFILE } from '../lib/googleBusinessProfile';
import { GoogleBusinessProfileCard } from './GoogleBusinessProfileCard';
import { HeroSection } from './HeroSection';
import { LANDING_PAGES, LANDING_PAGE_CATEGORIES, LandingPageItem } from '../lib/landingPagesData';
import { LandingPageView } from './LandingPageView';

interface ServiceWebsitesSiteProps {
  projects?: ProjectItem[];
  onOpenAccountModal: () => void;
  onOpenDashboard: () => void;
  onOpenProjectsView?: () => void;
  onOpenDriveBackup?: () => void;
  onOpenVerificationModal?: () => void;
  onOpenLandingPage?: (slug: string) => void;
  activeLandingSlug?: string | null;
  onOpenAuthModal?: (tab?: 'signin' | 'signup') => void;
}

interface PortfolioItem {
  id: string;
  category: string;
  categoryGroup: 'trades' | 'ecommerce' | 'corporate' | 'healthcare' | 'hospitality';
  chronologicalDate: string; // YYYY-MM
  dateLabel: string;
  title: string;
  clientName: string;
  description: string;
  image: string;
  badge: string;
  deliverables: string[];
  techStack: string[];
  budgetFormatted?: string;
  status: 'Live & Completed' | 'In Development' | 'Active Maintenance';
  featured: boolean;
}

// 12 Curated Agency Projects in chronological order with 100% FRESH, UNIQUE Unsplash images (NO REPEATS from previous images)
const CURATED_PROJECTS: PortfolioItem[] = [
  {
    id: 'proj_apex_apparel',
    category: 'E-COMMERCE PLATFORM',
    categoryGroup: 'ecommerce',
    chronologicalDate: '2026-10',
    dateLabel: 'October 2026',
    title: 'Apex Luxury Apparel E-Commerce Storefront',
    clientName: 'Apex Retail Brands',
    description:
      'High-speed headless e-commerce store with Algolia instant product search, custom apparel sizing lookbook, and 99+ mobile Core Web Vitals score. Seamless checkout with PayFast and Ozow Instant EFT.',
    image:
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80',
    badge: 'PayFast & Ozow Checkout',
    deliverables: [
      'Headless Next.js storefront',
      'PayFast & Ozow instant payments',
      'The Courier Guy parcel tracking API',
      'Algolia instant fuzzy search',
      'Dynamic mobile-first lookbook',
    ],
    techStack: ['Next.js', 'Tailwind CSS', 'PayFast', 'Algolia', 'Redis'],
    budgetFormatted: 'R28,500',
    status: 'In Development',
    featured: true,
  },
  {
    id: 'proj_lumina_health',
    category: 'HEALTHCARE & WEB APP',
    categoryGroup: 'healthcare',
    chronologicalDate: '2026-09',
    dateLabel: 'September 2026',
    title: 'Lumina Patient Portal & Clinic Directory',
    clientName: 'Lumina Health Systems',
    description:
      'HIPAA and POPIA compliant digital patient triage portal. Real-time doctor scheduling, encrypted medical record retrieval, multi-clinic Rustenburg directory, and automated SMS appointment reminders.',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    badge: 'HIPAA & POPIA Compliant',
    deliverables: [
      'Self-service appointment booking',
      'Doctor availability calendar',
      'Twilio SMS confirmation triage',
      'Encrypted client record vault',
      'Interactive hospital directory',
    ],
    techStack: ['React', 'Firebase Auth', 'Cloud Firestore', 'Twilio'],
    budgetFormatted: 'R42,000',
    status: 'In Development',
    featured: true,
  },
  {
    id: 'proj_techscale_saas',
    category: 'CORPORATE WEBSITE & SAAS',
    categoryGroup: 'corporate',
    chronologicalDate: '2026-09',
    dateLabel: 'September 2026',
    title: 'TechScale Corporate Rebrand & SaaS Platform',
    clientName: 'TechScale Ventures',
    description:
      'B2B enterprise SaaS website featuring interactive live ROI and pricing calculators, automated HubSpot CRM deal ingestion, and friction-free product demo booking.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    badge: 'HubSpot CRM Integrated',
    deliverables: [
      'Interactive pricing calculator',
      'HubSpot CRM lead routing',
      'Video walkthrough modals',
      'Enterprise whitepaper download gate',
      '99/100 Google Lighthouse score',
    ],
    techStack: ['Vite', 'React', 'Tailwind', 'HubSpot API', 'Framer Motion'],
    budgetFormatted: 'R19,500',
    status: 'In Development',
    featured: true,
  },
  {
    id: 'proj_greenleaf_solar',
    category: 'SEO & CLEAN ENERGY',
    categoryGroup: 'corporate',
    chronologicalDate: '2026-08',
    dateLabel: 'August 2026',
    title: 'GreenLeaf Clean Energy Growth Funnel & SEO Overhaul',
    clientName: 'GreenLeaf Clean Energy',
    description:
      'High-converting commercial solar lead generation funnel, enterprise ESG sustainability reporting portal, and nationwide keyword domination strategy across South Africa.',
    image:
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    badge: 'Core Web Vitals 100',
    deliverables: [
      'Solar savings kilowatt calculator',
      'National high-intent keyword ranking',
      'Schema.org rich snippet JSON-LD',
      'Downloadable ESG impact report PDF',
      'Fast-loading server rendered pages',
    ],
    techStack: ['Next.js SSG', 'Tailwind', 'Schema.org', 'Cloudflare CDN'],
    budgetFormatted: 'R12,000',
    status: 'In Development',
    featured: false,
  },
  {
    id: 'proj_vuka_construction',
    category: 'CONSTRUCTION & CIVIL · JULY 2026',
    categoryGroup: 'trades',
    chronologicalDate: '2026-07',
    dateLabel: 'July 2026',
    title: 'Vuka Construction & Concrete Polishing',
    clientName: 'Vuka Construction',
    description:
      'Web design and local SEO for a Boksburg and Gauteng concrete and waterproofing contractor. Power floats, polishes, industrial flooring and structural sealing.',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    badge: 'Concrete & Waterproofing',
    deliverables: [
      'Local Boksburg & Gauteng Google ranking',
      'Industrial project photo portfolio',
      'Direct WhatsApp quote request button',
      'Mobile-first responsive layout',
      'Google Business Profile synchronization',
    ],
    techStack: ['React', 'Tailwind CSS', 'Local SEO', 'Google Maps API'],
    budgetFormatted: 'R14,800',
    status: 'Live & Completed',
    featured: true,
  },
  {
    id: 'proj_platinum_security',
    category: 'SECURITY & TACTICAL RESPONSE',
    categoryGroup: 'trades',
    chronologicalDate: '2026-06',
    dateLabel: 'June 2026',
    title: 'Platinum City Tactical Security & Armed Response',
    clientName: 'Platinum City Security',
    description:
      'Tactical guarding and surveillance portal with emergency WhatsApp panic link, CCTV system quote estimator, PSIRA credentials showcase, and client patrol reporting.',
    image:
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    badge: 'Tactical Guarding & CCTV',
    deliverables: [
      '24/7 Emergency WhatsApp dispatch',
      'Commercial guarding quote calculator',
      'PSIRA regulatory compliance vault',
      'CCTV remote camera service request',
      'Interactive control room showcase',
    ],
    techStack: ['Vite', 'Tailwind', 'WhatsApp API', 'Leaflet Maps'],
    budgetFormatted: 'R16,000',
    status: 'Live & Completed',
    featured: false,
  },
  {
    id: 'proj_urban_bistro',
    category: 'HOSPITALITY & RESERVATIONS',
    categoryGroup: 'hospitality',
    chronologicalDate: '2026-05',
    dateLabel: 'May 2026',
    title: 'Urban Bistro Culinary Website & Online Reservations',
    clientName: 'Urban Hospitality Group',
    description:
      'Atmospheric fine dining restaurant website with real-time OpenTable table booking, interactive seasonal tasting menu viewer, wine pairing guide, and private function inquiry portal.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    badge: 'Live Table Booking',
    deliverables: [
      'Live OpenTable reservation widget',
      'Seasonal digital menu with dietary tags',
      'Private dining function inquiry form',
      'High-res culinary photography gallery',
      'Optimised for mobile smartphone patrons',
    ],
    techStack: ['React', 'Tailwind CSS', 'OpenTable API', 'Motion UI'],
    budgetFormatted: 'R9,800',
    status: 'Live & Completed',
    featured: true,
  },
  {
    id: 'proj_mcd_industrial',
    category: 'ELECTRICAL & AUTOMATION',
    categoryGroup: 'trades',
    chronologicalDate: '2026-04',
    dateLabel: 'April 2026',
    title: 'MCD Industrial Group Electrical Contracting',
    clientName: 'MCD Group',
    description:
      'Full website overhaul for North West industrial electrical contractors, plant automation, standby generator installations, and certified compliance audits.',
    image:
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    badge: 'Industrial Plant Automation',
    deliverables: [
      'Mining & plant electrical portfolio',
      'Heavy generator backup audit request',
      'Safety accreditation & OHS compliance',
      'Direct engineer consultation intake',
      'Ranked #1 for Rustenburg industrial electrical',
    ],
    techStack: ['Next.js', 'Tailwind CSS', 'Local SEO'],
    budgetFormatted: 'R18,200',
    status: 'Live & Completed',
    featured: false,
  },
  {
    id: 'proj_musingo_supplies',
    category: 'BUILDING SUPPLIES & CIVILS · MARCH 2026',
    categoryGroup: 'trades',
    chronologicalDate: '2026-03',
    dateLabel: 'March 2026',
    title: 'Musingo Service Supplies & Plant Hire',
    clientName: 'Musingo Service Supplies',
    description:
      'Web design for a Roodepoort building supplies, equipment delivery, plant hire and civil contractor. Excellence in every heavy-duty construction service.',
    image:
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    badge: 'Building Supplies & Delivery',
    deliverables: [
      'Heavy equipment hire catalog',
      'Aggregates & sand delivery estimator',
      'Civil engineering tender portfolio',
      'One-tap phone & WhatsApp dispatcher',
      'Complete Google Business Profile setup',
    ],
    techStack: ['Vite', 'Tailwind CSS', 'Google Maps API'],
    budgetFormatted: 'R13,500',
    status: 'Live & Completed',
    featured: true,
  },
  {
    id: 'proj_musas_maintenance',
    category: 'HOME RENOVATION & TILING · FEB 2026',
    categoryGroup: 'trades',
    chronologicalDate: '2026-02',
    dateLabel: 'February 2026',
    title: "Musa's Maintenance & Tiling Services",
    clientName: "Musa's Maintenance Services",
    description:
      'Reliable home maintenance, plastering, premium tiling, and painting, based on Riverbend Drive, Malibongwe Drive area. Rapid response and guaranteed craftsmanship.',
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    badge: 'Plastering & Tiling',
    deliverables: [
      'Residential renovation before/after viewer',
      'Instant square meter tiling calculator',
      'Direct mobile phone call button',
      'Local Randburg & Malibongwe SEO rank',
      'Customer verified testimonial carousel',
    ],
    techStack: ['React', 'Tailwind CSS', 'Local SEO'],
    budgetFormatted: 'R8,500',
    status: 'Live & Completed',
    featured: true,
  },
  {
    id: 'proj_ssw_borehole',
    category: 'BOREHOLE DRILLING & WATER · JAN 2026',
    categoryGroup: 'trades',
    chronologicalDate: '2026-01',
    dateLabel: 'January 2026',
    title: 'SSW Borehole Drilling & Agricultural Irrigation',
    clientName: 'SSW Borehole Drilling',
    description:
      'Water on Demand, Right Beneath Your Land. Precision hydrogeological surveying, borehole drilling, solar submersible pump installation, and agricultural irrigation systems.',
    image:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    badge: 'Water Exploration',
    deliverables: [
      'Borehole depth & yield survey booking',
      'Solar submersible pump spec sheet',
      'North West agricultural water guide',
      'Mobile-optimized quote form',
      'Ranked #1 for Rustenburg borehole drilling',
    ],
    techStack: ['Vite', 'Tailwind CSS', 'WhatsApp Business'],
    budgetFormatted: 'R15,000',
    status: 'Live & Completed',
    featured: true,
  },
  {
    id: 'proj_rustenburg_plumbing',
    category: 'EMERGENCY PLUMBING & GAS · JAN 2026',
    categoryGroup: 'trades',
    chronologicalDate: '2026-01',
    dateLabel: 'January 2026',
    title: 'Rustenburg 24/7 Emergency Plumbers & Gas Compliance',
    clientName: 'Rustenburg Plumbers & Gas',
    description:
      'Ultra-fast mobile landing page for urgent leak detection, solar geyser replacement, drain unblocking, and certified residential gas installation in Rustenburg and Tlhabane.',
    image:
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    badge: '24/7 Emergency Response',
    deliverables: [
      'One-tap emergency call dispatcher',
      'Geyser replacement warranty tracker',
      'SANS 10087 gas certificate verification',
      'Tlhabane & Rustenburg coverage map',
      'Google Local Services Ads landing page',
    ],
    techStack: ['React', 'Tailwind CSS', 'Emergency Dialing'],
    budgetFormatted: 'R7,900',
    status: 'Live & Completed',
    featured: false,
  },
];

export const ServiceWebsitesSite: React.FC<ServiceWebsitesSiteProps> = ({
  projects = [],
  onOpenAccountModal,
  onOpenDashboard,
  onOpenProjectsView,
  onOpenDriveBackup,
  onOpenVerificationModal,
  onOpenLandingPage,
  activeLandingSlug,
  onOpenAuthModal,
}) => {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalLandingSlug, setInternalLandingSlug] = useState<string | null>(null);
  const [footerCategoryFilter, setFooterCategoryFilter] = useState<string>('all');
  const [footerSearch, setFooterSearch] = useState<string>('');

  const currentLandingSlug = activeLandingSlug || internalLandingSlug;
  const currentLandingPage = currentLandingSlug
    ? LANDING_PAGES.find((p) => p.slug === currentLandingSlug)
    : null;

  const handleNavigatePage = (slug: string) => {
    if (onOpenLandingPage) {
      onOpenLandingPage(slug);
    } else {
      setInternalLandingSlug(slug);
      window.location.hash = 'page-' + slug;
    }
  };

  // Portfolio interactive filters
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [portfolioSearch, setPortfolioSearch] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'chronological_desc' | 'chronological_asc'>('chronological_desc');
  const [selectedProjectModal, setSelectedProjectModal] = useState<PortfolioItem | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const isLight = theme === 'light';

  // If a landing page is currently active, render the dedicated LandingPageView
  if (currentLandingPage) {
    return (
      <LandingPageView
        page={currentLandingPage}
        onBack={() => {
          setInternalLandingSlug(null);
          if (onOpenLandingPage) onOpenLandingPage('');
          window.location.hash = '';
        }}
        onSelectPage={(slug) => handleNavigatePage(slug)}
        onOpenDashboard={onOpenDashboard}
        onOpenDriveBackup={onOpenDriveBackup}
      />
    );
  }

  const industryTags = [
    'Plumbers',
    'Electricians',
    'Landscapers',
    'Cleaning companies',
    'Builders and contractors',
    'Painters',
    'Security companies',
    'Mechanics and workshops',
    'Professional service providers',
    'Lawyers',
    'Restaurants',
    'Borehole Drilling',
    'Solar & Clean Energy',
    'Healthcare & Clinics',
  ];

  // Merge curated projects with any dynamic projects from Firestore
  const allProjects = useMemo(() => {
    const list: PortfolioItem[] = [...CURATED_PROJECTS];

    // If Firestore has additional projects, integrate them dynamically
    projects.forEach((fp) => {
      // Check if project is already represented
      const exists = list.some(
        (p) =>
          p.id === fp.id ||
          p.title.toLowerCase().includes(fp.title.toLowerCase().slice(0, 15))
      );
      if (!exists && fp.title) {
        const yearMonth = fp.createdAt ? fp.createdAt.slice(0, 7) : '2026-10';
        list.push({
          id: fp.id,
          category: fp.category ? fp.category.toUpperCase() : 'CLIENT PROJECT',
          categoryGroup: fp.category?.toLowerCase().includes('commerce')
            ? 'ecommerce'
            : fp.category?.toLowerCase().includes('health')
            ? 'healthcare'
            : fp.category?.toLowerCase().includes('corporate')
            ? 'corporate'
            : 'trades',
          chronologicalDate: yearMonth,
          dateLabel: fp.createdAt
            ? new Date(fp.createdAt).toLocaleDateString('en-ZA', {
                month: 'long',
                year: 'numeric',
              })
            : '2026 Project',
          title: fp.title,
          clientName: fp.clientName || 'Private Client',
          description:
            fp.description ||
            `Bespoke web solution tailored for ${fp.clientName || 'client'} with high-performance responsive styling.`,
          image:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          badge: fp.category || 'Custom Solution',
          deliverables: [
            'Mobile-responsive layout',
            'SEO foundation setup',
            'Lead generation forms',
            'Performance optimization',
          ],
          techStack: ['React', 'Tailwind CSS', 'Vite'],
          budgetFormatted: fp.budget ? `R${fp.budget.toLocaleString()}` : undefined,
          status:
            fp.status === 'completed'
              ? 'Live & Completed'
              : 'In Development',
          featured: false,
        });
      }
    });

    // Sort chronologically
    return list.sort((a, b) => {
      if (sortOrder === 'chronological_desc') {
        return b.chronologicalDate.localeCompare(a.chronologicalDate);
      } else {
        return a.chronologicalDate.localeCompare(b.chronologicalDate);
      }
    });
  }, [projects, sortOrder]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((item) => {
      const matchesCategory =
        activeCategoryFilter === 'all' ||
        item.categoryGroup === activeCategoryFilter;

      const q = portfolioSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.clientName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [allProjects, activeCategoryFilter, portfolioSearch]);

  return (
    <div
      className={`min-h-screen relative font-sans transition-colors duration-200 selection:bg-amber-400 selection:text-black w-full max-w-full overflow-x-hidden ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0f17] text-slate-100'
      }`}
    >
      {/* Main Agency Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b px-3 sm:px-6 py-2.5 sm:py-3 transition-colors w-full overflow-hidden ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
            : 'bg-[#0d121c]/95 border-slate-800/80 text-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 w-full min-w-0">
          {/* Logo and branding */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs sm:text-sm tracking-tighter shadow-md shadow-amber-400/20 shrink-0">
              {'</>'}
            </div>
            <div className="min-w-0">
              <h1
                className={`font-serif font-black tracking-tight text-xs sm:text-base md:text-lg leading-tight uppercase truncate ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                SERVICE WEBSITES
              </h1>
              <p
                className={`text-[9px] uppercase tracking-wider font-semibold truncate ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                WEB DESIGN, SEO AND SOFTWARE · RUSTENBURG
              </p>
            </div>
          </div>

          {/* Right header actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Google Drive Projects Backup Button */}
            {onOpenDriveBackup && (
              <button
                onClick={onOpenDriveBackup}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-semibold transition-all cursor-pointer"
                title="Add all client projects to your Google Drive folder"
              >
                <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                <span>Google Drive</span>
              </button>
            )}

            {/* Direct Jump to Client Dashboard */}
            <button
              onClick={onOpenDashboard}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-500" />
              <span>Client Portal</span>
            </button>

            {/* Theme switcher toggle */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all flex items-center justify-center text-xs font-semibold ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
              title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
              aria-label="Toggle Theme"
            >
              {isLight ? (
                <Moon className="w-4 h-4 text-indigo-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Account pill button */}
            <button
              onClick={onOpenAccountModal}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full border text-xs font-medium transition-all group cursor-pointer ${
                isLight
                  ? 'border-amber-500/40 bg-amber-50 hover:bg-amber-100/60 text-amber-900'
                  : 'border-amber-400/40 bg-amber-400/5 hover:bg-amber-400/15 text-amber-200'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-[10px] font-bold text-amber-500 dark:text-amber-300 overflow-hidden shrink-0">
                {profile?.photoURL || user?.photoURL ? (
                  <img
                    src={profile?.photoURL || user?.photoURL || ''}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  '</>'
                )}
              </div>
              <span className="hidden xs:inline">
                {profile?.displayName
                  ? `@${profile.displayName.toLowerCase().replace(/\s+/g, '')}`
                  : 'servicewebsites'}
              </span>
            </button>

            {/* Direct Log Out Button if logged in */}
            {user || profile ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Log Out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            ) : (
              <button
                onClick={() => (onOpenAuthModal ? onOpenAuthModal('signup') : onOpenAccountModal())}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
              >
                Sign Up / Sign In
              </button>
            )}

            {/* Hamburger / Navigation button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900 border-slate-800 text-slate-200 hover:text-white'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Slide-down Menu */}
        {mobileMenuOpen && (
          <div
            className={`mt-3 pt-3 border-t rounded-2xl p-4 space-y-4 animate-in fade-in duration-150 shadow-xl ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0d121c] border-slate-800/80 text-slate-300'
            }`}
          >
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Home</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Target Sectors</a>
              <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold text-amber-500">All Client Projects</a>
              <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Google Reviews</a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Services</a>
              <a href="#ecommerce" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">E-Commerce</a>
              <a href="#process" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Our Process</a>
              <a href="#location" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Location</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-amber-500 font-semibold">Local SEO & FAQ</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Contact Us</a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDashboard();
                }}
                className="p-2 text-left text-amber-600 dark:text-amber-300 font-bold hover:bg-amber-400/10 rounded-lg flex items-center gap-1.5 col-span-2 cursor-pointer"
              >
                <span>📊 Client Dashboard & Analytics</span>
              </button>
              <a
                href="#footer"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-left text-amber-500 font-bold hover:bg-amber-400/10 rounded-lg flex items-center gap-1.5 col-span-2"
              >
                <span>📄 Explore 25 Service & Industry Landing Pages</span>
              </a>

              {user || profile ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="p-2 text-left text-rose-500 font-bold hover:bg-rose-500/10 rounded-lg flex items-center gap-1.5 col-span-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out of Account</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal('signup');
                    else onOpenAccountModal();
                  }}
                  className="p-2 text-left text-amber-400 font-bold hover:bg-amber-400/10 rounded-lg flex items-center gap-1.5 col-span-2 cursor-pointer"
                >
                  <span>🔐 Sign Up / Sign In</span>
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span>Theme:</span>
                <button
                  onClick={toggleTheme}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold flex items-center gap-1"
                >
                  {isLight ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>
              <span className="text-slate-500 font-medium">📞 060 137 5180</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area - Chronological Order of Headings */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-14 sm:space-y-16 w-full min-w-0">
        
        {/* HEADING 1: Premium Hero Section with Background Sliding Carousel */}
        <HeroSection
          onOpenDriveBackup={onOpenDriveBackup}
          onOpenDashboard={onOpenDashboard}
          allProjectsCount={allProjects.length}
        />

        {/* HEADING 2: Websites for Tradespeople & Service Businesses */}
        <section
          id="about"
          className={`space-y-5 pt-4 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <span className="text-xs uppercase font-bold tracking-widest text-amber-500 dark:text-amber-400 block">
            — TARGET SECTORS & DISCIPLINES
          </span>
          <h3
            className={`text-xl sm:text-3xl font-serif font-bold tracking-tight leading-snug ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Websites for tradespeople and service businesses
          </h3>

          <p
            className={`text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            We design for local contractors and service providers who win work from people
            searching on their phones: mobile-responsive, SEO-optimised and built to generate leads.
          </p>

          {/* Industry chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {industryTags.map((tag) => (
              <span
                key={tag}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full border text-[11px] sm:text-xs font-medium transition-all cursor-default ${
                  isLight
                    ? 'border-slate-200 bg-white text-slate-700 hover:border-amber-500 shadow-2xs'
                    : 'border-slate-800 bg-[#121824] text-slate-200 hover:border-amber-400/60'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* HEADING 3: All Client Projects & Case Studies (CHRONOLOGICAL ORDER) */}
        <section
          id="portfolio"
          className={`space-y-6 pt-6 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1.5">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-500 dark:text-amber-400 block">
                — COMPLETE PORTFOLIO & WORK ARCHIVE
              </span>
              <h3
                className={`text-2xl sm:text-3xl md:text-4xl font-serif font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                All Client Projects on Website
              </h3>
              <p
                className={`text-xs sm:text-sm leading-relaxed max-w-xl ${
                  isLight ? 'text-slate-600' : 'text-slate-300'
                }`}
              >
                Every client website and custom software build delivered by Service Websites Agency,
                organized in chronological order from latest 2026 releases.
              </p>
            </div>

            {/* Actions: Add All Projects to Google Drive + Manage in Portal */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {onOpenDriveBackup && (
                <button
                  onClick={onOpenDriveBackup}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30 transition-colors cursor-pointer"
                  title="Add all client projects to your Google Drive folder"
                >
                  <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                  <span>Add All Projects to Google Drive</span>
                </button>
              )}
              {onOpenProjectsView && (
                <button
                  onClick={onOpenProjectsView}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-400/10 hover:bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Manage in Portal ({allProjects.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Filter & Search Controls */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 ${
              isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-[#101623] border-slate-800'
            }`}
          >
            {/* Top row: search + sort toggle */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={portfolioSearch}
                  onChange={(e) => setPortfolioSearch(e.target.value)}
                  placeholder="Search projects by name, trade, client, or deliverables..."
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border transition-colors outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                      : 'bg-slate-900 border-slate-700/80 text-white placeholder-slate-500 focus:border-amber-400'
                  }`}
                />
                {portfolioSearch && (
                  <button
                    onClick={() => setPortfolioSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Toggle */}
              <button
                onClick={() =>
                  setSortOrder(
                    sortOrder === 'chronological_desc'
                      ? 'chronological_asc'
                      : 'chronological_desc'
                  )
                }
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
                title="Toggle timeline sorting order"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {sortOrder === 'chronological_desc'
                    ? 'Latest (2026 First)'
                    : 'Earliest First'}
                </span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { id: 'all', label: `All Projects (${allProjects.length})` },
                { id: 'trades', label: 'Trades & Construction' },
                { id: 'ecommerce', label: 'E-Commerce & Retail' },
                { id: 'corporate', label: 'Corporate & SaaS' },
                { id: 'healthcare', label: 'Healthcare & Apps' },
                { id: 'hospitality', label: 'Hospitality & Dining' },
              ].map((tab) => {
                const isActive = activeCategoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategoryFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : isLight
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Cards List in Chronological Order */}
          <div className="space-y-6 pt-1">
            {filteredProjects.length === 0 ? (
              <div
                className={`p-10 rounded-3xl border text-center space-y-3 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#101622] border-slate-800'
                }`}
              >
                <Search className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold">No projects matched your search</p>
                <button
                  onClick={() => {
                    setActiveCategoryFilter('all');
                    setPortfolioSearch('');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredProjects.map((item, index) => (
                <div
                  key={item.id}
                  className={`rounded-3xl border overflow-hidden transition-all group ${
                    isLight
                      ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                      : 'bg-[#101622] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Image banner with overlay badges */}
                  <div className="relative h-48 sm:h-64 overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Badge top-left */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-amber-300 border border-amber-400/30">
                        {item.badge}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-slate-200 border border-slate-700">
                        {item.dateLabel}
                      </span>
                    </div>

                    {/* Status badge top-right */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-bold border flex items-center gap-1 ${
                          item.status === 'Live & Completed'
                            ? 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40'
                            : 'bg-blue-950/85 text-blue-300 border-blue-500/40'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'Live & Completed'
                              ? 'bg-emerald-400'
                              : 'bg-blue-400 animate-pulse'
                          }`}
                        />
                        <span>{item.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3.5">
                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider">
                      <span className="text-amber-500 dark:text-amber-400">
                        {item.category}
                      </span>
                      <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                        Client: {item.clientName}
                      </span>
                    </div>

                    <h4
                      className={`text-lg sm:text-xl font-serif font-bold ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </h4>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-slate-300'
                      }`}
                    >
                      {item.description}
                    </p>

                    {/* Deliverables checklist preview */}
                    <div className="pt-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                        Deliverables & Features:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {item.deliverables.slice(0, 4).map((deliv, dIdx) => (
                          <div
                            key={dIdx}
                            className={`flex items-center gap-1.5 text-[11px] ${
                              isLight ? 'text-slate-700' : 'text-slate-300'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {item.techStack.map((tech) => (
                        <span
                          key={tech}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                            isLight
                              ? 'bg-slate-100 border-slate-200 text-slate-700'
                              : 'bg-slate-900/80 border-slate-800 text-slate-300'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                      {item.budgetFormatted && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/10 text-amber-500 border border-amber-400/20">
                          Budget: {item.budgetFormatted}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => setSelectedProjectModal(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 dark:text-amber-300 hover:underline cursor-pointer"
                      >
                        <span>View Project Case Study & Scope →</span>
                      </button>

                      <a
                        href={`https://wa.me/27601375180?text=Hi%20Service%20Websites,%20I'm%20interested%20in%20a%20website%20similar%20to%20your%20${encodeURIComponent(
                          item.title
                        )}%20project`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                        <span>Request Similar Website Quote</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* HEADING 4: Google Reviews & What Our Clients Say */}
        <section
          id="reviews"
          className={`space-y-6 pt-4 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500 dark:text-amber-400 block">
              — GOOGLE REVIEWS & TESTIMONIALS
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3
                className={`text-2xl sm:text-4xl font-serif font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                What Our Clients Say
              </h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Google Verified Reviews
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm pt-1">
              <div className="flex items-center text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-900 dark:text-white">5.0</span>
              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                · {GOOGLE_BUSINESS_PROFILE.reviewCount} Google verified reviews
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={GOOGLE_BUSINESS_PROFILE.shareUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition-all cursor-pointer"
            >
              <span>⭐ Leave a Review on Google</span>
            </a>

            <a
              href={GOOGLE_BUSINESS_PROFILE.shareUrl}
              target="_blank"
              rel="noreferrer"
              className={`px-6 py-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isLight
                  ? 'border-blue-300 bg-blue-50/70 hover:bg-blue-100 text-blue-900 shadow-xs'
                  : 'border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/60 text-blue-300'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-[10px]">
                G
              </span>
              <span>View our Google Business Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Embedded Official Google Business Profile Card */}
          <GoogleBusinessProfileCard variant="full" />

          {/* Client review cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111723] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300 font-bold flex items-center justify-center text-sm border border-amber-400/30">
                  M
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    MCD Group
                  </h4>
                  <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Verified Google Review · Industrial Plant Automation
                  </span>
                </div>
              </div>
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Outstanding turnaround time. Our industrial electrical business saw an immediate increase in
                calls from our local Rustenburg area within the first two weeks!
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111723] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold flex items-center justify-center text-sm border border-blue-500/30">
                  V
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Vuka Construction
                  </h4>
                  <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Verified Google Review · Concrete & Waterproofing
                  </span>
                </div>
              </div>
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Professional, clean mobile design and great ongoing support. They set up our Google
                Business profile properly and our quote inquiries doubled across Gauteng and North West.
              </p>
            </div>
          </div>
        </section>

        {/* HEADING 5: Services & Expertise */}
        <section
          id="services"
          className={`space-y-6 pt-4 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500 dark:text-amber-400 block">
              — OUR EXPERTISE
            </span>
            <h3
              className={`text-2xl sm:text-4xl font-serif font-bold ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Website Services Built for South Africa
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Website Design Card */}
            <div
              className={`p-6 rounded-3xl border space-y-3 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111623] border-slate-800'
              }`}
            >
              <h4 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Website Design
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Modern, mobile-first websites for South African SMEs. Fast, beautiful, and
                optimised to convert visitors into paying customers.
              </p>
              <button
                onClick={onOpenDashboard}
                className="text-xs font-bold text-amber-500 dark:text-amber-300 hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Get Started in Portal →</span>
              </button>
            </div>

            {/* Google Business Profile Card */}
            <div
              className={`p-6 rounded-3xl border space-y-3 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111623] border-slate-800'
              }`}
            >
              <h4 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Google Business Profile Management
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Setup, updates, geo-tagged photo posts and review management to dominate local
                Google Maps search in your town.
              </p>
              <span className="text-xs font-bold text-amber-500 dark:text-amber-300 block pt-1">
                Local SEO Optimised →
              </span>
            </div>

            {/* E-Commerce Card */}
            <div
              className={`p-6 rounded-3xl border space-y-3 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111623] border-slate-800'
              }`}
            >
              <h4 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                E-commerce Development
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Online stores with product catalogues, carts and South African payment options
                (PayFast, Ozow, Yoco, Paystack), for businesses that want to sell as well as take
                enquiries.
              </p>
              <a
                href="#ecommerce"
                className="text-xs font-bold text-amber-500 dark:text-amber-300 hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>See E-Commerce in detail →</span>
              </a>
            </div>

            {/* Content Management Card */}
            <div
              className={`p-6 rounded-3xl border space-y-3 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111623] border-slate-800'
              }`}
            >
              <h4 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Content Management (CMS)
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Easy self-service management allowing your team to update project photos, write
                articles, post announcements and update pricing anytime.
              </p>
              <span className="text-xs font-bold text-amber-500 dark:text-amber-300 block pt-1">
                Self-Managed & Secure →
              </span>
            </div>
          </div>
        </section>

        {/* HEADING 6: E-Commerce in Detail */}
        <section
          id="ecommerce"
          className={`space-y-4 pt-4 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isLight
                ? 'bg-amber-50/50 border-amber-300/60 shadow-sm'
                : 'bg-gradient-to-r from-[#121929] to-[#141b2c] border-amber-500/30'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 dark:text-amber-400 block">
              — E-COMMERCE, IN DETAIL
            </span>
            <h4
              className={`text-xl sm:text-2xl font-serif font-bold ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Online stores, blogs and e-commerce websites
            </h4>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              What&apos;s included depends on which kind of site your business needs — shopping carts,
              payment gateways (PayFast, Ozow, Yoco, Paystack), courier tracking, client accounts, and live analytics.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className={`p-3 rounded-2xl border text-center ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <span className="font-bold text-xs text-amber-500 block">PayFast & Ozow</span>
                <span className="text-[10px] text-slate-500">Instant EFT & Card</span>
              </div>
              <div className={`p-3 rounded-2xl border text-center ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <span className="font-bold text-xs text-emerald-500 block">Courier API</span>
                <span className="text-[10px] text-slate-500">Live Parcel Rates</span>
              </div>
              <div className={`p-3 rounded-2xl border text-center ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <span className="font-bold text-xs text-cyan-500 block">Mobile First</span>
                <span className="text-[10px] text-slate-500">99+ Google Speed</span>
              </div>
              <div className={`p-3 rounded-2xl border text-center ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <span className="font-bold text-xs text-indigo-500 block">POPIA Compliant</span>
                <span className="text-[10px] text-slate-500">Encrypted Data</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/27601375180?text=Hi%20Service%20Websites,%20I%20would%20like%20to%20build%20an%20online%20store"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-300 hover:underline"
              >
                <span>Chat to our E-Commerce developers on WhatsApp →</span>
              </a>
            </div>
          </div>
        </section>

        {/* HEADING 7: Our Proven 4-Step Website Launch Process */}
        <section
          id="process"
          className={`space-y-6 pt-4 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500 dark:text-amber-400 block">
              — HOW WE WORK
            </span>
            <h3
              className={`text-2xl sm:text-4xl font-serif font-bold ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Our 4-Step Website Launch Process
            </h3>
            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-xl ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              From initial conversation to live domain and first lead in under two weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Discovery & Brief',
                desc: 'We clarify your services, target towns, and competitor landscape over WhatsApp or phone.',
              },
              {
                step: '02',
                title: 'High-Speed Build',
                desc: 'We construct your custom design with lightning fast loading speeds and mobile layout.',
              },
              {
                step: '03',
                title: 'SEO & Gateways',
                desc: 'Integration of Google Maps tags, WhatsApp click-to-chat, and payment gateways.',
              },
              {
                step: '04',
                title: 'Launch & Handoff',
                desc: 'Domain pointing, SSL activation, Google Search Console indexing, and client dashboard training.',
              },
            ].map((st) => (
              <div
                key={st.step}
                className={`p-5 rounded-2xl border space-y-2 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#111723] border-slate-800'
                }`}
              >
                <span className="text-xs font-mono font-black text-amber-500 dark:text-amber-400">
                  {st.step}
                </span>
                <h5 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {st.title}
                </h5>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HEADING 8: Our Location & Interactive Map */}
        <section
          id="location"
          className={`space-y-6 pt-4 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500 dark:text-amber-400 block">
              — PHYSICAL HEADQUARTERS
            </span>
            <h3
              className={`text-2xl sm:text-4xl font-serif font-bold ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Our Location
            </h3>
            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-xl ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              Moumo Street, Tlhabane, Rustenburg, 0309, South Africa — between Tlhabane Police
              Station and Netcare Ferncrest Hospital. Serving North West & South Africa.
            </p>
          </div>

          {/* Map Preview Card */}
          <div
            className={`rounded-3xl border overflow-hidden relative shadow-xl ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="h-64 sm:h-80 w-full relative">
              <iframe
                title="Service Websites Location"
                src="https://maps.google.com/maps?q=Moumo%20Street,%20Tlhabane,%20Rustenburg&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter contrast-125"
                loading="lazy"
              />
            </div>
            <div
              className={`p-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1420] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Moumo St, Tlhabane, Rustenburg, 0309</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={GOOGLE_BUSINESS_PROFILE.shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Google Business Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={GOOGLE_BUSINESS_PROFILE.mapsSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <span>Directions</span>
                  <Navigation className="w-3.5 h-3.5 text-blue-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Local SEO: Suburbs & Business Areas Served in Rustenburg */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 block">
                  LOCAL SERVICE REGIONS & SUBURBS
                </span>
                <h4 className={`text-sm sm:text-base font-serif font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Websites & Local SEO Across Greater Rustenburg & North West
                </h4>
              </div>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Active Coverage
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {[
                { name: 'Rustenburg CBD', focus: 'Retail, Legal & Corporate' },
                { name: 'Tlhabane & Tlhabane West', focus: 'Trades, Medical & Services' },
                { name: 'Cashan & Safarituine', focus: 'Professional Practices & Consultancies' },
                { name: 'Waterfall East & Mall Area', focus: 'E-Commerce, Auto & Hospitality' },
                { name: 'Phokeng & Royal Bafokeng', focus: 'Mining Services & Contracting' },
                { name: 'Boitekong & Paardekraal', focus: 'Logistics, Industrial & Plant Hire' },
                { name: 'Geelhoutpark & Protea Park', focus: 'Home Services, Education & Clinics' },
                { name: 'Brits & North West Corridor', focus: 'Regional & Nationwide SMEs' },
              ].map((area, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border transition-all ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-amber-400'
                      : 'bg-[#111723] border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-amber-500 dark:text-amber-300">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{area.name}</span>
                  </div>
                  <p className={`text-[10px] mt-1 truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {area.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HEADING 9: Local SEO & Web Design Frequently Asked Questions */}
        <section
          id="faq"
          className={`space-y-4 pt-4 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div className="space-y-1 mb-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500 dark:text-amber-400 block">
              — FREQUENTLY ASKED QUESTIONS
            </span>
            <h3
              className={`text-xl sm:text-3xl font-serif font-bold ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Web Design & Local SEO Questions in Rustenburg
            </h3>
            <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Everything you need to know about getting your business found on Google, building high-converting websites, and growing sales in South Africa.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              {
                q: 'How much does a professional website cost in Rustenburg?',
                a: 'At Service Websites, our website design packages range from R8,500 for high-converting service business websites up to R42,000 for full-scale headless e-commerce platforms with custom South African payment integrations. We provide fixed, transparent quotes with zero hidden fees.',
              },
              {
                q: 'How does Local SEO help my Rustenburg business get customers?',
                a: 'Local SEO ensures your business appears in the top Google Maps "3-Pack" and local organic search results when clients in Rustenburg search for your services (e.g., "plumber near me" or "electrician in Rustenburg"). We implement schema markup, citation building, local keywords, and Google Business Profile optimization to directly generate WhatsApp leads and phone calls.',
              },
              {
                q: 'How long will it take to build and launch our website?',
                a: 'Standard service and trade websites typically launch in 7 to 10 business days from content submission. Custom e-commerce online stores with payment gateways (PayFast, Ozow, Yoco) take approximately 14 to 21 business days.',
              },
              {
                q: 'Are your websites fast and mobile-friendly on South African mobile networks?',
                a: 'Yes. Every website is built mobile-first with 100/100 Google Core Web Vitals optimization. Our pages load in under 1.0 second on standard mobile networks, keeping bounce rates low and maximizing conversion rates for mobile phone visitors.',
              },
              {
                q: 'Can you integrate South African payment gateways and PayFast?',
                a: 'Yes. We support all major South African payment providers including PayFast, Ozow Instant EFT, Yoco, Payflex (Buy Now Pay Later), and Apple Pay, allowing your customers to pay safely via cards, bank apps, and installment plans.',
              },
              {
                q: 'Where is Service Websites located and can we meet in person?',
                a: 'Our agency is physically located on Moumo Street, Tlhabane, Rustenburg, 0309, right between Tlhabane Police Station and Netcare Ferncrest Hospital. We serve businesses throughout Rustenburg, North West, Gauteng, and nationwide via WhatsApp, phone, and in-person consultations.',
              },
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isLight
                      ? 'bg-white border-slate-200'
                      : 'bg-[#111723] border-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-amber-500' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      className={`px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t ${
                        isLight
                          ? 'border-slate-100 text-slate-600 bg-slate-50/50'
                          : 'border-slate-800/80 text-slate-300 bg-[#0d121c]/50'
                      }`}
                    >
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* HEADING 10: Contact Information */}
        <section
          id="contact"
          className={`space-y-4 pt-4 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div className="space-y-1 mb-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500 dark:text-amber-400 block">
              — GET IN TOUCH
            </span>
            <h3
              className={`text-xl sm:text-3xl font-serif font-bold ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Contact Service Websites
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div
              className={`p-5 rounded-2xl border space-y-1 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111723] border-slate-800'
              }`}
            >
              <span className={`text-xs uppercase font-bold tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Direct Telephone & WhatsApp
              </span>
              <a
                href="tel:0601375180"
                className="text-base font-bold text-amber-500 dark:text-amber-300 hover:underline block"
              >
                060 137 5180
              </a>
            </div>

            {/* Website */}
            <div
              className={`p-5 rounded-2xl border space-y-1 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111723] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Globe className="w-4 h-4 text-cyan-500" />
                <span className="text-xs uppercase font-bold tracking-wider">Official Domain</span>
              </div>
              <a
                href="https://www.servicewebsites.co.za"
                target="_blank"
                rel="noreferrer"
                className="text-base font-bold text-amber-500 dark:text-amber-300 hover:underline block"
              >
                www.servicewebsites.co.za
              </a>
            </div>

            {/* Email */}
            <div
              className={`p-5 rounded-2xl border space-y-1 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111723] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-xs uppercase font-bold tracking-wider">Email Inquiries</span>
              </div>
              <a
                href="mailto:manager@servicewebsites.co.za"
                className="text-sm font-bold text-amber-500 dark:text-amber-300 hover:underline block break-all"
              >
                manager@servicewebsites.co.za
              </a>
            </div>

            {/* Address */}
            <div
              className={`p-5 rounded-2xl border space-y-1 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111723] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span className="text-xs uppercase font-bold tracking-wider">Physical Address</span>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-amber-200">
                Moumo St, Tlhabane, Rustenburg, 0309
              </p>
            </div>

            {/* Google Business Profile Verified Card */}
            <div
              className={`p-5 rounded-2xl border space-y-2 sm:col-span-2 ${
                isLight
                  ? 'bg-gradient-to-r from-blue-50/60 to-amber-50/60 border-blue-200 shadow-sm'
                  : 'bg-gradient-to-r from-blue-950/20 to-amber-950/20 border-blue-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      G
                    </span>
                    <span className="text-xs uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                      Verified Google Business Profile
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      5.0 ★ (47 Reviews)
                    </span>
                  </div>
                  <h4
                    className={`text-sm sm:text-base font-serif font-bold mt-1.5 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Service Websites Agency
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Moumo Street, Tlhabane, Rustenburg · KG Machine ID: {GOOGLE_BUSINESS_PROFILE.kgmid}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={GOOGLE_BUSINESS_PROFILE.shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Open on Google</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div
              className={`p-5 rounded-2xl border space-y-1 sm:col-span-2 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111723] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <span className="text-xs uppercase font-bold tracking-wider">Business & Operating Hours</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  Open 24/7
                </span>
              </div>
              <p className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Open 24 hours (Monday – Sunday) · 24/7 Direct WhatsApp & Telephone Response
              </p>
            </div>
          </div>

          {/* Follow Us Social Icons */}
          <div className="pt-6 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500 dark:text-amber-400 block">
              FOLLOW US ON SOCIAL
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 fill-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-black border border-slate-700 flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity"
                aria-label="X / Twitter"
              >
                𝕏
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://reddit.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-[#FF4500] flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity"
                aria-label="Reddit"
              >
                r/
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-black border border-slate-700 flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity"
                aria-label="TikTok"
              >
                🎵
              </a>
            </div>
          </div>
        </section>

        {/* HEADING 10: Agency Footer & Service Directory */}
        <footer
          id="footer"
          className={`border-t pt-8 pb-12 space-y-8 text-xs ${
            isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                {'</>'}
              </div>
              <span
                className={`font-serif font-black tracking-tight text-base uppercase ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                SERVICE WEBSITES AGENCY
              </span>
            </div>
            <p className={`max-w-lg leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Rustenburg leading web design agency. We build fast, modern websites that help South
              African businesses attract more customers and grow online.
            </p>
          </div>

          {/* 5-Column Navigation Grid covering all landing page sectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-2">
            {/* Column 1: Agency & Company */}
            <div className="space-y-2">
              <h5 className="font-bold text-amber-500 dark:text-amber-300 uppercase tracking-wider text-[11px]">
                AGENCY & COMPANY
              </h5>
              <ul className="space-y-1.5">
                <li>
                  <a href="#hero" className="hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('about-us')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    About Service Websites
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('why-choose-us')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Why Choose Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('our-clients')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Our Clients & Case Studies
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('use-cases')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Use Cases & Solutions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-cost-survey-south-africa-2026')}
                    className="text-left hover:underline text-amber-600 dark:text-amber-400 font-semibold transition-colors cursor-pointer"
                  >
                    Website Cost Survey (2026)
                  </button>
                </li>
                <li>
                  <a href="#faq" className="text-left hover:underline text-amber-500 font-medium">
                    Local SEO & Web Design FAQ
                  </a>
                </li>
                <li>
                  <button
                    onClick={onOpenDashboard}
                    className="text-left font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Client Management Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Web Design & Hosting */}
            <div className="space-y-2">
              <h5 className="font-bold text-amber-500 dark:text-amber-300 uppercase tracking-wider text-[11px]">
                WEB DESIGN & HOSTING
              </h5>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-design-rustenburg')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer font-medium"
                  >
                    Web Design Rustenburg
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-design-south-africa')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Web Design South Africa
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('ecommerce-website-south-africa')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    E-Commerce Online Stores
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-hosting-south-africa')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    High-Speed SSD Hosting
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-maintenance-rustenburg')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Website Maintenance Plans
                  </button>
                </li>
                {onOpenDriveBackup && (
                  <li>
                    <button
                      onClick={onOpenDriveBackup}
                      className="text-left text-blue-500 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <HardDrive className="w-3 h-3" />
                      <span>Backup to Google Drive</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Column 3: Local SEO & Google Rankings */}
            <div className="space-y-2">
              <h5 className="font-bold text-amber-500 dark:text-amber-300 uppercase tracking-wider text-[11px]">
                LOCAL SEO & RANKINGS
              </h5>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => handleNavigatePage('local-seo-rustenburg')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer font-medium"
                  >
                    Local SEO Rustenburg
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('local-seo-south-africa')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Local SEO South Africa
                  </button>
                </li>
                <li>
                  <a
                    href={GOOGLE_BUSINESS_PROFILE.shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Google Business Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={GOOGLE_BUSINESS_PROFILE.reviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-500 hover:underline flex items-center gap-1"
                  >
                    <span>Leave 5.0 Star Review</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="hover:underline">
                    Client Testimonials
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Business Software & Portals */}
            <div className="space-y-2">
              <h5 className="font-bold text-amber-500 dark:text-amber-300 uppercase tracking-wider text-[11px]">
                SOFTWARE & PORTALS
              </h5>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => handleNavigatePage('business-software-south-africa')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Business Software SA
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('client-portal-software-south-africa')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer font-medium"
                  >
                    Client Portal Software
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('crm-software-south-africa')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    CRM & Lead Pipelines
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('project-management-software-south-africa')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Project Management System
                  </button>
                </li>
                <li>
                  <a href="#portfolio" className="hover:underline text-amber-500 font-medium">
                    All Live Projects
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5: Industry Trade Solutions */}
            <div className="space-y-2">
              <h5 className="font-bold text-amber-500 dark:text-amber-300 uppercase tracking-wider text-[11px]">
                INDUSTRY SOLUTIONS
              </h5>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-design-for-plumbers')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Web Design for Plumbers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-design-for-electricians')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Web Design for Electricians
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-design-for-builders')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Web Design for Builders
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-design-for-contractors')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Web Design for Contractors
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-design-for-construction-companies')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Construction Companies
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-design-for-cleaning-companies')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Cleaning Companies
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-design-for-lawyers')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Lawyers & Attorneys
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-design-for-restaurants')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    Restaurants & Cafes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigatePage('website-design-for-small-businesses')}
                    className="text-left hover:underline hover:text-amber-500 transition-colors cursor-pointer font-medium text-amber-500"
                  >
                    Small Businesses (SMMEs)
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Landing Pages Directory & Search Grid */}
          <div
            className={`p-4 sm:p-6 rounded-3xl border space-y-4 ${
              isLight
                ? 'bg-gradient-to-br from-slate-50 via-white to-amber-50/40 border-slate-200 shadow-2xs'
                : 'bg-gradient-to-br from-[#0e1422] to-[#0a0e17] border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h4
                    className={`font-serif font-bold text-sm sm:text-base ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    All 25 Service & Industry Landing Pages
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any service guide below to view its full technical specifications, pricing, and FAQs.
                </p>
              </div>

              {/* Quick Search inside footer directory */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 25 pages..."
                  value={footerSearch}
                  onChange={(e) => setFooterSearch(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border outline-none transition-colors ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                      : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400'
                  }`}
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                onClick={() => setFooterCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  footerCategoryFilter === 'all'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                }`}
              >
                All Pages ({LANDING_PAGES.length})
              </button>
              {LANDING_PAGE_CATEGORIES.map((cat) => (
                <button
                  key={cat.group}
                  onClick={() => setFooterCategoryFilter(cat.group)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    footerCategoryFilter === cat.group
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {cat.name} ({cat.pages.length})
                </button>
              ))}
            </div>

            {/* Filtered Pages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2 max-h-96 overflow-y-auto pr-1">
              {LANDING_PAGES.filter((p) => {
                const matchesCategory =
                  footerCategoryFilter === 'all' || p.categoryGroup === footerCategoryFilter;
                const matchesSearch =
                  !footerSearch ||
                  p.title.toLowerCase().includes(footerSearch.toLowerCase()) ||
                  p.metaDescription.toLowerCase().includes(footerSearch.toLowerCase()) ||
                  p.category.toLowerCase().includes(footerSearch.toLowerCase());
                return matchesCategory && matchesSearch;
              }).map((item) => (
                <button
                  key={item.slug}
                  onClick={() => handleNavigatePage(item.slug)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all hover:scale-[1.01] cursor-pointer group ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-amber-400/80 shadow-2xs hover:shadow-xs'
                      : 'bg-[#101623] border-slate-800 hover:border-amber-400/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-semibold text-amber-500 dark:text-amber-400">
                        {item.badge}
                      </span>
                      <span className="text-slate-400">{item.readTime}</span>
                    </div>
                    <h6
                      className={`font-bold text-xs leading-snug group-hover:text-amber-500 transition-colors ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </h6>
                    <p
                      className={`text-[11px] mt-1 line-clamp-2 ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {item.metaDescription}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                    <span>Read full page</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div
            className={`border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] ${
              isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-500'
            }`}
          >
            <span>© 2026 Service Websites Agency (Pty) Ltd. All rights reserved.</span>
            <div className="flex items-center gap-2">
              <a
                href={GOOGLE_BUSINESS_PROFILE.shareUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-500 hover:underline font-medium"
              >
                Google Business Profile: share.google/7Ec5oYGoW892EXMhq
              </a>
              <span>·</span>
              <span>Rustenburg, South Africa 🇿🇦</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* Green WhatsApp button */}
        <a
          href="https://wa.me/27601375180?text=Hello%20Service%20Websites,%20I'm%20interested%20in%20a%20website%20quote"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white" />
        </a>

        {/* Yellow Call button */}
        <a
          href="tel:0601375180"
          className="w-14 h-14 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-400/40 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Call Service Websites"
        >
          <Phone className="w-7 h-7 fill-slate-950" />
        </a>
      </div>

      {/* Interactive Project Details Modal / Drawer */}
      {selectedProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div
            className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f1523] border-slate-800 text-white'
            }`}
          >
            {/* Header Image */}
            <div className="relative h-48 sm:h-56 bg-slate-900 shrink-0">
              <img
                src={selectedProjectModal.image}
                alt={selectedProjectModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <button
                onClick={() => setSelectedProjectModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider mb-2 inline-block">
                  {selectedProjectModal.category}
                </span>
                <h3 className="text-lg sm:text-2xl font-serif font-bold text-white leading-tight">
                  {selectedProjectModal.title}
                </h3>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Client</span>
                  <span className="font-semibold">{selectedProjectModal.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Release</span>
                  <span className="font-semibold">{selectedProjectModal.dateLabel}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                  <span className="font-semibold text-emerald-500">{selectedProjectModal.status}</span>
                </div>
              </div>

              <div>
                <h5 className="font-bold uppercase tracking-wider text-xs text-amber-500 dark:text-amber-400 mb-1">
                  Project Scope & Objective
                </h5>
                <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {selectedProjectModal.description}
                </p>
              </div>

              <div>
                <h5 className="font-bold uppercase tracking-wider text-xs text-amber-500 dark:text-amber-400 mb-2">
                  Key Deliverables & Specifications
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProjectModal.deliverables.map((d, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'
                      }`}
                    >
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-bold uppercase tracking-wider text-xs text-amber-500 dark:text-amber-400 mb-2">
                  Integrated Technologies
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedProjectModal.techStack.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
                        isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                  {selectedProjectModal.budgetFormatted && (
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-400/20 text-amber-500 border border-amber-400/30">
                      Tier: {selectedProjectModal.budgetFormatted}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div
              className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d121c] border-slate-800'
              }`}
            >
              <button
                onClick={() => setSelectedProjectModal(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Close Case Study
              </button>

              <a
                href={`https://wa.me/27601375180?text=Hi%20Service%20Websites,%20I'm%20inquiring%20about%20building%20a%20website%20like%20${encodeURIComponent(
                  selectedProjectModal.title
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Get a Quote for Similar Project</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
