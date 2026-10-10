import React from 'react';
import {
  Globe,
  Radio,
  HardDrive,
  LogOut,
  UserCircle,
  ShieldCheck,
  ChevronDown,
  Layers,
  LayoutDashboard,
  Briefcase,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  viewMode: 'website' | 'dashboard';
  setViewMode: (mode: 'website' | 'dashboard') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDriveBackup: () => void;
  onOpenAccountModal: () => void;
  activeVisitorsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  onOpenDriveBackup,
  onOpenAccountModal,
  activeVisitorsCount,
}) => {
  const { user, profile, signIn, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const defaultAvatar =
    profile?.photoURL ||
    user?.photoURL ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

  const username =
    profile?.displayName?.toLowerCase().replace(/\s+/g, '') ||
    user?.displayName?.toLowerCase().replace(/\s+/g, '') ||
    'servicewebsites';

  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors w-full overflow-hidden ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
          : 'bg-[#0d121c]/95 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-4 w-full min-w-0">
        {/* Brand */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 shrink"
          onClick={() => {
            setViewMode('website');
          }}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs sm:text-sm tracking-tighter shadow-md shadow-amber-400/20 shrink-0">
            {'</>'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className={`font-serif font-black tracking-tight text-xs sm:text-base md:text-lg leading-tight uppercase truncate ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                SERVICE WEBSITES
              </span>
              <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-500 dark:text-amber-300 border border-amber-400/30 shrink-0">
                AGENCY
              </span>
            </div>
            <p
              className={`text-[9px] uppercase tracking-wider hidden lg:block truncate ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              WEB DESIGN, SEO AND SOFTWARE
            </p>
          </div>
        </div>

        {/* Quick Link to Agency Site */}
        <button
          onClick={() => setViewMode('website')}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold transition-all shrink-0 ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
          }`}
          title="Return to Agency Website"
        >
          <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="hidden sm:inline">Agency </span>
          <span>Website</span>
        </button>

        {/* Center / Quick Status: Live Visitors & Drive Backup */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Live Visitor Traffic Indicator */}
          <button
            onClick={() => {
              setViewMode('dashboard');
              setActiveTab('analytics');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              viewMode === 'dashboard' && activeTab === 'analytics'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300 shadow-sm'
                : isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
            title="Real-time traffic monitor"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Radio className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              <strong className="text-emerald-600 dark:text-emerald-400">{activeVisitorsCount}</strong> Live Visitors
            </span>
          </button>

          {/* Quick Client Projects Button */}
          <button
            onClick={() => {
              setViewMode('dashboard');
              setActiveTab('projects');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              viewMode === 'dashboard' && activeTab === 'projects'
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                : 'bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/30 text-amber-600 dark:text-amber-300'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Client Projects</span>
          </button>
        </div>

        {/* Right side: Theme Switcher & Account Button */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all flex items-center justify-center text-xs font-semibold ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white'
            }`}
            title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            aria-label="Toggle Theme"
          >
            {isLight ? (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
            ) : (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            )}
          </button>

          {/* Pill button matching Screenshot 1 */}
          <button
            onClick={onOpenAccountModal}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              isLight
                ? 'border-amber-500/50 bg-amber-50 hover:bg-amber-100/60 text-amber-900'
                : 'border-amber-400/40 bg-amber-400/5 hover:bg-amber-400/15 text-amber-200'
            }`}
            title="Open Account Profile & Settings"
          >
            <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-[10px] font-bold text-amber-500 dark:text-amber-300 overflow-hidden shrink-0">
              <img
                src={defaultAvatar}
                alt="avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
                }}
              />
            </div>
            <span className="hidden md:inline">@{username}</span>
          </button>

          {/* Sign In / Sign Out or User menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`p-1.5 sm:p-2 rounded-xl border transition-colors ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Account options"
              >
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {userMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl py-2 z-50 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-800'
                      : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className={`px-4 py-2.5 border-b ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Signed in as
                    </p>
                    <p className="text-sm font-bold truncate">
                      {profile?.displayName || user.displayName || 'Service Websites'}
                    </p>
                    <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={onOpenAccountModal}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 ${
                        isLight ? 'hover:bg-slate-50 text-amber-700 font-medium' : 'hover:bg-slate-800 text-amber-300'
                      }`}
                    >
                      <UserCircle className="w-4 h-4 text-amber-500" />
                      <span>Account Profile Panel</span>
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('dashboard');
                        setActiveTab('profile');
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 ${
                        isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <UserCircle className="w-4 h-4 text-cyan-500" />
                      <span>Edit Profile Picture & Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('dashboard');
                        setActiveTab('projects');
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 ${
                        isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span>Client Projects</span>
                    </button>
                    <button
                      onClick={onOpenDriveBackup}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 ${
                        isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <HardDrive className="w-4 h-4 text-blue-500" />
                      <span>Sync Projects to Google Drive</span>
                    </button>
                  </div>

                  <div className={`border-t pt-1 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-rose-500/10 text-rose-500 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
