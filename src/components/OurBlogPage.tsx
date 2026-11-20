import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Trophy,
  Bot,
  Network,
  Search,
  FileText,
  Code2,
  MapPin,
  Link2,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  MessageCircle,
  Phone,
  Mail,
  Building,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  BLOG_ARTICLES,
  THREE_SEARCH_LAYERS,
  NINE_SEO_SERVICES,
  CONSULTATION_STEPS,
  CANONICAL_ENTITY_FACTS,
  SeoServicePillar,
} from '../lib/blogData';
import { GOOGLE_BUSINESS_PROFILE } from '../lib/googleBusinessProfile';
import { useTheme } from '../context/ThemeContext';
import { logActivity } from '../lib/activityLogger';

interface OurBlogPageProps {
  onBack: () => void;
  onOpenLandingPage?: (slug: string) => void;
}

export const OurBlogPage: React.FC<OurBlogPageProps> = ({
  onBack,
  onOpenLandingPage,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const consultationRef = useRef<HTMLElement>(null);

  const [selectedSlug, setSelectedSlug] = useState<string>(BLOG_ARTICLES[0].slug);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Consultation form state (matches uploaded form fields)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const activeArticle =
    BLOG_ARTICLES.find((a) => a.slug === selectedSlug) || BLOG_ARTICLES[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Inject matching Schema.org BlogPosting + FAQPage + BreadcrumbList JSON-LD for active article
  useEffect(() => {
    const scriptId = 'service-websites-blog-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          headline: activeArticle.title,
          description: activeArticle.directAnswer,
          datePublished: '2026-11-20',
          dateModified: '2026-11-20',
          author: {
            '@type': 'Organization',
            name: CANONICAL_ENTITY_FACTS.legalName,
            url: 'https://servicewebsites.co.za',
          },
          publisher: {
            '@type': 'Organization',
            name: CANONICAL_ENTITY_FACTS.brandName,
            email: CANONICAL_ENTITY_FACTS.email,
            telephone: '+27601375180',
            sameAs: [GOOGLE_BUSINESS_PROFILE.shareUrl, GOOGLE_BUSINESS_PROFILE.searchUrl],
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://servicewebsites.co.za/#blog/${activeArticle.slug}`,
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: activeArticle.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://servicewebsites.co.za/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Our Blog',
              item: 'https://servicewebsites.co.za/#blog',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: activeArticle.title,
              item: `https://servicewebsites.co.za/#blog/${activeArticle.slug}`,
            },
          ],
        },
      ],
    };

    scriptEl.textContent = JSON.stringify(structuredData);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [activeArticle]);

  const scrollToConsultation = () => {
    consultationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderLayerIcon = (icon: 'Globe' | 'Trophy' | 'Bot') => {
    switch (icon) {
      case 'Globe':
        return <Globe className="w-7 h-7 text-blue-600 dark:text-blue-400" />;
      case 'Trophy':
        return <Trophy className="w-7 h-7 text-amber-500 dark:text-amber-400" />;
      case 'Bot':
        return <Bot className="w-7 h-7 text-blue-600 dark:text-cyan-400" />;
    }
  };

  const renderServiceIcon = (icon: SeoServicePillar['icon']) => {
    const cls = 'w-6 h-6 text-blue-600 dark:text-amber-400';
    switch (icon) {
      case 'Network':
        return <Network className={cls} />;
      case 'Search':
        return <Search className={cls} />;
      case 'FileText':
        return <FileText className={cls} />;
      case 'Code2':
        return <Code2 className={cls} />;
      case 'MapPin':
        return <MapPin className={cls} />;
      case 'Link2':
        return <Link2 className={cls} />;
      case 'Bot':
        return <Bot className={cls} />;
      case 'ShieldCheck':
        return <ShieldCheck className={cls} />;
      case 'BarChart3':
        return <BarChart3 className={cls} />;
    }
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (
      !fullName.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !businessName.trim() ||
      !websiteUrl.trim()
    ) {
      setFormError('Please fill in all required consultation fields.');
      return;
    }

    if (!email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      await logActivity({
        type: 'project_created',
        title: 'Free 30-Min SEO/AEO/GEO Consultation Request',
        description: `${fullName.trim()} (${businessName.trim()} · ${websiteUrl.trim()}) requested an SEO/AEO/GEO review.`,
        actorName: fullName.trim(),
      });
    } catch {
      // Non-fatal if user is browsing unauthenticated
    } finally {
      setSubmitting(false);
      setFormSubmitted(true);
    }
  };

  const whatsappConsultationHref = `https://wa.me/27601375180?text=${encodeURIComponent(
    `Hello Service Websites Agency, I would like to book a Free 30-Minute SEO, AEO & GEO Consultation.\nName: ${
      fullName || 'Client'
    }\nBusiness: ${businessName || 'Not specified'}\nWebsite: ${
      websiteUrl || 'Not specified'
    }\nEmail: ${email || 'Not specified'}\nMobile: ${mobile || 'Not specified'}`
  )}`;

  const surfaceCard = isLight
    ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
    : 'bg-[#101624] border-slate-800 text-slate-100';

  const inputCls = `w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
    isLight
      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white'
      : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400'
  }`;

  return (
    <div
      className={`min-h-screen pb-20 transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0f17] text-slate-100'
      }`}
    >
      {/* Top Sticky Bar (Clean 3-Zone Contract) */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-900'
            : 'bg-[#0d121c]/95 border-slate-800 text-slate-100'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold hover:underline whitespace-nowrap shrink-0 cursor-pointer ${
              isLight ? 'text-slate-800' : 'text-slate-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Service Websites</span>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
            <a
              href="#three-layers"
              className="hover:underline whitespace-nowrap shrink-0"
            >
              SEO, AEO & GEO
            </a>
            <a
              href="#seo-services"
              className="hover:underline whitespace-nowrap shrink-0"
            >
              9 Search Services
            </a>
            <a
              href="#authority-articles"
              className="hover:underline whitespace-nowrap shrink-0"
            >
              Research & Guides
            </a>
            <a
              href="#entity-trust"
              className="hover:underline whitespace-nowrap shrink-0"
            >
              Trust & Entity Data
            </a>
          </nav>

          <button
            type="button"
            onClick={scrollToConsultation}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors"
          >
            Book Free 30-Min Audit
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-16">
        {/* Breadcrumb & Canonical Metadata (Zero-Pill Clean Text) */}
        <div className="space-y-4">
          <nav
            className={`flex flex-wrap items-center gap-2 text-xs ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
            aria-label="Breadcrumb"
          >
            <button
              type="button"
              onClick={onBack}
              className="hover:underline text-amber-600 dark:text-amber-400 font-medium cursor-pointer"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-medium">Our Blog</span>
            <span aria-hidden="true">/</span>
            <span className={isLight ? 'text-slate-800 font-semibold' : 'text-slate-200 font-semibold'}>
              Search Authority & AI Trust Journal
            </span>
          </nav>

          {/* Editorial Hero Section */}
          <section
            className={`rounded-3xl border p-6 sm:p-10 space-y-6 ${
              isLight
                ? 'bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#172554] text-white border-slate-800 shadow-xl'
                : 'bg-gradient-to-br from-[#0e1525] via-[#101829] to-[#0c1a33] text-white border-slate-800 shadow-2xl'
            }`}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-amber-300 font-medium">
              <span>Our Blog</span>
              <span aria-hidden="true">·</span>
              <span>SEO, AEO & GEO Authority</span>
              <span aria-hidden="true">·</span>
              <span>Rustenburg & Nationwide South Africa</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-[1.12] max-w-3xl text-balance">
              Win Both the Google Click and the AI Citation
            </h1>

            <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
              Get found when customers search on Google, and recommended when they ask{' '}
              <strong className="text-white font-semibold">
                ChatGPT, Gemini, Perplexity or Google’s AI Overviews
              </strong>
              .
            </p>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              We combine technical <strong className="text-white">SEO</strong>, content and authority
              building with <strong className="text-white">Answer Engine Optimisation (AEO)</strong>{' '}
              and <strong className="text-white">Generative Engine Optimisation (GEO)</strong>, so your
              business wins both the click and the citation.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="button"
                onClick={scrollToConsultation}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Book Your Free 30-Minute SEO Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-slate-300 leading-snug max-w-sm">
                Not sure where to start? Talk your goals through one-on-one with a senior specialist—with zero obligation.
              </p>
            </div>
          </section>
        </div>

        {/* SECTION 2: Search Has Changed. Your SEO Should Too + 3-Layer Stack */}
        <section id="three-layers" className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-amber-400">
              Three-Layer Modern Search Architecture
            </p>
            <h2
              className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight text-balance ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              Search Has Changed. Your SEO Should Too.
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              Your customers still search Google, but more of their research now starts and ends
              inside an AI answer: Google AI Overviews and AI Mode, ChatGPT, Gemini, Perplexity and
              Copilot. These tools draw on websites they can crawl, understand and trust. If your
              pages are hard to interpret, inconsistent or light on proof, they quote and recommend a
              competitor instead.
            </p>
            <p
              className={`text-sm font-semibold ${
                isLight ? 'text-slate-900' : 'text-slate-100'
              }`}
            >
              That is why our SEO campaigns work on three layers at once.
            </p>
          </div>

          {/* 3 Layers: SEO, AEO, GEO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {THREE_SEARCH_LAYERS.map((layer) => (
              <article
                key={layer.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between space-y-4 ${surfaceCard}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {renderLayerIcon(layer.icon)}
                    <span
                      className={`text-xs font-mono font-semibold ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {layer.tagline}
                    </span>
                  </div>
                  <h3
                    className={`text-xl font-serif font-bold ${
                      isLight ? 'text-slate-950' : 'text-white'
                    }`}
                  >
                    {layer.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    {layer.description}
                  </p>
                </div>

                <div
                  className={`pt-4 border-t text-xs leading-relaxed ${
                    isLight
                      ? 'border-slate-100 text-slate-600'
                      : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>
                    AI Trust Signal:{' '}
                  </strong>
                  {layer.aiSignal}
                </div>
              </article>
            ))}
          </div>

          {/* Thesis Statement Box (No border-l-4, clean hairline border + surface contrast) */}
          <div
            className={`rounded-2xl border p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
              isLight
                ? 'bg-slate-100/80 border-slate-200 text-slate-800'
                : 'bg-slate-900/80 border-slate-800 text-slate-200'
            }`}
          >
            <div className="space-y-2 max-w-2xl">
              <h3
                className={`text-base sm:text-lg font-serif font-bold ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                AEO and GEO do not replace SEO. They are built on it.
              </h3>
              <p className="text-sm leading-relaxed">
                AI assistants rely on the same crawlable, well-structured and credible pages that rank
                on Google, which is why we optimise for all three in one unified programme rather than
                selling them as separate projects.
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToConsultation}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              Talk To An SEO Specialist
            </button>
          </div>
        </section>

        {/* SECTION 3: Our 9 SEO, AEO & GEO Services */}
        <section id="seo-services" className="space-y-8">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-amber-400">
              Full-Stack Search Visibility
            </p>
            <h2
              className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              Our SEO Services
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              One team handling every part of search visibility, from the technical foundations to
              how AI systems talk about your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {NINE_SEO_SERVICES.map((service) => (
              <div
                key={service.number}
                className={`rounded-2xl border p-6 flex flex-col justify-between space-y-4 ${surfaceCard}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        isLight ? 'bg-blue-50' : 'bg-slate-800/80'
                      }`}
                    >
                      {renderServiceIcon(service.icon)}
                    </div>
                    <span
                      className={`text-xs font-mono tabular-nums font-semibold ${
                        isLight ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {service.number}
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold ${
                      isLight ? 'text-slate-950' : 'text-white'
                    }`}
                  >
                    {service.number}. {service.title}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    {service.summary}
                  </p>
                </div>

                <div
                  className={`pt-3 border-t space-y-2 text-xs ${
                    isLight ? 'border-slate-100' : 'border-slate-800'
                  }`}
                >
                  <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                    <strong className={isLight ? 'text-slate-900' : 'text-white'}>
                      Why AI engines reward this:{' '}
                    </strong>
                    {service.whyAiCares}
                  </p>
                  <ul className="space-y-1 pt-1">
                    {service.deliverables.map((item, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2 ${
                          isLight ? 'text-slate-600' : 'text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Topical Authority Articles & AI Answer Library */}
        <section id="authority-articles" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-amber-400">
                Editorial Authority Journal
              </p>
              <h2
                className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                Topical Authority Research & Briefings
              </h2>
            </div>

            {/* Interactive Topic Tabs */}
            <div
              className={`flex flex-wrap gap-1.5 p-1 rounded-xl border ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}
            >
              {BLOG_ARTICLES.map((article, idx) => {
                const isSelected = article.slug === activeArticle.slug;
                return (
                  <button
                    key={article.slug}
                    type="button"
                    onClick={() => {
                      setSelectedSlug(article.slug);
                      setOpenFaqIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? isLight
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'bg-amber-400 text-slate-950'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Guide 0{idx + 1}: {article.category.split('·')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Editorial Article Reader */}
          <article className={`rounded-3xl border p-6 sm:p-10 space-y-6 ${surfaceCard}`}>
            {/* Unboxed Metadata Line */}
            <div
              className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <span className="font-semibold text-blue-600 dark:text-amber-400">
                {activeArticle.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>Published {activeArticle.publishedDate}</span>
              <span aria-hidden="true">·</span>
              <span>Updated {activeArticle.updatedDate}</span>
              <span aria-hidden="true">·</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <div className="space-y-3">
              <h3
                className={`text-2xl sm:text-3xl font-serif font-bold leading-snug text-balance ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                {activeArticle.title}
              </h3>
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-slate-300'
                }`}
              >
                {activeArticle.subtitle}
              </p>
            </div>

            {/* Author & Reviewer E-E-A-T Attribution */}
            <div
              className={`py-3 px-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {activeArticle.authorName}
                  </span>
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                    {' '}
                    — {activeArticle.authorRole}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{activeArticle.reviewerName}</span>
              </div>
            </div>

            {/* Direct Answer Block (AEO Snippet Target) */}
            <div
              className={`rounded-2xl border p-5 space-y-2 ${
                isLight
                  ? 'bg-blue-50/70 border-blue-200 text-slate-900'
                  : 'bg-blue-950/25 border-blue-500/30 text-slate-100'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                Direct Summary Answer (AEO Verified)
              </span>
              <p className="text-sm sm:text-base leading-relaxed font-medium">
                {activeArticle.directAnswer}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="space-y-2">
              <h4
                className={`text-sm font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Key Takeaways
              </h4>
              <ul className="space-y-2 text-sm">
                {activeArticle.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Editorial Sections */}
            <div className="space-y-6 pt-2">
              {activeArticle.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h4
                    className={`text-lg font-serif font-bold ${
                      isLight ? 'text-slate-950' : 'text-white'
                    }`}
                  >
                    {sec.heading}
                  </h4>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className={`text-sm sm:text-base leading-relaxed max-w-prose ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}
                    >
                      {p}
                    </p>
                  ))}
                  {sec.bulletPoints && (
                    <ul className="space-y-2 pt-1 text-sm">
                      {sec.bulletPoints.map((bp, bIdx) => (
                        <li
                          key={bIdx}
                          className={`flex items-start gap-2.5 ${
                            isLight ? 'text-slate-700' : 'text-slate-300'
                          }`}
                        >
                          <span className="font-bold text-amber-500 mt-0.5">•</span>
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Article-Specific Structured FAQs */}
            <div
              className={`pt-6 border-t space-y-3 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}
            >
              <h4
                className={`text-base font-serif font-bold ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                Frequently Asked Questions (FAQPage Schema Synced)
              </h4>
              <div className="space-y-2.5">
                {activeArticle.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border transition-colors ${
                        isLight ? 'border-slate-200 bg-slate-50/70' : 'border-slate-800 bg-slate-950/60'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                        )}
                      </button>
                      {isOpen && (
                        <div
                          className={`px-4 pb-3.5 text-xs sm:text-sm leading-relaxed ${
                            isLight ? 'text-slate-600' : 'text-slate-300'
                          }`}
                        >
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        </section>

        {/* SECTION 5: Canonical Entity & Brand Consistency Proof Card */}
        <section id="entity-trust" className={`rounded-3xl border p-6 sm:p-8 space-y-6 ${surfaceCard}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-amber-400">
                Verifiable Entity Graph & NAP Parity
              </p>
              <h2
                className={`text-xl sm:text-2xl font-serif font-bold ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                Canonical Trust & Brand Facts for Search & AI Engines
              </h2>
            </div>

            <a
              href={GOOGLE_BUSINESS_PROFILE.shareUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <span>Verify on Google Business Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
              <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
                Registered Entity
              </span>
              <span className="font-bold">{CANONICAL_ENTITY_FACTS.legalName}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
              <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
                Physical Address
              </span>
              <span className="font-semibold">{CANONICAL_ENTITY_FACTS.address}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
              <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
                Direct Contact (NAP)
              </span>
              <span className="font-semibold block">{CANONICAL_ENTITY_FACTS.phone}</span>
              <span className="text-xs text-blue-600 dark:text-amber-400">{CANONICAL_ENTITY_FACTS.email}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
              <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
                Google Knowledge Graph ID
              </span>
              <span className="font-mono font-semibold">{CANONICAL_ENTITY_FACTS.kgmid}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
              <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
                Verified Rating & Hours
              </span>
              <span className="font-semibold block">{CANONICAL_ENTITY_FACTS.rating}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">{CANONICAL_ENTITY_FACTS.hours}</span>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
              <span className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
                Primary Service Territory
              </span>
              <span className="text-xs font-medium">{CANONICAL_ENTITY_FACTS.serviceAreas}</span>
            </div>
          </div>

          {onOpenLandingPage && (
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className={isLight ? 'text-slate-500 font-semibold' : 'text-slate-400 font-semibold'}>
                Related Authority Pages:
              </span>
              <button
                type="button"
                onClick={() => onOpenLandingPage('local-seo-rustenburg')}
                className="text-blue-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                Local SEO Rustenburg
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onOpenLandingPage('local-seo-south-africa')}
                className="text-blue-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                Local SEO South Africa
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onOpenLandingPage('about-us')}
                className="text-blue-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                About Us
              </button>
            </div>
          )}
        </section>

        {/* SECTION 6: Book Your Free 30-Minute SEO Consultation + 3-Step Process */}
        <section
          ref={consultationRef}
          id="seo-consultation"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left: Form */}
          <div className={`lg:col-span-7 rounded-3xl border p-6 sm:p-8 space-y-5 ${surfaceCard}`}>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-amber-400">
                Free 30-Minute Review
              </p>
              <h2
                className={`text-xl sm:text-2xl font-serif font-bold ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                Book Your Free SEO, AEO & GEO Consultation
              </h2>
              <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Take the first step to double your leads and sales by booking your{' '}
                <strong className="text-amber-500">FREE</strong> consultation and visibility review.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSubmitted ? (
              <div
                className={`p-6 rounded-2xl border space-y-4 ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
                }`}
              >
                <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Consultation Request Confirmed</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Thank you, <strong>{fullName}</strong>. A senior SEO, AEO & GEO specialist at
                  Service Websites Agency will contact you shortly via <strong>{email}</strong> or{' '}
                  <strong>{mobile}</strong> to confirm your 30-minute consultation for{' '}
                  <strong>{businessName}</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={whatsappConsultationHref}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Fast-Track via WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFullName('');
                      setEmail('');
                      setMobile('');
                      setBusinessName('');
                      setWebsiteUrl('');
                    }}
                    className="text-xs font-semibold underline cursor-pointer"
                  >
                    Submit another website
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="space-y-3.5">
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number *"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Business Name *"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Website URL (e.g. https://yourbusiness.co.za) *"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Submitting Request...' : 'Book Your Free Consultation'}
                </button>
              </form>
            )}
          </div>

          {/* Right: 3-Step Onboarding Timeline */}
          <div className={`lg:col-span-5 rounded-3xl border p-6 sm:p-8 flex flex-col justify-between space-y-6 ${surfaceCard}`}>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-amber-400">
                What Happens Next
              </p>
              <h3
                className={`text-xl font-serif font-bold ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                Your 3-Step SEO Consultation Process
              </h3>
            </div>

            <div className="space-y-6">
              {CONSULTATION_STEPS.map((item, idx) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      isLight
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-800 text-amber-400 border border-slate-700'
                    }`}
                  >
                    0{idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {item.step}: {item.title}
                    </h4>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`pt-4 border-t text-xs flex items-center justify-between gap-2 ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Open 24 Hours · Rustenburg & SA
              </span>
              <a
                href="tel:0601375180"
                className="font-bold text-blue-600 dark:text-amber-400 hover:underline"
              >
                060 137 5180
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 7: Closing CTA Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-8 sm:p-12 text-center space-y-5 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight max-w-xl mx-auto text-balance">
            Grow Your Visibility On Google And AI Search
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-lg mx-auto leading-relaxed">
            Take the first step today. Book your <strong className="text-white">FREE</strong>{' '}
            30-minute SEO, AEO & GEO consultation, with no obligation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={scrollToConsultation}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Book Your Free Consultation
            </button>
            <a
              href={whatsappConsultationHref}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
