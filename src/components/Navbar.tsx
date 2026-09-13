import React, { useState } from 'react';
import {
  Menu,
  X,
  HardDrive,
  Mail,
  HeartHandshake,
  Droplets,
  BookOpen,
  Users,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { AuthState } from '../types';

interface NavbarProps {
  auth: AuthState;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenInbox: () => void;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  auth,
  activeSection,
  onNavigate,
  onOpenInbox,
  onLogin,
  onLogout,
  isLoggingIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'actions', label: 'Nos Actions' },
    { id: 'village', label: 'Le Village' },
    { id: 'soutenir', label: 'Nous Soutenir' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <button
            id="brand-logo-button"
            type="button"
            onClick={() => handleLinkClick('accueil')}
            className="flex items-center gap-3.5 text-left focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-800/15">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  ADMDO
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Médina Diakha Ouly
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Association pour le Développement Communautaire
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  type="button"
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50/90 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Quick Drive Inbox button */}
            <button
              id="nav-drive-inbox-button"
              type="button"
              onClick={onOpenInbox}
              className={`flex items-center gap-2 ml-2 px-3.5 py-2 text-sm font-medium rounded-xl transition-all border ${
                activeSection === 'inbox'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <span>Dossier Drive</span>
            </button>
          </div>

          {/* Google Connection & Contact CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {auth.isAuthenticated && auth.user ? (
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 pr-3 shadow-xs">
                {auth.user.photoURL ? (
                  <img
                    src={auth.user.photoURL}
                    alt={auth.user.displayName || 'Utilisateur'}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {(auth.user.displayName || auth.user.email || 'A')[0].toUpperCase()}
                  </div>
                )}
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-800 truncate max-w-[120px]">
                    {auth.user.displayName || 'Compte Google'}
                  </div>
                  <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Drive connecté
                  </div>
                </div>
                <button
                  id="nav-logout-button"
                  type="button"
                  onClick={onLogout}
                  title="Se déconnecter"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-google-login-button"
                type="button"
                onClick={onLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl border border-slate-300 shadow-xs transition-all disabled:opacity-50"
              >
                <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isLoggingIn ? 'Connexion...' : 'Connecter Drive'}</span>
              </button>
            )}

            <button
              id="nav-contact-cta-button"
              type="button"
              onClick={() => handleLinkClick('contact')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Écrire à l'ADMDO</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-menu-toggle-button"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-slate-200/80 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              id={`mobile-nav-${link.id}`}
              type="button"
              onClick={() => handleLinkClick(link.id)}
              className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeSection === link.id
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          <button
            id="mobile-nav-inbox"
            type="button"
            onClick={() => {
              onOpenInbox();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm font-medium text-slate-800 bg-slate-100/80 rounded-xl flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-700" />
              Boîte de réception Google Drive
            </span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!auth.isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  onLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2"
              >
                <HardDrive className="w-4 h-4 text-emerald-700" />
                Connecter Google Drive
              </button>
            )}

            <button
              type="button"
              onClick={() => handleLinkClick('contact')}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-emerald-700 rounded-xl flex items-center justify-center gap-2 shadow-xs"
            >
              <Mail className="w-4 h-4" />
              Envoyer un message à l'association
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
