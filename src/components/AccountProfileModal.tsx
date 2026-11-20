import React, { useRef, useState } from 'react';
import {
  X,
  Tag,
  User,
  Phone,
  Mail,
  Calendar,
  Camera,
  LayoutDashboard,
  HardDrive,
  LogOut,
  Upload,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Building,
  UserCog,
  AlertCircle,
  Loader2,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { compressProfileImage } from '../lib/imageUtils';
import { GOOGLE_BUSINESS_PROFILE } from '../lib/googleBusinessProfile';

interface AccountProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDashboard: () => void;
  onOpenProfilePage?: () => void;
  onOpenDriveBackup: () => void;
  onOpenVerificationModal?: () => void;
  onOpenAuthModal?: (tab?: 'signin' | 'signup') => void;
}

export const AccountProfileModal: React.FC<AccountProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenDashboard,
  onOpenProfilePage,
  onOpenDriveBackup,
  onOpenAuthModal,
}) => {
  const { user, profile, updateProfileData, signOut, signIn } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isLoggedIn = Boolean(user || profile);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setIsUploading(true);
    try {
      const compressedDataUri = await compressProfileImage(file, 256, 0.85);
      const res = await updateProfileData({ photoURL: compressedDataUri });
      if (res.success) {
        setToastMessage('Profile photo updated successfully!');
        setTimeout(() => setToastMessage(null), 3000);
        setShowPhotoOptions(false);
      } else {
        setErrorMessage(res.error || 'Could not update profile photo.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to process selected image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyPreset = async (url: string) => {
    setErrorMessage(null);
    setIsUploading(true);
    const res = await updateProfileData({ photoURL: url });
    setIsUploading(false);
    if (res.success) {
      setToastMessage('Profile picture updated!');
      setTimeout(() => setToastMessage(null), 3000);
      setShowPhotoOptions(false);
    } else {
      setErrorMessage(res.error || 'Could not update profile photo.');
    }
  };

  const fallbackAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${profile?.uid || user?.uid || 'guest'}`;
  const activeAvatar = profile?.photoURL || user?.photoURL || fallbackAvatar;

  const username =
    profile?.displayName?.toLowerCase().replace(/\s+/g, '') ||
    user?.displayName?.toLowerCase().replace(/\s+/g, '') ||
    'member';

  const fullName = profile?.displayName || user?.displayName || 'Member';
  const phone = profile?.phone || 'Not provided';
  const company = profile?.company || 'Not specified';
  const email = profile?.email || user?.email || '';
  const dateJoined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-GB')
    : 'Recently joined';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`border rounded-3xl max-w-sm w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#111622] border-slate-800 text-slate-200'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
          }`}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Notifications */}
        {toastMessage && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!isLoggedIn ? (
          /* Logged-out Guest View */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-500 mx-auto flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className={`text-xl font-bold font-serif ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Client Account Access
              </h2>
              <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Sign up or log in to manage your personal profile, upload a custom picture, and track your Service Websites projects.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal?.('signup');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up / Create Account</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal?.('signin');
                }}
                className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLight
                    ? 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                    : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Log In with Email</span>
              </button>
              <button
                onClick={async () => {
                  await signIn();
                }}
                className={`w-full py-2 px-4 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLight
                    ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                    : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        ) : (
          /* Logged-in Profile Summary & Quick Photo Changer */
          <>
            <div className="text-center pt-2 pb-4">
              <div className="relative inline-block group">
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full bg-amber-400/10 border-2 border-amber-400/40 p-1 mx-auto cursor-pointer relative overflow-hidden transition-all hover:scale-105 hover:border-amber-400"
                >
                  <img
                    src={activeAvatar}
                    alt={fullName}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackAvatar;
                    }}
                  />
                  {isUploading ? (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-semibold">
                      <Camera className="w-5 h-5 text-amber-300 mb-0.5" />
                      <span>Upload</span>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                className="text-xs text-amber-600 dark:text-amber-300/90 hover:underline mt-2 font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <span>Tap to change photo</span>
              </button>

              {showPhotoOptions && (
                <div
                  className={`mt-3 p-3 rounded-2xl border text-left space-y-2 animate-in fade-in ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <span className={`text-[11px] font-semibold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Choose Photo:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 cursor-pointer ${
                        isLight ? 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <Upload className="w-3 h-3 text-amber-500" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).slice(2)}`
                        )
                      }
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 cursor-pointer ${
                        isLight ? 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-cyan-500" />
                      <span>Avatar</span>
                    </button>
                  </div>
                </div>
              )}

              <h2 className={`text-xl font-bold font-serif tracking-wide mt-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                @{username}
              </h2>
              <p className={`text-xs mt-0.5 capitalize ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {profile?.role ? `${profile.role} account` : 'Client account'}
              </p>
            </div>

            {/* Personal Details Summary */}
            <div className={`border-t pt-3 pb-2 space-y-3 text-xs ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
              <div className="flex items-start gap-3">
                <div className="text-amber-500 p-1 shrink-0 mt-0.5">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-300/90 block">
                    USERNAME
                  </span>
                  <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>@{username}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-cyan-500 p-1 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-300/90 block">
                    FULL NAME
                  </span>
                  <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{fullName}</span>
                </div>
              </div>

              {company && (
                <div className="flex items-start gap-3">
                  <div className="text-indigo-500 p-1 shrink-0 mt-0.5">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-300/90 block">
                      COMPANY
                    </span>
                    <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{company}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="text-slate-400 p-1 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-300/90 block">
                    PHONE
                  </span>
                  <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-slate-400 p-1 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-300/90 block">
                    EMAIL
                  </span>
                  <span className={`font-medium break-all ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-rose-500 p-1 shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-300/90 block">
                    DATE JOINED
                  </span>
                  <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{dateJoined}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`border-t pt-4 mt-2 space-y-2 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenProfilePage) {
                    onOpenProfilePage();
                  } else {
                    onOpenDashboard();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserCog className="w-4 h-4" />
                <span>View & Edit Full Profile Page</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenDashboard();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Client Portal & Analytics</span>
              </button>

              <a
                href={GOOGLE_BUSINESS_PROFILE.shareUrl}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-2 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLight
                    ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700'
                    : 'border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-[9px]">G</span>
                <span>Google Business Profile (5.0 ★)</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
              </a>

              <button
                onClick={() => {
                  onClose();
                  onOpenDriveBackup();
                }}
                className={`w-full py-2 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <HardDrive className="w-4 h-4 text-amber-500" />
                <span>Backup Projects to Google Drive</span>
              </button>

              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Account</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
