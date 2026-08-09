import React from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  Wallet,
  Wrench,
  Sparkles,
  MapPin,
  Calculator,
  Settings,
  Globe
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unpaidCount: number;
  openMaintenanceCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unpaidCount,
  openMaintenanceCount,
}) => {
  const menuItems = [
    {
      id: 'landing' as ActiveTab,
      label: 'Page Vitrine / Landing',
      icon: Globe,
      badge: { count: 'Public', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    },
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
    <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex-shrink-0">
      
      {/* Mobile Horizontal Navigation Bar */}
      <div className="lg:hidden flex overflow-x-auto p-2 space-x-1 border-b border-slate-800 no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Navigation Menu */}
      <div className="hidden lg:flex flex-col h-full p-4 justify-between">
        <nav className="space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Menu Principal
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? item.highlight
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
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
              </button>
            );
          })}
        </nav>

        {/* Footer Portfolio Mini Summary */}
        <div className="mt-8 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Statut du Serveur</span>
            <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>En Ligne</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">ImmoGestion v2.4 SaaS</p>
        </div>

      </div>

    </aside>
  );
};
