import React from 'react';
import { Mail, HardDrive, LogOut, CheckCircle, ShieldCheck } from 'lucide-react';
import { AuthState } from '../types';

interface HeaderProps {
  auth: AuthState;
  activeTab: 'form' | 'inbox';
  onTabChange: (tab: 'form' | 'inbox') => void;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  auth,
  activeTab,
  onTabChange,
  onLogin,
  onLogout,
  isLoggingIn,
}) => {
  return (
    <header
      id="main-app-header"
      className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Association / App Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Formulaire de Contact
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Google Drive connecté
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                ADMDO — Association pour le développement de Médina Diakha Ouly
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              id="tab-new-message"
              type="button"
              onClick={() => onTabChange('form')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Nouveau message</span>
            </button>
            <button
              id="tab-drive-inbox"
              type="button"
              onClick={() => onTabChange('inbox')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all ${
                activeTab === 'inbox'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Dossier Drive</span>
            </button>
          </div>

          {/* User Auth status & Google Sign-In */}
          <div className="flex items-center gap-3">
            {auth.isAuthenticated && auth.user ? (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 pr-3 shadow-xs">
                {auth.user.photoURL ? (
                  <img
                    src={auth.user.photoURL}
                    alt={auth.user.displayName || 'Utilisateur'}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {(auth.user.displayName || auth.user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden md:block text-left text-xs">
                  <div className="font-semibold text-slate-800 truncate max-w-[130px]">
                    {auth.user.displayName || 'Utilisateur Google'}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[130px] flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                    Connecté
                  </div>
                </div>
                <button
                  id="header-logout-button"
                  type="button"
                  onClick={onLogout}
                  title="Se déconnecter de Google"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-google-signin-button"
                type="button"
                onClick={onLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium rounded-xl border border-slate-300 shadow-xs hover:shadow transition-all disabled:opacity-50"
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-4 h-4"
                  style={{ display: 'block' }}
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                <span>
                  {isLoggingIn ? 'Connexion en cours...' : 'Se connecter avec Google'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
