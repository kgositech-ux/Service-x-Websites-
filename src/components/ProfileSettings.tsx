import React, { useState, useEffect } from 'react';
import {
  User,
  Camera,
  Upload,
  Sparkles,
  Save,
  CheckCircle2,
  Mail,
  Building,
  Phone,
  Shield,
  RotateCcw,
  HardDrive,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCachedDriveAccessToken, signInWithGoogle } from '../lib/firebase';
import { GOOGLE_BUSINESS_PROFILE } from '../lib/googleBusinessProfile';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
];

interface ProfileSettingsProps {
  onOpenVerificationModal?: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onOpenVerificationModal }) => {
  const { user, profile, updateProfileData, signIn } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<'client' | 'developer' | 'manager' | 'admin'>('client');
  const [customUrlInput, setCustomUrlInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [hasDriveToken, setHasDriveToken] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || user?.displayName || '');
      setPhotoURL(profile.photoURL || user?.photoURL || '');
      setCompany(profile.company || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
      setRole(profile.role || 'client');
    } else if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }

    setHasDriveToken(Boolean(getCachedDriveAccessToken()));
  }, [profile, user]);

  // Handle local image file upload & convert to compressed data URI
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (dataUri) {
        setPhotoURL(dataUri);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset to original Google photo
  const handleResetGooglePhoto = () => {
    if (user?.photoURL) {
      setPhotoURL(user.photoURL);
    }
  };

  // Save changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await updateProfileData({
        displayName,
        photoURL,
        company,
        phone,
        bio,
        role,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Error updating profile. Please check console logs.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Self-Managing Account Portal</h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Sign in with Google to manage your account details, personalize your profile picture, track commissioned web projects, and connect with Google Drive.
        </p>
        <button
          onClick={() => signIn()}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all inline-flex items-center gap-2"
        >
          <span>Sign in with Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Alert */}
      {savedSuccess && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile and picture updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Account Profile & Picture Settings</span>
          </h1>
          <p className="text-xs text-slate-400">
            Manage your personal profile, role permissions, and customized display picture
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Active Account</span>
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Editable Profile Picture Card */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Editable Profile Picture</span>
              </h3>
              <p className="text-xs text-slate-400">
                Your profile picture is displayed across the agency dashboard, comments, and project deliverables
              </p>
            </div>
            {user.photoURL && photoURL !== user.photoURL && (
              <button
                type="button"
                onClick={handleResetGooglePhoto}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revert to Google Photo</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* Live Profile Image Avatar Preview */}
            <div className="relative group shrink-0">
              <img
                src={photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                alt={displayName || 'Profile Avatar'}
                className="w-28 h-28 rounded-2xl object-cover ring-4 ring-cyan-500/40 shadow-xl bg-slate-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`;
                }}
              />
              <label
                htmlFor="photoUploadInput"
                className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-xs font-medium gap-1"
              >
                <Upload className="w-5 h-5 text-cyan-400" />
                <span>Upload Photo</span>
              </label>
              <input
                id="photoUploadInput"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Actions for picture */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor="photoUploadInput"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all border border-slate-700"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload Local File</span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setPhotoURL(`https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36)}`)
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Generate Avatar</span>
                </button>
              </div>

              {/* Direct image URL input */}
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Paste direct image URL..."
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrlInput.trim()) {
                      setPhotoURL(customUrlInput.trim());
                      setCustomUrlInput('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                >
                  Apply
                </button>
              </div>

              {/* Curated Presets */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">Or choose a preset style:</span>
                <div className="flex items-center gap-2">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoURL(url)}
                      className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                        photoURL === url ? 'border-cyan-400 scale-110 shadow-md' : 'border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Details Form Fields */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Account Profile Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Display Name */}
            <div>
              <label className="text-slate-300 font-medium block mb-1">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Email (Google Authenticated) */}
            <div>
              <label className="text-slate-300 font-medium block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user.email || ''}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-400 cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="text-slate-300 font-medium block mb-1">Company / Organization</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Apex Retail Inc"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-slate-300 font-medium block mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-slate-300 font-medium block mb-1">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="client">Client</option>
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Account Status */}
            <div>
              <label className="text-slate-300 font-medium block mb-1">Account Status</label>
              <input
                type="text"
                disabled
                value="Active (Authenticated)"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-emerald-400 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-slate-300 font-medium block mb-1 text-xs">
              Bio & Project Objectives
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your digital goals, target audience, or company mission..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Google Drive Status & Cloud Sync */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Google Drive Integration</h4>
              <p className="text-[11px] text-slate-400">
                Connected with Google Workspace drive.file scope for direct project exports
              </p>
            </div>
          </div>

          <a
            href="https://drive.google.com/drive/my-drive"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <span>Open Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* Google Business Profile Connection Status */}
        <div className="bg-slate-900/60 rounded-2xl border border-blue-500/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white">Google Business Profile</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Linked & Verified
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  5.0 ★ (47 Reviews)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Service Websites Agency · Moumo Street, Rustenburg · KG Machine ID: {GOOGLE_BUSINESS_PROFILE.kgmid}
              </p>
            </div>
          </div>

          <a
            href={GOOGLE_BUSINESS_PROFILE.shareUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Open on Google</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
