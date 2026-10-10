/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { UsersDatabase } from './components/UsersDatabase';
import { ProfileSettings } from './components/ProfileSettings';
import { ProjectsManager } from './components/ProjectsManager';
import { DriveExportModal } from './components/DriveExportModal';
import { AccountProfileModal } from './components/AccountProfileModal';
import { ServiceWebsitesSite } from './components/ServiceWebsitesSite';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { ProjectItem, UserProfile } from './types';
import {
  seedInitialDataIfEmpty,
  INITIAL_SAMPLE_USERS,
  INITIAL_SAMPLE_PROJECTS,
} from './lib/seedData';

function DashboardContent() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'website' | 'dashboard'>('website');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [activeVisitors, setActiveVisitors] = useState<number>(46);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(
    INITIAL_SAMPLE_PROJECTS('servicewebsites6@gmail.com')
  );

  // Seed initial data once auth is ready
  useEffect(() => {
    if (user?.uid) {
      seedInitialDataIfEmpty(user.uid);
    }
  }, [user]);

  // Keep live track of users count
  useEffect(() => {
    if (!user) {
      setUsersList(INITIAL_SAMPLE_USERS);
      return;
    }
    const unsub = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const uList: UserProfile[] = [];
        snap.forEach((d) => uList.push(d.data() as UserProfile));
        setUsersList(uList);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'users');
      }
    );
    return () => unsub();
  }, [user]);

  // Keep live track of projects count
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        const pList: ProjectItem[] = [];
        snap.forEach((d) => pList.push(d.data() as ProjectItem));
        if (pList.length > 0) {
          setProjectsList(pList);
        } else {
          setProjectsList(INITIAL_SAMPLE_PROJECTS(user?.uid || 'servicewebsites6@gmail.com'));
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'projects');
      }
    );
    return () => unsub();
  }, [user]);

  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-black transition-colors duration-200 overflow-x-hidden w-full max-w-full ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0f17] text-slate-100'
      }`}
    >
      {/* Top Navigation - shown when in Client Dashboard */}
      {viewMode === 'dashboard' && (
        <Navbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenDriveBackup={() => setIsDriveModalOpen(true)}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
          activeVisitorsCount={activeVisitors}
        />
      )}

      {/* Main View Router: Agency Website or Client Dashboard */}
      {viewMode === 'website' ? (
        <ServiceWebsitesSite
          projects={projectsList}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
          onOpenDashboard={() => setViewMode('dashboard')}
          onOpenProjectsView={() => {
            setViewMode('dashboard');
            setActiveTab('projects');
          }}
          onOpenDriveBackup={() => setIsDriveModalOpen(true)}
        />
      ) : (
        /* Full Client Dashboard & Analytics View */
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 w-full min-w-0 overflow-x-hidden">
          {/* Back to website button */}
          <div
            className={`mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            <button
              onClick={() => setViewMode('website')}
              className="text-xs font-semibold text-amber-500 dark:text-amber-300 hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>← Back to Service Websites Agency Site</span>
            </button>
            <span
              className={`text-[11px] sm:text-xs font-medium ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Client & Analytics Management Hub
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 min-w-0 w-full">
            {/* Sidebar */}
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenDriveBackup={() => setIsDriveModalOpen(true)}
              userCount={usersList.length}
              projectCount={projectsList.length}
            />

            {/* Dynamic Main View */}
            <main className="flex-1 min-w-0">
              {activeTab === 'overview' && (
                <OverviewDashboard
                  setActiveTab={setActiveTab}
                  onOpenDriveBackup={() => setIsDriveModalOpen(true)}
                  users={usersList}
                  projects={projectsList}
                  activeVisitors={activeVisitors}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsDashboard
                  activeVisitors={activeVisitors}
                  setActiveVisitors={setActiveVisitors}
                />
              )}

              {activeTab === 'users' && <UsersDatabase />}

              {activeTab === 'projects' && (
                <ProjectsManager onOpenDriveBackup={() => setIsDriveModalOpen(true)} />
              )}

              {activeTab === 'profile' && <ProfileSettings />}
            </main>
          </div>
        </div>
      )}

      {/* Account Profile Modal matching Screenshots 2 & 3 */}
      <AccountProfileModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onOpenDashboard={() => setViewMode('dashboard')}
        onOpenDriveBackup={() => setIsDriveModalOpen(true)}
      />

      {/* Google Drive Export & Backup Confirmation Modal */}
      <DriveExportModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        projects={projectsList}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DashboardContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
