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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { logActivity } from '../lib/activityLogger';

interface AccountProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDashboard: () => void;
  onOpenDriveBackup: () => void;
}

export const AccountProfileModal: React.FC<AccountProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenDashboard,
  onOpenDriveBackup,
}) => {
  const { user, profile, updateProfileData, signOut, signIn } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle local photo change
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be under 2MB.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUri = event.target?.result as string;
      if (dataUri) {
        await updateProfileData({ photoURL: dataUri });
        await logActivity({
          type: 'profile_updated',
          title: 'Profile Picture Updated',
          description: 'Client profile photo updated via tap to change photo.',
          actorName: profile?.displayName || user?.displayName || 'Service Websites',
          actorPhoto: dataUri,
        });
        setToastMessage('Profile photo updated successfully!');
        setTimeout(() => setToastMessage(null), 3000);
      }
      setIsUploading(false);
      setShowPhotoOptions(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = async (url: string) => {
    await updateProfileData({ photoURL: url });
    await logActivity({
      type: 'profile_updated',
      title: 'Profile Picture Updated',
      description: 'Client profile photo changed to preset avatar.',
      actorName: profile?.displayName || user?.displayName || 'Service Websites',
      actorPhoto: url,
    });
    setToastMessage('Profile picture updated!');
    setTimeout(() => setToastMessage(null), 3000);
    setShowPhotoOptions(false);
  };

  const defaultAvatar =
    profile?.photoURL ||
    user?.photoURL ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

  const username =
    profile?.displayName?.toLowerCase().replace(/\s+/g, '') ||
    user?.displayName?.toLowerCase().replace(/\s+/g, '') ||
    'servicewebsites';

  const fullName = profile?.displayName || user?.displayName || 'Service Websites';
  const phone = profile?.phone || '0601375180';
  const email = user?.email || 'servicewebsites6@gmail.com';
  const dateJoined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-GB')
    : '27/09/2026';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`border rounded-3xl max-w-sm w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#111622] border-slate-800 text-slate-200'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Toast */}
        {toastMessage && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Avatar with "Tap to change photo" matching Screenshot 2 & 3 */}
        <div className="text-center pt-2 pb-4">
          <div className="relative inline-block group">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full bg-amber-400/10 border-2 border-amber-400/40 p-1 mx-auto cursor-pointer relative overflow-hidden transition-all hover:scale-105 hover:border-amber-400"
            >
              <img
                src={defaultAvatar}
                alt="Service Websites"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-semibold">
                <Camera className="w-5 h-5 text-amber-300 mb-0.5" />
                <span>Upload</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <button
            onClick={() => setShowPhotoOptions(!showPhotoOptions)}
            className="text-xs text-amber-300/90 hover:text-amber-200 mt-2 font-medium flex items-center justify-center gap-1 mx-auto"
          >
            <span>Tap to change photo</span>
          </button>

          {/* Collapsible Photo Options */}
          {showPhotoOptions && (
            <div className="mt-3 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-left space-y-2 animate-in fade-in">
              <span className="text-[11px] font-semibold text-slate-400 block">Choose Photo:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center gap-1"
                >
                  <Upload className="w-3 h-3 text-amber-400" />
                  <span>Local File</span>
                </button>
                <button
                  onClick={() =>
                    handleApplyPreset(
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36)}`
                    )
                  }
                  className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Avatar</span>
                </button>
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold font-serif text-white tracking-wide mt-3">
            @{username}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 capitalize">
            {profile?.role ? `${profile.role} account` : 'Client account'}
          </p>
        </div>

        {/* Information List (matches Screenshot 2 & 3 exactly) */}
        <div className="border-t border-slate-800/80 pt-3 pb-2 space-y-3.5 text-xs">
          {/* USERNAME */}
          <div className="flex items-start gap-3">
            <div className="text-amber-400 p-1 shrink-0 mt-0.5">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/90 block">
                USERNAME
              </span>
              <span className="text-slate-100 font-medium">@{username}</span>
            </div>
          </div>

          {/* FULL NAME */}
          <div className="flex items-start gap-3">
            <div className="text-cyan-400 p-1 shrink-0 mt-0.5">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/90 block">
                FULL NAME
              </span>
              <span className="text-slate-100 font-medium">{fullName}</span>
            </div>
          </div>

          {/* PHONE */}
          <div className="flex items-start gap-3">
            <div className="text-slate-400 p-1 shrink-0 mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/90 block">
                PHONE
              </span>
              <span className="text-slate-100 font-medium">{phone}</span>
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex items-start gap-3">
            <div className="text-slate-400 p-1 shrink-0 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/90 block">
                EMAIL
              </span>
              <span className="text-slate-100 font-medium break-all">{email}</span>
            </div>
          </div>

          {/* DATE JOINED */}
          <div className="flex items-start gap-3">
            <div className="text-rose-400 p-1 shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/90 block">
                DATE JOINED
              </span>
              <span className="text-slate-100 font-medium">{dateJoined}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Integration Actions */}
        <div className="border-t border-slate-800/80 pt-4 mt-2 space-y-2">
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

          <button
            onClick={() => {
              onClose();
              onOpenDriveBackup();
            }}
            className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-all"
          >
            <HardDrive className="w-4 h-4 text-amber-400" />
            <span>Backup Projects to Google Drive</span>
          </button>

          {user ? (
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="w-full py-1.5 text-xs text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="w-full py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
