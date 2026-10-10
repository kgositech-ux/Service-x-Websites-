import React, { useState } from 'react';
import {
  HardDrive,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  X,
  Loader2,
  Sparkles,
  FolderOpen,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import { ProjectItem } from '../types';
import { uploadProjectsToGoogleDrive, DriveUploadResult } from '../lib/googleDrive';
import { INITIAL_SAMPLE_PROJECTS } from '../lib/seedData';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getCachedDriveAccessToken, signInWithGoogle } from '../lib/firebase';

interface DriveExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  onExportComplete?: () => void;
}

export const DriveExportModal: React.FC<DriveExportModalProps> = ({
  isOpen,
  onClose,
  projects,
  onExportComplete,
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>('');
  const [uploadResult, setUploadResult] = useState<DriveUploadResult | null>(null);

  if (!isOpen) return null;

  // Ensure projects are never empty by using default agency projects as fallback
  const effectiveProjects =
    projects && projects.length > 0
      ? projects
      : INITIAL_SAMPLE_PROJECTS(user?.email || 'servicewebsites6@gmail.com');

  const totalBudget = effectiveProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const hasCachedToken = Boolean(getCachedDriveAccessToken());

  const handleConfirmUpload = async () => {
    setIsUploading(true);
    setUploadResult(null);
    setUploadStep('Connecting to Google Drive API v3...');

    try {
      const result = await uploadProjectsToGoogleDrive(
        effectiveProjects,
        user?.email || 'servicewebsites6@gmail.com'
      );
      setUploadResult(result);
      if (result.success && onExportComplete) {
        onExportComplete();
      }
    } catch (err: any) {
      setUploadResult({
        success: false,
        error: err?.message || 'Failed to complete Google Drive upload.',
      });
    } finally {
      setIsUploading(false);
      setUploadStep('');
    }
  };

  const handleGoogleSignInFirst = async () => {
    setIsUploading(true);
    setUploadStep('Authorizing Google Drive...');
    try {
      await signInWithGoogle();
      await handleConfirmUpload();
    } catch (err: any) {
      setUploadResult({
        success: false,
        error: 'Google Sign-in was cancelled or encountered an error: ' + (err?.message || ''),
      });
      setIsUploading(false);
      setUploadStep('');
    }
  };

  const handleDownloadLocalJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            agency: 'Service Websites (Service4Websites)',
            website: 'https://service4websites.netlify.app/',
            userEmail: user?.email || 'servicewebsites6@gmail.com',
            totalProjects: effectiveProjects.length,
            totalBudget,
            projects: effectiveProjects,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `ServiceWebsites_All_Projects_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`border rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
            isLight
              ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-500 dark:text-blue-400 shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div className="min-w-0 pr-6">
            <h3 className={`text-base font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Add All Projects to Google Drive
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Preserve and synchronize all website project records to your personal Google Drive
            </p>
          </div>
        </div>

        {/* Confirmation Content */}
        {!uploadResult?.success ? (
          <div className="space-y-4">
            {/* Project List Summary Card */}
            <div
              className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className={`font-semibold flex items-center justify-between pb-1 border-b ${isLight ? 'border-slate-200 text-slate-900' : 'border-slate-800 text-white'}`}>
                <span>Projects to upload:</span>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-cyan-400 font-bold">
                    {effectiveProjects.length} Projects
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    (${totalBudget.toLocaleString()})
                  </span>
                </div>
              </div>

              <ul className={`divide-y max-h-44 overflow-y-auto pr-1 ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
                {effectiveProjects.map((p, idx) => (
                  <li key={p.id || idx} className="py-2 flex items-center justify-between text-[11px] gap-2">
                    <div className="min-w-0">
                      <p className={`font-medium truncate ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {idx + 1}. {p.title}
                      </p>
                      <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {p.clientName} • ${p.budget?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <span
                      className={`capitalize text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        p.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {p.status.replace('_', ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explanatory Confirmation Banner */}
            <div
              className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-950/20 border-blue-800/30 text-blue-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Google Drive Destination:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                With your permission, this action will create a dedicated folder named{' '}
                <strong className="underline">Service Websites - Client Projects</strong> in your Google Drive and upload:
              </p>
              <ul className="list-disc list-inside text-[11px] space-y-0.5 pt-0.5">
                <li><code className="font-mono text-[10px] bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">ServiceWebsites_All_Projects_Backup.json</code> (structured data)</li>
                <li><code className="font-mono text-[10px] bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">ServiceWebsites_Projects_Executive_Report.txt</code> (readable summary)</li>
              </ul>
            </div>

            {/* Error Message */}
            {uploadResult?.error && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-semibold block">Google Drive Connection Notice:</span>
                  <span className="break-words">{uploadResult.error}</span>
                  <p className="mt-1 text-[11px] text-rose-400">
                    Click the official Google button below to grant permission, or save a local JSON copy.
                  </p>
                </div>
              </div>
            )}

            {/* Official Google Sign-in button if not signed in or needs token */}
            {!hasCachedToken && (
              <div className="pt-1 flex flex-col items-center">
                <p className={`text-[11px] mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Authorize access to create project files in your Google Drive:
                </p>
                <button
                  type="button"
                  onClick={handleGoogleSignInFirst}
                  disabled={isUploading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center justify-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-sm cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Authorize & Add All Projects to Google Drive</span>
                </button>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleDownloadLocalJson}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Local JSON</span>
              </button>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUploading}
                  className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                    isLight
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUpload}
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{uploadStep || 'Syncing with Drive...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Confirm & Upload to Drive</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="space-y-4 py-2 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Successfully Added to Google Drive!
              </h4>
              <p className={`text-xs mt-1.5 ${isLight ? 'text-slate-600' : 'text-slate-300'} leading-relaxed`}>
                All <strong className="text-blue-600 dark:text-cyan-400">{uploadResult.totalSynced || effectiveProjects.length} projects</strong>{' '}
                were uploaded into your Google Drive folder{' '}
                <span className="text-emerald-600 dark:text-emerald-300 font-semibold">
                  "Service Websites - Client Projects"
                </span>.
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-xs text-left space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}>
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>Files saved to your Drive:</span>
              </div>
              <p className="text-[11px] truncate text-slate-600 dark:text-slate-400">
                • {uploadResult.fileName} (JSON database)
              </p>
              <p className="text-[11px] truncate text-slate-600 dark:text-slate-400">
                • ServiceWebsites_Projects_Executive_Report.txt (Text summary)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
              {uploadResult.folderLink && (
                <a
                  href={uploadResult.folderLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Open Folder in Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {uploadResult.webLink && !uploadResult.folderLink && (
                <a
                  href={uploadResult.webLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  <span>View in Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href="https://drive.google.com/drive/my-drive"
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>My Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                  isLight
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
