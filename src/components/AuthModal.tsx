import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signup',
  onSuccess,
}) => {
  const { signIn, signInWithEmail, signUpWithEmail, resetPassword, signInDemo } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Sync initial tab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError(null);
      setSuccessMessage(null);
      setShowForgotPassword(false);
      setResetSent(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your email address and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await signUpWithEmail(
      email.trim(),
      password,
      name.trim() || 'Service Websites Member',
      company.trim(),
      phone.trim()
    );

    setLoading(false);

    if (result.success) {
      setSuccessMessage('Account created successfully! Welcome to Service Websites.');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1000);
    } else {
      setError(result.error || 'Failed to create account.');
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    const result = await signInWithEmail(email.trim(), password);
    setLoading(false);

    if (result.success) {
      setSuccessMessage('Signed in successfully! Redirecting...');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 800);
    } else {
      setError(result.error || 'Failed to sign in.');
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    const result = await signIn();
    setLoading(false);

    if (result.success) {
      setSuccessMessage('Signed in with Google successfully!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 800);
    } else if (result.error && !result.error.includes('cancelled')) {
      setError(result.error);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your account email address first.');
      return;
    }
    setLoading(true);
    const res = await resetPassword(email.trim());
    setLoading(false);
    if (res.success) {
      setResetSent(true);
      setError(null);
    } else {
      setError(res.error || 'Failed to send password reset email.');
    }
  };

  const handleDemoSignIn = async (role: 'client' | 'admin') => {
    setLoading(true);
    await signInDemo(role);
    setLoading(false);
    setSuccessMessage(`Logged in as ${role === 'admin' ? 'Agency Manager' : 'Client Partner'}!`);
    setTimeout(() => {
      onClose();
      if (onSuccess) onSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`border rounded-3xl max-w-md w-full max-h-[94vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 transition-all ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#111622] border-slate-800 text-slate-100'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand header */}
        <div className="text-center pb-4 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base mx-auto mb-3 shadow-lg shadow-amber-400/20">
            {'</>'}
          </div>
          <h2 className="text-xl font-bold font-serif tracking-tight">
            {activeTab === 'signup' ? 'Create Client Account' : 'Welcome Back'}
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {activeTab === 'signup'
              ? 'Join Service Websites to manage projects, verify your business, and access deliverables.'
              : 'Sign in to access your client projects, Google Drive sync, and analytics.'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up (New Client)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* 1-Click Google Sign In (Primary Fast Flow) */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-3 text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-60 mb-4 ${
            isLight
              ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
              : 'border-slate-700 bg-slate-800/90 hover:bg-slate-800 text-white'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span>{activeTab === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex-1 h-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            or with email
          </span>
          <div className={`flex-1 h-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
        </div>

        {/* FORMS */}
        {activeTab === 'signup' ? (
          /* SIGN UP FORM */
          <form onSubmit={handleEmailSignUp} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold mb-1 opacity-80">
                Full Name or Business Contact *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sipho Ndlovu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900'
                      : 'bg-slate-900 border-slate-800 focus:border-amber-400 text-white'
                  }`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold mb-1 opacity-80">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
                <input
                  type="email"
                  required
                  placeholder="you@company.co.za"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900'
                      : 'bg-slate-900 border-slate-800 focus:border-amber-400 text-white'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold mb-1 opacity-80">
                Create Password (min. 6 characters) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-9 py-2 rounded-xl border text-xs font-medium outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900'
                      : 'bg-slate-900 border-slate-800 focus:border-amber-400 text-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Company & Phone (optional) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-bold mb-1 opacity-70">
                  Company (Optional)
                </label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-50" />
                  <input
                    type="text"
                    placeholder="e.g. Apex Apparel"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={`w-full pl-8 pr-2 py-2 rounded-xl border text-xs outline-none ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 focus:border-amber-500'
                        : 'bg-slate-900 border-slate-800 focus:border-amber-400'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold mb-1 opacity-70">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-50" />
                  <input
                    type="tel"
                    placeholder="060 137 5180"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-8 pr-2 py-2 rounded-xl border text-xs outline-none ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 focus:border-amber-500'
                        : 'bg-slate-900 border-slate-800 focus:border-amber-400'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account with Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* SIGN IN FORM */
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold mb-1 opacity-80">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
                <input
                  type="email"
                  required
                  placeholder="manager@servicewebsites.co.za"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900'
                      : 'bg-slate-900 border-slate-800 focus:border-amber-400 text-white'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold opacity-80">Password *</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  className="text-[10px] text-amber-500 dark:text-amber-400 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-9 py-2 rounded-xl border text-xs font-medium outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900'
                      : 'bg-slate-900 border-slate-800 focus:border-amber-400 text-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password drop-down */}
            {showForgotPassword && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in">
                <p className="text-[11px] opacity-80">
                  Enter your email above and tap below to receive a password reset link:
                </p>
                {resetSent ? (
                  <p className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Reset email dispatched! Check your inbox.</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-800 text-slate-100 text-xs font-semibold hover:bg-slate-700 transition-colors"
                  >
                    Send Password Reset Link
                  </button>
                )}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In with Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo fast testing footer */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Quick Preview Access
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDemoSignIn('client')}
              className={`flex-1 py-1.5 px-2 rounded-xl border text-[11px] font-medium transition-colors ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              Demo Client
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('admin')}
              className={`flex-1 py-1.5 px-2 rounded-xl border text-[11px] font-medium transition-colors ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              Agency Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
