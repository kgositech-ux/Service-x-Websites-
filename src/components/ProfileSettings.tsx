import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Camera,
  Upload,
  Sparkles,
  Save,
  CheckCircle2,
  Building,
  Phone,
  Shield,
  ShieldCheck,
  RotateCcw,
  HardDrive,
  ExternalLink,
  LogOut,
  AlertCircle,
  Loader2,
  Trash2,
  Calendar,
  Mail,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { compressProfileImage } from '../lib/imageUtils';
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
  onOpenAuthModal?: (tab?: 'signin' | 'signup') => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  onOpenVerificationModal,
  onOpenAuthModal,
}) => {
  const { user, profile, updateProfileData, signIn, signOut } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<'client' | 'developer' | 'manager' | 'admin'>('client');
  const [customUrlInput, setCustomUrlInput] = useState('');

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeUid = profile?.uid || user?.uid || 'member';
  const activeEmail = profile?.email || user?.email || '';
  const fallbackAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${activeUid}`;

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
  }, [profile, user]);

  const showToast = (msg: string) => {
    setErrorMsg(null);
    setSavedSuccess(msg);
    setTimeout(() => setSavedSuccess(null), 3500);
  };

  // Compress and immediately preview/save uploaded picture
  const processSelectedFile = async (file: File) => {
    setErrorMsg(null);
    setUploadingPhoto(true);
    try {
      const compressedDataUri = await compressProfileImage(file, 256, 0.85);
      setPhotoURL(compressedDataUri);
      const res = await updateProfileData({ photoURL: compressedDataUri });
      if (res.success) {
        showToast('Profile picture uploaded and saved!');
      } else {
        setErrorMsg(res.error || 'Could not save uploaded picture.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to process image file.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  const handleQuickPhotoUpdate = async (newUrl: string, toastLabel: string) => {
    setErrorMsg(null);
    setPhotoURL(newUrl);
    setSaving(true);
    const res = await updateProfileData({ photoURL: newUrl });
    setSaving(false);
    if (res.success) {
      showToast(toastLabel);
    } else {
      setErrorMsg(res.error || 'Failed to update profile picture.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !profile) return;

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      setErrorMsg('Display Name cannot be empty.');
      return;
    }

    setErrorMsg(null);
    setSaving(true);
    const res = await updateProfileData({
      displayName: trimmedName,
      photoURL: photoURL || fallbackAvatar,
      company: company.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      role,
    });
    setSaving(false);

    if (res.success) {
      showToast('Profile details and picture updated successfully!');
    } else {
      setErrorMsg(res.error || 'Failed to save profile changes.');
    }
  };

  // Logged-out auth gate
  if (!user && !profile) {
    return (
      <div
        className={`rounded-2xl border p-8 text-center max-w-lg mx-auto transition-colors ${
          isLight
            ? 'bg-white border-slate-200 shadow-lg text-slate-900'
            : 'bg-slate-900/60 border-slate-800 text-white'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-400/15 text-amber-500 dark:text-amber-400 mx-auto flex items-center justify-center mb-4 border border-amber-400/30">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif mb-2">Your Personal Profile & Settings</h2>
        <p
          className={`text-xs mb-6 leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          Sign up or log in to view and edit your personal details, upload a custom profile picture, and manage your Service Websites projects.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => (onOpenAuthModal ? onOpenAuthModal('signup') : signIn())}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </button>
          <button
            type="button"
            onClick={() => (onOpenAuthModal ? onOpenAuthModal('signin') : signIn())}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border font-semibold text-xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Log In</span>
          </button>
          <button
            type="button"
            onClick={() => signIn()}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border font-semibold text-xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <span>Google Sign-In</span>
          </button>
        </div>
      </div>
    );
  }

  const cardClass = `rounded-2xl border p-5 sm:p-6 transition-colors ${
    isLight
      ? 'bg-white border-slate-200 shadow-sm'
      : 'bg-slate-900/60 border-slate-800 backdrop-blur-md'
  }`;

  const inputClass = `w-full rounded-xl border px-3.5 py-2 text-xs transition-colors focus:outline-none ${
    isLight
      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white'
      : 'bg-slate-950 border-slate-700/80 text-white placeholder-slate-500 focus:border-cyan-500'
  }`;

  const disabledInputClass = `w-full rounded-xl border px-3.5 py-2 text-xs cursor-not-allowed ${
    isLight
      ? 'bg-slate-100 border-slate-200 text-slate-500'
      : 'bg-slate-950/60 border-slate-800 text-slate-400'
  }`;

  const labelClass = `font-semibold block mb-1.5 text-xs ${
    isLight ? 'text-slate-700' : 'text-slate-300'
  }`;

  const usernameHandle = (displayName || profile?.displayName || 'member')
    .toLowerCase()
    .replace(/\s+/g, '');

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Active Member';

  const isVerified = Boolean(profile?.googleVerified || profile?.emailVerified || user?.emailVerified);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Success Toast */}
      {savedSuccess && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-[11px] font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Profile Overview & Summary Card */}
      <div className={cardClass}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={photoURL || fallbackAvatar}
              alt={displayName || 'Profile Avatar'}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/60 shadow-md shrink-0 bg-slate-800"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackAvatar;
              }}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className={`text-lg sm:text-xl font-bold font-serif ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {displayName || 'Your Profile'}
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-600 dark:text-amber-300 border border-amber-400/30 font-semibold capitalize">
                  {role}
                </span>
              </div>
              <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <span>@{usernameHandle}</span>
                {activeEmail && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {activeEmail}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {memberSince}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
            {isVerified ? (
              <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            ) : (
              onOpenVerificationModal && (
                <button
                  type="button"
                  onClick={onOpenVerificationModal}
                  className="text-xs px-3 py-1.5 rounded-xl bg-amber-400/15 text-amber-600 dark:text-amber-300 border border-amber-400/30 font-semibold flex items-center gap-1.5 hover:bg-amber-400/25 transition-colors cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Verify Account</span>
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => signOut()}
              className="text-xs px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Picture Upload & Settings Panel */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`${cardClass} space-y-5 transition-all ${
            isDragging ? 'ring-2 ring-cyan-500 border-cyan-500' : ''
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Camera className="w-4 h-4 text-cyan-500" />
                <span>Profile Picture Settings</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Upload a photo from your device (auto-cropped & compressed), drag-and-drop here, or select an avatar style.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {user?.photoURL && photoURL !== user.photoURL && (
                <button
                  type="button"
                  onClick={() => handleQuickPhotoUpdate(user.photoURL!, 'Reverted to Google photo!')}
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Revert to Google Photo</span>
                </button>
              )}
              {photoURL && photoURL !== fallbackAvatar && (
                <button
                  type="button"
                  onClick={() => handleQuickPhotoUpdate(fallbackAvatar, 'Profile picture reset to default avatar.')}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Photo</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
            {/* Live Profile Image Preview */}
            <div className="relative group shrink-0">
              <img
                src={photoURL || fallbackAvatar}
                alt={displayName || 'Profile Avatar'}
                className={`w-28 h-28 rounded-2xl object-cover ring-4 ring-cyan-500/40 shadow-xl ${
                  isLight ? 'bg-slate-100' : 'bg-slate-800'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackAvatar;
                }}
              />
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center text-white text-[11px] font-semibold gap-1">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                  <span>Processing...</span>
                </div>
              )}
              {!uploadingPhoto && (
                <label
                  htmlFor="photoUploadInput"
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-xs font-medium gap-1"
                >
                  <Upload className="w-5 h-5 text-cyan-400" />
                  <span>Change Photo</span>
                </label>
              )}
              <input
                ref={fileInputRef}
                id="photoUploadInput"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Picture Actions */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor="photoUploadInput"
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all border ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Upload Profile Picture</span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickPhotoUpdate(
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).slice(2)}`,
                      'Generated and saved new avatar!'
                    )
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Generate Avatar</span>
                </button>
              </div>

              {/* Direct image URL input */}
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Or paste an image URL (https://...)..."
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrlInput.trim()) {
                      handleQuickPhotoUpdate(customUrlInput.trim(), 'Profile picture URL applied!');
                      setCustomUrlInput('');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Curated Presets */}
              <div>
                <span className={`text-[11px] block mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Or select a preset style:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickPhotoUpdate(url, 'Preset profile picture saved!')}
                      className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        photoURL === url
                          ? 'border-cyan-500 scale-110 shadow-md'
                          : isLight
                          ? 'border-slate-300 opacity-80 hover:opacity-100'
                          : 'border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Personal Details Form */}
        <div className={`${cardClass} space-y-4`}>
          <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Display Name */}
            <div>
              <label className={labelClass}>Full Name / Display Name *</label>
              <input
                type="text"
                required
                maxLength={100}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={activeEmail}
                  className={disabledInputClass}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {isVerified ? 'Verified' : 'Account Email'}
                </span>
              </div>
            </div>

            {/* Company */}
            <div>
              <label className={labelClass}>Company / Organization</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={150}
                  placeholder="e.g. Apex Retail Inc"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  maxLength={30}
                  placeholder="+27 60 137 5180"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className={labelClass}>Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'client' | 'developer' | 'manager' | 'admin')}
                className={inputClass}
              >
                <option value="client">Client</option>
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Account Status */}
            <div>
              <label className={labelClass}>Account Status</label>
              <input
                type="text"
                disabled
                value={user ? 'Active (Authenticated)' : 'Active (Preview Session)'}
                className={`${disabledInputClass} text-emerald-600 dark:text-emerald-400 font-semibold`}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className={labelClass}>Bio & Project Objectives</label>
            <textarea
              rows={3}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your digital goals, target audience, or company mission..."
              className={inputClass}
            />
          </div>
        </div>

        {/* Google Drive Status */}
        <div className={`${cardClass} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Google Drive Integration
              </h4>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Connected with Google Workspace drive.file scope for direct project exports
              </p>
            </div>
          </div>

          <a
            href="https://drive.google.com/drive/my-drive"
            target="_blank"
            rel="noreferrer"
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            <span>Open Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* Google Business Profile Connection Status */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
            isLight
              ? 'bg-blue-50/50 border-blue-200 shadow-sm'
              : 'bg-slate-900/60 border-blue-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              G
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Google Business Profile
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Linked & Verified
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                  5.0 ★ (47 Reviews)
                </span>
              </div>
              <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Service Websites Agency · Moumo Street, Rustenburg · KG Machine ID: {GOOGLE_BUSINESS_PROFILE.kgmid}
              </p>
            </div>
          </div>

          <a
            href={GOOGLE_BUSINESS_PROFILE.shareUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
          >
            <span>Open on Google</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploadingPhoto}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving Changes...' : 'Save Profile Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
