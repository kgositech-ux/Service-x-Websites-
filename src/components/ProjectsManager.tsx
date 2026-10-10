import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  HardDrive,
  Calendar,
  DollarSign,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  X,
  Trash2,
  Filter,
  Globe,
  Download,
} from 'lucide-react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ProjectItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { INITIAL_SAMPLE_PROJECTS } from '../lib/seedData';
import { logActivity } from '../lib/activityLogger';

interface ProjectsManagerProps {
  onOpenDriveBackup: () => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({ onOpenDriveBackup }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New project state
  const [newProject, setNewProject] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    category: 'Corporate Website',
    status: 'in_progress' as 'planning' | 'in_progress' | 'review' | 'completed',
    budget: 15000,
    deadline: '',
    description: '',
  });

  // Listen to projects collection
  useEffect(() => {
    const projectsCol = collection(db, 'projects');
    const unsubscribe = onSnapshot(
      projectsCol,
      (snapshot) => {
        const fetched: ProjectItem[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push(docSnap.data() as ProjectItem);
        });

        if (fetched.length === 0 && user?.uid) {
          // Seed sample projects
          const sample = INITIAL_SAMPLE_PROJECTS(user.uid);
          sample.forEach(async (p) => {
            try {
              await setDoc(doc(db, 'projects', p.id), p);
            } catch (e) {
              // Ignore
            }
          });
          setProjects(sample);
        } else {
          setProjects(fetched);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'projects');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newProject.title) return;

    const projId = `proj_${Date.now()}`;
    const payload: ProjectItem = {
      id: projId,
      title: newProject.title,
      clientName: newProject.clientName || 'Direct Client',
      clientEmail: newProject.clientEmail || user.email || '',
      ownerId: user.uid,
      category: newProject.category,
      status: newProject.status,
      budget: Number(newProject.budget) || 0,
      deadline: newProject.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      description: newProject.description || 'Full-stack website delivery project.',
      driveSyncStatus: 'not_synced',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'projects', projId), payload);
      await logActivity({
        type: 'project_created',
        title: newProject.title,
        description: `New ${newProject.category} project created with $${Number(newProject.budget).toLocaleString()} budget.`,
        actorName: user.displayName || 'Team Member',
        actorPhoto: user.photoURL || undefined,
        targetId: projId,
      });
      setShowCreateModal(false);
      setNewProject({
        title: '',
        clientName: '',
        clientEmail: '',
        category: 'Corporate Website',
        status: 'in_progress',
        budget: 15000,
        deadline: '',
        description: '',
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `projects/${projId}`);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: 'planning' | 'in_progress' | 'review' | 'completed'
  ) => {
    try {
      const proj = projects.find((p) => p.id === id);
      await updateDoc(doc(db, 'projects', id), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      await logActivity({
        type: newStatus === 'completed' ? 'project_completed' : 'project_updated',
        title: proj?.title || 'Website Project',
        description: `Status advanced to ${newStatus.replace('_', ' ')}.`,
        actorName: user?.displayName || 'Team Member',
        actorPhoto: user?.photoURL || undefined,
        targetId: id,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
    }
  };

  const handleDownloadLocalBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ServiceWebsites_All_Projects_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0 overflow-hidden">
      {/* Banner with Website Showcase & Local Backup */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 p-4 sm:p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5 relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-80 h-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300 shrink-0">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">Live Client Web Projects</h2>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {projects.length} Published
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              All client projects are published live on the agency website with chronological sorting, specs, and case studies.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>New Project</span>
          </button>
          <button
            onClick={handleDownloadLocalBackup}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Download JSON backup locally"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Local JSON</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, category, or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {p.category}
                </span>

                {/* Status selector */}
                <select
                  value={p.status}
                  onChange={(e) => handleUpdateStatus(p.id, e.target.value as any)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border focus:outline-none ${
                    p.status === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : p.status === 'review'
                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      : p.status === 'in_progress'
                      ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {p.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {p.description || 'Custom website development and client portal delivery.'}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <User className="w-3.5 h-3.5" />
                  <span>Client</span>
                </span>
                <span className="font-medium truncate max-w-[150px]">{p.clientName}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Budget</span>
                </span>
                <span className="font-semibold text-emerald-400">
                  ${p.budget?.toLocaleString() || '0'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target Date</span>
                </span>
                <span>{p.deadline || 'TBD'}</span>
              </div>

              {/* Website Showcase status */}
              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-1.5 text-[11px] text-amber-300/80">
                  <Globe className="w-3 h-3 text-amber-400" />
                  <span>Website Status:</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live on Website
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Create Website Project</h3>
            <p className="text-xs text-slate-400 mb-4">
              Track a new web development engagement in Service4Websites
            </p>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Brand Headless E-Commerce"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Corporate Website">Corporate Website</option>
                    <option value="E-Commerce Platform">E-Commerce Platform</option>
                    <option value="Web Application">Web Application</option>
                    <option value="Landing Page & Booking">Landing Page & Booking</option>
                    <option value="SEO Optimization">SEO Optimization</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Budget ($ USD)</label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Project Scope & Deliverables</label>
                <textarea
                  rows={2}
                  placeholder="Key deliverables, tech stack, integrations..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
