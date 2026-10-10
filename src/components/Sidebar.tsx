import React from 'react';
import {
  LayoutDashboard,
  LineChart,
  Users,
  Briefcase,
  UserCheck,
  HardDrive,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDriveBackup: () => void;
  userCount: number;
  projectCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDriveBackup,
  userCount,
  projectCount,
}) => {
  const { user, profile } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const navItems = [
    {
      id: 'overview',
      label: 'Agency Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'analytics',
      label: 'Real-Time Analytics',
      icon: LineChart,
      badge: 'Live',
      badgeColor: isLight
        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'users',
      label: 'Signed Up Users',
      icon: Users,
      badge: userCount > 0 ? `${userCount}` : null,
      badgeColor: isLight
        ? 'bg-blue-100 text-blue-800 border border-blue-200'
        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    },
    {
      id: 'projects',
      label: 'Client Projects',
      icon: Briefcase,
      badge: projectCount > 0 ? `${projectCount}` : null,
      badgeColor: isLight
        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
    {
      id: 'profile',
      label: 'Profile & Picture',
      icon: UserCheck,
      badge: 'Self-Service',
      badgeColor: isLight
        ? 'bg-amber-100 text-amber-800 border border-amber-200'
        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 min-w-0">
      <div className="lg:sticky lg:top-20 space-y-4 lg:space-y-6">
        {/* Navigation list */}
        <div
          className={`rounded-2xl border p-2.5 sm:p-3 transition-colors ${
            isLight
              ? 'bg-white border-slate-200 shadow-sm'
              : 'bg-slate-900/60 backdrop-blur-md border-slate-800/80 shadow-xl'
          }`}
        >
          <div
            className={`px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Workspace Navigation
          </div>
          <nav className="flex lg:flex-col overflow-x-auto pb-1 lg:pb-0 gap-1.5 lg:gap-1 no-scrollbar w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 lg:shrink lg:w-full whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                      : isLight
                      ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Auxiliary Cards (Shown on large screens so mobile stays focused) */}
        <div className="hidden lg:block space-y-6">
          {/* Agency Website Live Showcase Card */}
          <div
            className={`rounded-2xl border p-4 shadow-xl relative overflow-hidden transition-colors ${
              isLight
                ? 'bg-gradient-to-br from-amber-50 via-amber-100/40 to-white border-amber-200'
                : 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border-amber-800/40'
            }`}
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2.5 mb-2.5">
              <div
                className={`p-2 rounded-lg border ${
                  isLight
                    ? 'bg-amber-100 border-amber-200 text-amber-700'
                    : 'bg-amber-500/20 border-amber-400/30 text-amber-300'
                }`}
              >
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Agency Live Portfolio
                </h4>
                <p className={`text-[11px] ${isLight ? 'text-amber-700' : 'text-amber-300/80'}`}>
                  {projectCount} Projects Featured
                </p>
              </div>
            </div>
            <p
              className={`text-xs mb-3 leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              All client projects and case studies are published live as rich interactive content on the website.
            </p>
            <button
              onClick={() => setActiveTab('projects')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Manage Featured Projects</span>
            </button>
          </div>

          {/* Agency Website Reference Card */}
          <div
            className={`rounded-2xl border p-4 transition-colors ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] uppercase tracking-wider font-semibold ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Connected Agency
              </span>
              <a
                href="https://service4websites.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Visit Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div
              className={`text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-300'}`}
            >
              service4websites.netlify.app
            </div>
            <p
              className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
            >
              Real-time analytics beacon active. High-converting client funnels monitored.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
