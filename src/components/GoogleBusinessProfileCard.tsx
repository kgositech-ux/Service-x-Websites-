import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  ExternalLink,
  CheckCircle2,
  Share2,
  Navigation,
  Globe,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { GOOGLE_BUSINESS_PROFILE } from '../lib/googleBusinessProfile';
import { useTheme } from '../context/ThemeContext';

interface GoogleBusinessProfileCardProps {
  variant?: 'full' | 'dashboard' | 'compact' | 'badge';
  className?: string;
}

export const GoogleBusinessProfileCard: React.FC<GoogleBusinessProfileCardProps> = ({
  variant = 'full',
  className = '',
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const gbp = GOOGLE_BUSINESS_PROFILE;

  if (variant === 'badge') {
    return (
      <a
        href={gbp.shareUrl}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer ${
          isLight
            ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
            : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-white'
        } ${className}`}
        title="View Service Websites on Google Business Profile"
      >
        {/* Google G icon badge */}
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white shadow-xs text-[10px] font-bold text-blue-600">
          G
        </span>
        <div className="flex items-center text-amber-400 gap-0.5">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span className="font-bold text-xs text-slate-900 dark:text-white">
            {gbp.rating.toFixed(1)}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
          ({gbp.reviewCount} reviews)
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          Verified Profile
        </span>
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#111723] border-slate-800 text-white'
        } ${className}`}
      >
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              G
            </span>
            <div>
              <h4 className="text-xs font-bold leading-tight truncate">
                {gbp.name}
              </h4>
              <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified Google Business Profile
              </span>
            </div>
          </div>
          <a
            href={gbp.shareUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-amber-500 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-2 text-xs mb-2">
          <div className="flex text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
            ))}
          </div>
          <span className="font-bold">{gbp.rating.toFixed(1)}</span>
          <span className="text-slate-500 text-[11px]">
            · {gbp.reviewCount} Google reviews
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 truncate">
          {gbp.address.fullFormatted}
        </p>

        <div className="flex items-center gap-2">
          <a
            href={gbp.shareUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] text-center transition-colors shadow-xs"
          >
            Open Profile
          </a>
          <a
            href={`tel:${gbp.contact.phone.replace(/\s+/g, '')}`}
            className="py-1.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold transition-colors"
          >
            Call
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white to-amber-50/30 border-amber-200/80 shadow-sm'
            : 'bg-gradient-to-br from-[#111723] to-[#0d121c] border-amber-500/20 shadow-lg'
        } ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                G
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4
                  className={`font-serif font-bold text-sm ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {gbp.name}
                </h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Google Business Profile Linked · ID: {gbp.kgmid}
              </p>
            </div>
          </div>

          <a
            href={gbp.shareUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-xs"
          >
            <span>View on Google</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3.5 border-b border-slate-200 dark:border-slate-800 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Google Rating
            </span>
            <div className="flex items-center justify-center gap-1 font-serif font-bold text-lg text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{gbp.rating.toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-slate-500">5.0 Star Peak</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Verified Reviews
            </span>
            <div className="font-serif font-bold text-lg text-slate-900 dark:text-white">
              {gbp.reviewCount}+
            </div>
            <span className="text-[10px] text-emerald-500 font-medium">100% Positive</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Local SEO Rank
            </span>
            <div className="font-serif font-bold text-lg text-blue-500">#1</div>
            <span className="text-[10px] text-slate-500">Rustenburg Area</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Listing Status
            </span>
            <div className="font-serif font-bold text-lg text-emerald-500">Active</div>
            <span className="text-[10px] text-slate-500">Direct Search Feed</span>
          </div>
        </div>

        {/* Details snippet */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{gbp.address.fullFormatted}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={gbp.shareUrl}
              target="_blank"
              rel="noreferrer"
              className="text-amber-500 hover:underline font-semibold text-xs flex items-center gap-1"
            >
              <span>share.google link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Default 'full' variant
  return (
    <div
      className={`rounded-3xl border overflow-hidden transition-all shadow-xl ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900'
          : 'bg-[#0f1523] border-slate-800 text-white'
      } ${className}`}
    >
      {/* Top Banner with Google Verification Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900/30 via-amber-900/20 to-emerald-900/30 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            {/* Google Logo Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-2xl shadow-md border border-slate-200 shrink-0">
              <span className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] bg-clip-text text-transparent">
                G
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4
                  className={`font-serif font-bold text-lg sm:text-xl ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {gbp.name}
                </h4>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  Google Verified Business
                </span>
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {gbp.category} · Rustenburg & Nationwide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <a
              href={gbp.shareUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 transition-all cursor-pointer"
            >
              <span>View on Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Rating Summary Bar */}
        <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              {gbp.rating.toFixed(1)} / 5.0
            </span>
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
              · Based on {gbp.reviewCount} verified client reviews on Google
            </span>
          </div>

          <a
            href={gbp.reviewUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Write a Google Review</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Card Body - Key NAP Details (Name, Address, Phone, Hours) */}
      <div className="p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Address */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Physical Office & Location
              </span>
              <p
                className={`font-semibold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {gbp.address.street}, {gbp.address.suburb}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {gbp.address.city}, {gbp.address.province}, {gbp.address.postalCode}
              </p>
              <a
                href={gbp.mapsSearchUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-500 hover:underline cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                <span>Get Driving Directions</span>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Direct Phone & WhatsApp Line
              </span>
              <a
                href={`tel:${gbp.contact.phone.replace(/\s+/g, '')}`}
                className="text-base font-bold text-amber-600 dark:text-amber-400 hover:underline block"
              >
                {gbp.contact.phone}
              </a>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Available for instant consultation & quotes
              </p>
              <a
                href={gbp.contact.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-500 hover:underline cursor-pointer"
              >
                <MessageCircle className="w-3 h-3 fill-emerald-500 text-transparent" />
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Operating Hours & Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Operating Hours */}
          <div
            className={`p-4 rounded-2xl border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  Business Hours
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                Open 24/7
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              {gbp.openingHours.map((h, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>
                    {h.days}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {h.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <div
            className={`p-4 rounded-2xl border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                Local & National Service Areas
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {gbp.serviceAreas.map((area, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700'
                      : 'bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Verified Profile Link Bar */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            isLight
              ? 'bg-amber-50/50 border-amber-200 text-amber-900'
              : 'bg-amber-400/5 border-amber-400/20 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-medium">
              Official Profile Share Link:{' '}
              <span className="font-mono font-bold">{gbp.shareUrl}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={gbp.shareUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-colors cursor-pointer shadow-xs"
            >
              Open Profile in Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
