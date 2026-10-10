import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Mail,
  Building,
  Phone,
  Shield,
  Clock,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { INITIAL_SAMPLE_USERS } from '../lib/seedData';

interface UsersDatabaseProps {
  onSelectUserToView?: (user: UserProfile) => void;
}

export const UsersDatabase: React.FC<UsersDatabaseProps> = () => {
  const { user: currentUser, profile: currentProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    displayName: '',
    email: '',
    role: 'client' as 'client' | 'developer' | 'manager' | 'admin',
    company: '',
    phone: '',
    bio: '',
    status: 'active' as 'active' | 'pending' | 'suspended',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  });

  // Listen to live users collection
  useEffect(() => {
    if (!currentUser) {
      setUsers(INITIAL_SAMPLE_USERS);
      setLoading(false);
      return;
    }

    const usersCol = collection(db, 'users');
    const unsubscribe = onSnapshot(
      usersCol,
      (snapshot) => {
        const fetchedUsers: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          fetchedUsers.push(docSnap.data() as UserProfile);
        });

        // If database is empty, seed with initial sample users
        if (fetchedUsers.length === 0) {
          INITIAL_SAMPLE_USERS.forEach(async (u) => {
            try {
              await setDoc(doc(db, 'users', u.uid), u);
            } catch (e) {
              // Ignore duplicate
            }
          });
          setUsers(INITIAL_SAMPLE_USERS);
        } else {
          setUsers(fetchedUsers);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'users');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Filter users based on query and dropdowns
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Update user role or status
  const handleUpdateUserStatus = async (uid: string, newStatus: 'active' | 'pending' | 'suspended') => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      setActionSuccess(`User status updated to ${newStatus}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const handleUpdateUserRole = async (uid: string, newRole: 'client' | 'developer' | 'manager' | 'admin') => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });
      setActionSuccess(`User role updated to ${newRole}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  };

  // Add new user to database
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.displayName) return;

    const generatedUid = `user_${Date.now()}`;
    const userPayload: UserProfile = {
      uid: generatedUid,
      email: newUser.email,
      displayName: newUser.displayName,
      role: newUser.role,
      company: newUser.company || 'Client Partner',
      phone: newUser.phone || '',
      bio: newUser.bio || 'New signed-up member in Service4Websites.',
      status: newUser.status,
      photoURL: newUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${generatedUid}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', generatedUid), userPayload);
      setShowAddUserModal(false);
      setActionSuccess(`New user ${newUser.displayName} added successfully`);
      setNewUser({
        displayName: '',
        email: '',
        role: 'client',
        company: '',
        phone: '',
        bio: '',
        status: 'active',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      });
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${generatedUid}`);
    }
  };

  // Export users database to JSON
  const handleExportUsers = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Service4Websites_Users_Database_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-900/70 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-800 w-full min-w-0">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span>Database of Signed Up Users</span>
              <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {users.length} Registered
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Live Firestore user management, role assignments & client directories
            </p>
          </div>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
          <button
            onClick={handleExportUsers}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all w-full xs:w-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Database</span>
          </button>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all w-full xs:w-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Metric Quick Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-3.5">
          <span className="text-[11px] text-slate-400 block font-medium">Total Signed Up</span>
          <span className="text-xl font-bold text-white mt-0.5 block">{users.length}</span>
        </div>
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-3.5">
          <span className="text-[11px] text-slate-400 block font-medium">Active Clients</span>
          <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
            {users.filter((u) => u.role === 'client' && u.status === 'active').length}
          </span>
        </div>
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-3.5">
          <span className="text-[11px] text-slate-400 block font-medium">Developers & Team</span>
          <span className="text-xl font-bold text-indigo-400 mt-0.5 block">
            {users.filter((u) => u.role === 'developer' || u.role === 'admin' || u.role === 'manager').length}
          </span>
        </div>
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-3.5">
          <span className="text-[11px] text-slate-400 block font-medium">Pending Onboarding</span>
          <span className="text-xl font-bold text-amber-400 mt-0.5 block">
            {users.filter((u) => u.status === 'pending').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="client">Clients</option>
            <option value="developer">Developers</option>
            <option value="manager">Managers</option>
            <option value="admin">Admins</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* User Table / Cards */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">User & Profile Picture</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Signed Up</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No signed up users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = currentUser?.uid === u.uid;
                  return (
                    <tr
                      key={u.uid}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isCurrent ? 'bg-blue-950/15' : ''
                      }`}
                    >
                      {/* User & Editable Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid}`}
                            alt={u.displayName}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700 bg-slate-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid}`;
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-white flex items-center gap-1.5 truncate">
                              <span>{u.displayName}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-medium">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                            u.role === 'admin'
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              : u.role === 'developer'
                              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                              : u.role === 'manager'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {u.role}
                        </span>
                      </td>

                      {/* Company */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5 truncate max-w-[160px]">
                          <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{u.company || 'Private Client'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            u.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : u.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'active'
                                ? 'bg-emerald-400'
                                : u.status === 'pending'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          <span className="capitalize">{u.status}</span>
                        </span>
                      </td>

                      {/* Signed Up Date */}
                      <td className="py-3.5 px-4 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-5">
              <img
                src={selectedUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedUser.uid}`}
                alt={selectedUser.displayName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40 bg-slate-800 shrink-0"
              />
              <div>
                <h3 className="text-lg font-bold text-white">{selectedUser.displayName}</h3>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">
                    {selectedUser.role}
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 py-3 border-y border-slate-800/80 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Company:</span>
                <span className="text-slate-200 font-medium">{selectedUser.company || 'None'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="text-slate-200 font-medium">{selectedUser.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Member ID:</span>
                <span className="text-slate-400 font-mono text-[11px] truncate max-w-[200px]">
                  {selectedUser.uid}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Joined:</span>
                <span className="text-slate-200">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">User Bio:</span>
                <p className="text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  {selectedUser.bio || 'No personal bio available.'}
                </p>
              </div>
            </div>

            {/* Admin / Management controls */}
            <div className="mt-5 space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                Manage Role & Status
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedUser.role}
                  onChange={(e) => {
                    const r = e.target.value as any;
                    handleUpdateUserRole(selectedUser.uid, r);
                    setSelectedUser({ ...selectedUser, role: r });
                  }}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="client">Client</option>
                  <option value="developer">Developer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={selectedUser.status}
                  onChange={(e) => {
                    const s = e.target.value as any;
                    handleUpdateUserStatus(selectedUser.uid, s);
                    setSelectedUser({ ...selectedUser, status: s });
                  }}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Add Signed Up User</h3>
            <p className="text-xs text-slate-400 mb-4">
              Create and provision a new client account directly in Firestore
            </p>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Taylor"
                  value={newUser.displayName}
                  onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jessica@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="client">Client</option>
                    <option value="developer">Developer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="Company or Brand"
                    value={newUser.company}
                    onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Avatar / Photo URL</label>
                <input
                  type="url"
                  value={newUser.photoURL}
                  onChange={(e) => setNewUser({ ...newUser, photoURL: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  placeholder="Notes about client project requirements..."
                  value={newUser.bio}
                  onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
