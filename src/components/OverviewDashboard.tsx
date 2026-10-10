import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  TrendingUp,
  HardDrive,
  Radio,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Layers,
  Activity,
  UserPlus,
  Clock,
  Camera,
  FolderSync,
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { ProjectItem, UserProfile, ActivityItem } from '../types';
import { INITIAL_SAMPLE_ACTIVITIES } from '../lib/seedData';

interface OverviewDashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenDriveBackup: () => void;
  users: UserProfile[];
  projects: ProjectItem[];
  activeVisitors: number;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  setActiveTab,
  onOpenDriveBackup,
  users,
  projects,
  activeVisitors,
}) => {
  const { user, profile } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_SAMPLE_ACTIVITIES);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Fetch live activity feed from Firestore
  useEffect(() => {
    try {
      const activitiesCol = collection(db, 'activities');
      const unsubscribe = onSnapshot(
        activitiesCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: ActivityItem[] = [];
            snapshot.forEach((docSnap) => {
              fetched.push(docSnap.data() as ActivityItem);
            });
            // Sort by createdAt descending
            fetched.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setActivities(fetched.slice(0, 8));
          } else {
            setActivities(INITIAL_SAMPLE_ACTIVITIES);
          }
          setLoadingActivities(false);
        },
        (error) => {
          console.warn('Using initial activities stream:', error);
          setActivities(INITIAL_SAMPLE_ACTIVITIES);
          setLoadingActivities(false);
        }
      );

      return () => unsubscribe();
    } catch {
      setActivities(INITIAL_SAMPLE_ACTIVITIES);
      setLoadingActivities(false);
    }
  }, []);

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffSeconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSeconds < 60) return 'Just now';
      if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
      if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
      return `${Math.floor(diffSeconds / 86400)}d ago`;
    } catch {
      return 'Recent';
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'project_created':
        return <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
      case 'project_updated':
        return <Layers className="w-3.5 h-3.5 text-indigo-400" />;
      case 'project_completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'user_signup':
        return <UserPlus className="w-3.5 h-3.5 text-purple-400" />;
      case 'profile_updated':
        return <Camera className="w-3.5 h-3.5 text-cyan-400" />;
      case 'drive_synced':
        return <HardDrive className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0 overflow-hidden">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 sm:p-8 relative overflow-hidden shadow-2xl w-full">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Agency Client Hub
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 truncate">service4websites.netlify.app</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight break-words">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {profile?.displayName || user?.displayName || 'Partner'}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Monitor real-time visitor traffic and high-converting client funnels, manage self-service user accounts, and showcase client deliverables directly on the live Service Websites agency website.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mt-4 sm:mt-5">
            <button
              onClick={() => setActiveTab('projects')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-slate-950" />
              <span>Explore All Client Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-medium text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Watch Live Traffic ({activeVisitors})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {/* Real-time traffic */}
        <div
          onClick={() => setActiveTab('analytics')}
          className="bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-emerald-500/50 p-5 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Visitors</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-3xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
            {activeVisitors}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <span>● Real-time beacon active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>View traffic dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Conversion Rate */}
        <div
          onClick={() => setActiveTab('analytics')}
          className="bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-cyan-500/50 p-5 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
            4.85%
          </div>
          <div className="text-[11px] text-cyan-400 font-semibold mt-1">
            +1.2% over target
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Inspect conversion funnel</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Signed-up Users Database */}
        <div
          onClick={() => setActiveTab('users')}
          className="bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-blue-500/50 p-5 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white group-hover:text-blue-300 transition-colors">
            {users.length}
          </div>
          <div className="text-[11px] text-blue-400 font-semibold mt-1">
            Live in Firestore
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Manage accounts database</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Web Projects */}
        <div
          onClick={() => setActiveTab('projects')}
          className="bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-indigo-500/50 p-5 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Client Projects</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white group-hover:text-indigo-300 transition-colors">
            {projects.length}
          </div>
          <div className="text-[11px] text-indigo-400 font-semibold mt-1">
            Featured on Website
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>View projects & deliverables</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>
      </div>

      {/* Main Grid: Activity Feed & Side Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Feed (7 columns) */}
        <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Activity Feed</h3>
                  <p className="text-[11px] text-slate-400">
                    Latest project milestones and user actions fetched from Firestore
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-Time</span>
              </span>
            </div>

            {/* List of activity items */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No recent activities recorded yet.
                </div>
              ) : (
                activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3 text-xs"
                  >
                    {/* Actor avatar with badge */}
                    <div className="relative shrink-0">
                      <img
                        src={
                          act.actorPhoto ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${act.actorName}`
                        }
                        alt={act.actorName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700 bg-slate-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${act.actorName}`;
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 border border-slate-700">
                        {getActivityIcon(act.type)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="font-semibold text-slate-200 truncate">
                          <span className="text-cyan-300 mr-1.5">{act.actorName}</span>
                          <span className="text-white font-medium">{act.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-slate-500" />
                          <span>{formatRelativeTime(act.createdAt)}</span>
                        </span>
                      </div>
                      {act.description && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {act.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Synchronized across team workspaces</span>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>View projects</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column: Active Projects & Signed-Up Users (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Client Projects */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Active Projects</h3>
              </div>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {projects.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{p.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {p.clientName} • {p.category}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-semibold text-emerald-400 block text-xs">
                      ${p.budget?.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-400 capitalize">
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signed Up Users Preview */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Signed Up Users</h3>
              </div>
              <button
                onClick={() => setActiveTab('users')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <span>Directory</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {users.slice(0, 3).map((u) => (
                <div
                  key={u.uid}
                  className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid}`}
                      alt={u.displayName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700 bg-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{u.displayName}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {u.company || u.email}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 capitalize shrink-0">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
