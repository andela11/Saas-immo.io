import React from 'react';
import { Building2, Sparkles, Plus, Bell, Receipt, Globe, LogIn, LogOut, User as UserIcon } from 'lucide-react';
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
  onSignInGoogle: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  onOpenAddProperty,
  onOpenQuittanceModal,
  pendingAlertsCount,
  currentUser,
  onSignInGoogle,
  onLogout,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Building2 className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white">ImmoGestion</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                SaaS
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Gestion Immobilière & Rentabilité IA</p>
          </div>
        </div>

        {/* Quick Action Header Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Landing Page Button */}
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all border ${
              activeTab === 'landing'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Landing Page</span>
          </button>
          
          {/* Quick AI Assistant Trigger */}
          <button
            onClick={() => setActiveTab('ai_assistant')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow-purple-500/25"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="hidden md:inline">Assistant IA Gemini</span>
            <span className="md:hidden">IA</span>
          </button>

          {/* Quick Rent Receipt Trigger */}
          <button
            onClick={onOpenQuittanceModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-colors"
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Quittance de Loyer</span>
          </button>

          {/* Add Property Button */}
          <button
            onClick={onOpenAddProperty}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau Bien</span>
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

          {/* Firebase Auth Google Sign-in / User Badge */}
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
                  <p className="text-emerald-400 text-[10px]">Cloud Synced</p>
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
            <button
              onClick={onSignInGoogle}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all border border-slate-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Connexion Google</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
