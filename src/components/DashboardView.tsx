import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Building2,
  Users,
  AlertCircle,
  Wrench,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Receipt,
  FileText,
  Calendar as CalendarIcon,
  LayoutGrid,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Property, Tenant, PaymentRecord, MaintenanceTicket, ActiveTab } from '../types';
import { RentCalendar } from './RentCalendar';

interface DashboardViewProps {
  properties: Property[];
  tenants: Tenant[];
  payments: PaymentRecord[];
  maintenanceTickets: MaintenanceTicket[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuittanceModal: () => void;
  onSelectProperty: (property: Property) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  properties,
  tenants,
  payments,
  maintenanceTickets,
  setActiveTab,
  onOpenQuittanceModal,
  onSelectProperty,
}) => {
  const [activeDashboardMode, setActiveDashboardMode] = useState<'both' | 'overview' | 'calendar'>('both');

  // Financial Calculations
  const occupiedProperties = properties.filter((p) => p.status === 'Occupied');
  const vacantProperties = properties.filter((p) => p.status === 'Vacant');
  const renovationProperties = properties.filter((p) => p.status === 'Renovation');

  const totalMonthlyIncome = properties.reduce((acc, p) => acc + (p.status === 'Occupied' ? p.monthlyRent + p.monthlyCharges : 0), 0);
  const totalPropertyValuation = properties.reduce((acc, p) => acc + p.purchasePrice, 0);
  
  const averageGrossYield = totalPropertyValuation > 0
    ? (properties.reduce((acc, p) => acc + (p.monthlyRent * 12), 0) / totalPropertyValuation) * 100
    : 0;

  const occupancyRate = properties.length > 0
    ? (occupiedProperties.length / properties.length) * 100
    : 0;

  const augustPayments = payments.filter((p) => p.month.includes('Août'));
  const paidPayments = augustPayments.filter((p) => p.status === 'Paid');
  const latePayments = augustPayments.filter((p) => p.status === 'Late' || p.status === 'Pending');
  const totalLateAmount = latePayments.reduce((acc, p) => acc + p.totalAmount, 0);

  const openTickets = maintenanceTickets.filter((t) => t.status !== 'Resolved');

  // 12-Month Performance Trend Data for Recharts
  const monthlyTrendData = useMemo(() => {
    const months = [
      { label: 'Sept 25', incMult: 0.88, occMult: 0.86 },
      { label: 'Oct 25', incMult: 0.89, occMult: 0.88 },
      { label: 'Nov 25', incMult: 0.90, occMult: 0.88 },
      { label: 'Déc 25', incMult: 0.92, occMult: 0.90 },
      { label: 'Janv 26', incMult: 0.93, occMult: 0.92 },
      { label: 'Fév 26', incMult: 0.94, occMult: 0.92 },
      { label: 'Mars 26', incMult: 0.95, occMult: 0.94 },
      { label: 'Avr 26', incMult: 0.96, occMult: 0.94 },
      { label: 'Mai 26', incMult: 0.97, occMult: 0.96 },
      { label: 'Juin 26', incMult: 0.98, occMult: 0.97 },
      { label: 'Juil 26', incMult: 0.99, occMult: 0.98 },
      { label: 'Août 26', incMult: 1.00, occMult: 1.00 },
    ];

    const baseIncome = totalMonthlyIncome > 0 ? totalMonthlyIncome : 14200;
    const currentOcc = occupancyRate > 0 ? occupancyRate : 92;

    return months.map((m) => {
      const revenus = Math.round(baseIncome * m.incMult);
      const objectif = Math.round(baseIncome * 1.04);
      const tauxOcc = Math.min(100, Math.round(currentOcc * m.occMult * 10) / 10);
      return {
        month: m.label,
        Revenus: revenus,
        Objectif: objectif,
        TauxOccupation: tauxOcc,
      };
    });
  }, [totalMonthlyIncome, occupancyRate]);

  return (
    <div className="space-[#1e293b] space-y-6">
      
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gestion de Portefeuille SCI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Tableau de Bord Immobilier</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {properties.length} biens sous gestion • {occupiedProperties.length} locataires sous bail • {totalMonthlyIncome.toLocaleString('fr-FR')} € / mois encaissés
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('ai_assistant')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/70 text-purple-300 border border-purple-700/50 text-xs sm:text-sm font-semibold transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Analyse & Annonces IA</span>
          </button>
          
          <button
            onClick={onOpenQuittanceModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            <Receipt className="w-4 h-4" />
            <span>Émettre Quittance</span>
          </button>
        </div>
      </div>

      {/* View Mode Selector Tabs */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
        <div className="flex items-center space-x-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveDashboardMode('both')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeDashboardMode === 'both'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Vue Complète</span>
          </button>

          <button
            onClick={() => setActiveDashboardMode('calendar')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeDashboardMode === 'calendar'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendrier des Échéances</span>
          </button>

          <button
            onClick={() => setActiveDashboardMode('overview')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeDashboardMode === 'overview'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Synthèse Chiffrée</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden lg:inline px-3">
          Mois en cours : <strong className="text-emerald-400">Août 2026</strong>
        </span>
      </div>

      {/* Interactive Rent Calendar View (When Mode is 'calendar' or 'both') */}
      {(activeDashboardMode === 'calendar' || activeDashboardMode === 'both') && (
        <RentCalendar
          properties={properties}
          tenants={tenants}
          payments={payments}
          onOpenQuittanceModal={onOpenQuittanceModal}
          setActiveTab={setActiveTab}
        />
      )}

      {/* KPI Cards Grid (When Mode is 'overview' or 'both') */}
      {(activeDashboardMode === 'overview' || activeDashboardMode === 'both') && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Monthly Income */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Revenu Mensuel Brut</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {totalMonthlyIncome.toLocaleString('fr-FR')} € <span className="text-xs font-normal text-slate-400">/ mois</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4.2% vs trimestre dernier</span>
          </div>
        </div>

        {/* KPI 2: Occupancy Rate */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Taux d'Occupation</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {occupancyRate.toFixed(1)} %
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {occupiedProperties.length} occupés • {vacantProperties.length} vacant(s)
          </div>
        </div>

        {/* KPI 3: Rent Collection Status */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Encaissement Août</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${latePayments.length > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {paidPayments.length} / {augustPayments.length} <span className="text-xs font-normal text-slate-400">payés</span>
          </div>
          {totalLateAmount > 0 ? (
            <div className="flex items-center space-x-1 text-xs text-rose-400 font-semibold mt-2">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>{totalLateAmount.toLocaleString('fr-FR')} € en retard</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-xs text-emerald-400 font-medium mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tous loyers perçus</span>
            </div>
          )}
        </div>

        {/* KPI 4: Portfolio Yield */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Rendement Brut Moyen</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {averageGrossYield.toFixed(2)} %
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Valeur du parc : {(totalPropertyValuation / 1000).toFixed(0)} k€
          </div>
        </div>

      </div>

      {/* Recharts Analytics Charts: 12-Month Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenus Locatifs (12 derniers mois) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Évolution des Revenus Locatifs</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Historique et potentiel sur 12 mois (€)</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              +13.6% en 1 an
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k€`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any, name: any) => [`${Number(value || 0).toLocaleString('fr-FR')} €`, name || 'Montant']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="Revenus" name="Revenus Encaissés (€)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#incomeGradient)" />
                <Area type="monotone" dataKey="Objectif" name="Potentiel Théorique (€)" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#targetGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Taux d'Occupation (12 derniers mois) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">Taux d'Occupation du Parc</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Évolution du remplissage sur 12 mois (%)</p>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
              Actuel : {occupancyRate.toFixed(1)}%
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="occGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any, name: any) => [`${value} %`, name || 'Taux d\'occupation']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="TauxOccupation" name="Taux d'Occupation (%)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#occGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Main Grid: Pending Alerts & Property Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Action Required & Alerts */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Late Payments Alert Block */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-white text-base">Alertes Loyers</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
                {latePayments.length}
              </span>
            </div>

            {latePayments.length > 0 ? (
              <div className="space-y-3">
                {latePayments.map((pay) => {
                  const tenant = tenants.find((t) => t.id === pay.tenantId);
                  const property = properties.find((p) => p.id === pay.propertyId);
                  return (
                    <div
                      key={pay.id}
                      className="bg-slate-800/60 border border-rose-500/30 rounded-xl p-3.5 space-y-2 hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-100 text-sm">{tenant?.firstName} {tenant?.lastName}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[180px]">{property?.title}</p>
                        </div>
                        <span className="text-sm font-extrabold text-rose-400">
                          {pay.totalAmount} €
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700/50">
                        <span className="text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Échéance {pay.dueDate}</span>
                        </span>
                        <button
                          onClick={() => setActiveTab('ai_assistant')}
                          className="text-purple-400 hover:text-purple-300 font-semibold flex items-center space-x-1 text-xs"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Relancer par IA</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <span>Aucun retard de loyer ce mois-ci.</span>
              </div>
            )}
          </div>

          {/* Active Maintenance Tickets */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Demandes Maintenance</h3>
              </div>
              <button
                onClick={() => setActiveTab('maintenance')}
                className="text-xs text-emerald-400 hover:underline flex items-center space-x-0.5"
              >
                <span>Voir tout</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {openTickets.length > 0 ? (
              <div className="space-y-3">
                {openTickets.slice(0, 3).map((ticket) => {
                  const property = properties.find((p) => p.id === ticket.propertyId);
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setActiveTab('maintenance')}
                      className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 cursor-pointer hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ticket.priority === 'Emergency' ? 'bg-rose-500/20 text-rose-400' :
                          ticket.priority === 'High' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {ticket.priority === 'Emergency' ? 'URGENT' : ticket.priority}
                        </span>
                        <span className="text-[11px] text-slate-400">{ticket.createdAt}</span>
                      </div>
                      <p className="font-semibold text-slate-200 text-xs line-clamp-1">{ticket.title}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{property?.title}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-4 text-slate-500 text-xs">Aucune intervention en cours.</p>
            )}
          </div>

        </div>

        {/* Right Column: Properties Quick Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-lg">Parc Immobilier Récent</h3>
                <p className="text-xs text-slate-400">Accès rapide aux fiches de vos biens</p>
              </div>
              <button
                onClick={() => setActiveTab('properties')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1"
              >
                <span>Gérer les Biens</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {properties.slice(0, 4).map((prop) => {
                const tenant = tenants.find((t) => t.id === prop.tenantId);
                const grossYield = ((prop.monthlyRent * 12) / prop.purchasePrice) * 100;

                return (
                  <div
                    key={prop.id}
                    onClick={() => onSelectProperty(prop)}
                    className="bg-slate-800/50 border border-slate-700/60 rounded-xl overflow-hidden hover:border-emerald-500/50 hover:bg-slate-800 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={prop.imageUrl}
                        alt={prop.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center space-x-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm ${
                          prop.status === 'Occupied' ? 'bg-emerald-600' :
                          prop.status === 'Vacant' ? 'bg-rose-600' : 'bg-amber-600'
                        }`}>
                          {prop.status === 'Occupied' ? 'Occupé' : prop.status === 'Vacant' ? 'Vacant' : 'Rénovation'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900/80 text-emerald-400 border border-emerald-500/30">
                          DPE {prop.dpe}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-black text-white border border-slate-700">
                        {prop.monthlyRent} € / mo
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2">
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {prop.title}
                      </h4>
                      <p className="text-xs text-slate-400">{prop.surface} m² • {prop.rooms} pièce(s) • {prop.city}</p>
                      
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/50">
                        <span className="text-slate-400">
                          Locataire : <span className="font-medium text-slate-200">{tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Aucun'}</span>
                        </span>
                        <span className="font-bold text-emerald-400">
                          {grossYield.toFixed(1)}% brut
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Quick SaaS Feature Navigation Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div 
              onClick={() => setActiveTab('ai_assistant')}
              className="bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-800/40 p-4 rounded-xl cursor-pointer hover:border-purple-500 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Générateur d'Annonces</h4>
              <p className="text-xs text-purple-300/70 mt-1">Créez des annonces captivantes pour LeBonCoin/SeLoger en 1 clic.</p>
            </div>

            <div 
              onClick={() => setActiveTab('taxes')}
              className="bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-emerald-500 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Simulateur Fiscal LMNP</h4>
              <p className="text-xs text-slate-400 mt-1">Comparez Micro-BIC, Réel foncier et optimisez l'amortissement.</p>
            </div>

            <div 
              onClick={() => setActiveTab('map')}
              className="bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-blue-500 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Carte Interactive</h4>
              <p className="text-xs text-slate-400 mt-1">Visualisez la géolocalisation et l'occupation de vos biens.</p>
            </div>

          </div>

        </div>

      </div>
        </>
      )}

    </div>
  );
};
