import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  Plus,
  Bell,
  Receipt,
  Globe,
  LogIn,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';
import { LandlordProfile, ActiveTab } from '../types';
import { User } from 'firebase/auth';

interface HeaderProps {
  profile: LandlordProfile;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddProperty: () => void;
  onOpenQuittanceModal: () => void;
  pendingAlertsCount: number;
  currentUser: User | null;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onBackToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  onOpenAddProperty,
  onOpenQuittanceModal,
  pendingAlertsCount,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onBackToLanding,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Section: Back Button + Brand Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Prominent Back Button (Bouton Retour) */}
          <button
            onClick={() => {
              if (onBackToLanding) {
                onBackToLanding();
              } else {
                setActiveTab('landing');
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs sm:text-sm border border-slate-700 transition-all hover:-translate-x-0.5 shadow-sm"
            title="Retourner à la page d'accueil public"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Retour Site</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          {/* Logo and Brand */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">ImmoGestion</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 hidden sm:inline">
                  SaaS
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden md:block">Gestion Immobilière & Rentabilité IA</p>
            </div>
          </div>

        </div>

        {/* Quick Action Header Buttons (Desktop & Tablet) */}
        <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick AI Assistant Trigger */}
          <button
            onClick={() => setActiveTab('ai_assistant')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow-purple-500/25"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Assistant IA Gemini</span>
          </button>

          {/* Quick Rent Receipt Trigger */}
          <button
            onClick={onOpenQuittanceModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-colors"
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Quittance</span>
          </button>

          {/* Add Property Button */}
          <button
            onClick={onOpenAddProperty}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Bien</span>
          </button>

          {/* Notification Alert Bell */}
          <button
            onClick={() => setActiveTab('finances')}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Alertes de loyers et maintenance"
          >
            <Bell className="w-5 h-5" />
            {pendingAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900 animate-ping" />
            )}
            {pendingAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
            )}
          </button>

          {/* Firebase Auth Sign-in / Register / User Badge */}
          {currentUser ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div
                onClick={() => setActiveTab('settings')}
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Avatar'}
                    className="w-8 h-8 rounded-full border border-emerald-500/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    {(currentUser.displayName || profile.name).charAt(0)}
                  </div>
                )}
                <div className="text-left text-xs hidden lg:block">
                  <p className="font-semibold text-slate-200 leading-none truncate max-w-[110px]">
                    {currentUser.displayName || profile.name}
                  </p>
                  <p className="text-emerald-400 text-[10px]">Connecté</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Connexion</span>
              </button>
              <button
                onClick={() => onOpenAuthModal('register')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-sm"
              >
                Inscription
              </button>
            </div>
          )}

        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          {!currentUser && (
            <button
              onClick={() => onOpenAuthModal('login')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Connexion
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAddProperty();
              }}
              className="p-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Bien</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuittanceModal();
              }}
              className="p-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center space-x-2"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Quittance</span>
            </button>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveTab('ai_assistant');
            }}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Assistant IA Gemini</span>
          </button>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onBackToLanding) onBackToLanding();
                else setActiveTab('landing');
              }}
              className="flex items-center space-x-2 text-emerald-400 font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retourner sur la Landing Page</span>
            </button>

            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-rose-400 font-bold flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('login');
                }}
                className="text-emerald-400 font-bold"
              >
                Connexion / Inscription
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
