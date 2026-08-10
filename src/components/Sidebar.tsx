import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Building,
  Building2,
  Users,
  Wallet,
  Wrench,
  Sparkles,
  MapPin,
  Calculator,
  Settings,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unpaidCount: number;
  openMaintenanceCount: number;
  onBackToLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unpaidCount,
  openMaintenanceCount,
  onBackToLanding,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'properties' as ActiveTab,
      label: 'Parc Immobilier',
      icon: Building,
      badge: null,
    },
    {
      id: 'tenants' as ActiveTab,
      label: 'Locataires & Baux',
      icon: Users,
      badge: null,
    },
    {
      id: 'finances' as ActiveTab,
      label: 'Finances & Quittances',
      icon: Wallet,
      badge: unpaidCount > 0 ? { count: unpaidCount, color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' } : null,
    },
    {
      id: 'maintenance' as ActiveTab,
      label: 'Maintenance & Travaux',
      icon: Wrench,
      badge: openMaintenanceCount > 0 ? { count: openMaintenanceCount, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' } : null,
    },
    {
      id: 'ai_assistant' as ActiveTab,
      label: 'Assistant IA Gemini',
      icon: Sparkles,
      highlight: true,
      badge: { count: 'IA', color: 'bg-purple-500/30 text-purple-300 border-purple-500/40' },
    },
    {
      id: 'map' as ActiveTab,
      label: 'Carte des Biens',
      icon: MapPin,
      badge: null,
    },
    {
      id: 'taxes' as ActiveTab,
      label: 'Fiscalité & Rendement',
      icon: Calculator,
      badge: null,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Paramètres SCI',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 flex-shrink-0 overflow-hidden shadow-lg">
      
      {/* Mobile Horizontal Scrollable Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto p-2.5 space-x-1.5 border-b border-slate-800 no-scrollbar">
        <motion.button
          whileHover={{ scale: 1.03, opacity: 0.9 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (onBackToLanding) onBackToLanding();
            else setActiveTab('landing');
          }}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700 whitespace-nowrap flex-shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour Site</span>
        </motion.button>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.03, opacity: 0.95 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Desktop Vertical Navigation Menu */}
      <div className="hidden lg:flex flex-col h-full p-4 justify-between space-y-6">
        <nav className="space-y-1.5">
          
          {/* Top Sidebar Brand Logo & Typography (ImmoGestion by Blink Services) */}
          <div className="px-2 py-3 mb-2 border-b border-slate-800/80 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white leading-tight">
                Immo<span className="text-emerald-400 font-extrabold">Gestion</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                by Blink Services
              </span>
            </div>
          </div>

          {/* Back to Public Landing Link */}
          <motion.button
            whileHover={{ scale: 1.02, x: 2, opacity: 0.95 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (onBackToLanding) onBackToLanding();
              else setActiveTab('landing');
            }}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors mb-3 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>← Page d'Accueil Public</span>
          </motion.button>

          <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Menu Navigation
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02, x: 3, opacity: 0.95 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors group cursor-pointer ${
                  isActive
                    ? item.highlight
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shadow-sm'
                    : item.highlight
                    ? 'hover:bg-purple-950/40 text-purple-300/80 hover:text-purple-200 border border-purple-900/30'
                    : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive
                        ? item.highlight
                          ? 'text-purple-400'
                          : 'text-emerald-400'
                        : item.highlight
                        ? 'text-purple-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold border ${item.badge.color}`}
                  >
                    {item.badge.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer Portfolio Mini Summary */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Abonnement SaaS</span>
            <span className="flex items-center space-x-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Pro SCI</span>
            </span>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="w-full text-left text-[11px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-between group"
          >
            <span>Gérer mon paiement</span>
            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </button>
        </div>

      </div>

    </aside>
  );
};
