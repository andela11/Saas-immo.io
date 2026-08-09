import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  User as UserIcon,
  Receipt,
  Filter,
  DollarSign,
  Sparkles,
  ArrowUpRight,
  X,
  Info
} from 'lucide-react';
import { Property, Tenant, PaymentRecord, ActiveTab } from '../types';

interface RentCalendarProps {
  properties: Property[];
  tenants: Tenant[];
  payments: PaymentRecord[];
  onOpenQuittanceModal?: () => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const RentCalendar: React.FC<RentCalendarProps> = ({
  properties,
  tenants,
  payments,
  onOpenQuittanceModal,
  setActiveTab,
}) => {
  // Default to August 2026 based on mock data, or current date if outside
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 7, 1));
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Paid' | 'Late' | 'Pending'>('ALL');
  const [selectedDayEvents, setSelectedDayEvents] = useState<{
    dateStr: string;
    formattedDate: string;
    duePayments: Array<{ pay: PaymentRecord; tenant?: Tenant; property?: Property }>;
    paidPayments: Array<{ pay: PaymentRecord; tenant?: Tenant; property?: Property }>;
    leases: Array<{ tenant: Tenant; property?: Property; type: 'start' | 'end' }>;
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 - 11

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 7, 1));
  };

  // Calendar Grid Calculations
  // Monday is index 0 in French standard
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Helper to format date YYYY-MM-DD
  const formatDateString = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Filter payments for this selected month & property
  const currentMonthStr = `${MONTH_NAMES[month]} ${year}`;

  const filteredPayments = payments.filter((pay) => {
    if (selectedPropertyId !== 'ALL' && pay.propertyId !== selectedPropertyId) return false;
    if (statusFilter !== 'ALL' && pay.status !== statusFilter) return false;
    return true;
  });

  // Calculate Month Stats
  const monthPayments = filteredPayments.filter((p) => p.month.toLowerCase().includes(MONTH_NAMES[month].toLowerCase()) || (p.dueDate && p.dueDate.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)));
  const totalExpected = monthPayments.reduce((acc, p) => acc + p.totalAmount, 0);
  const totalCollected = monthPayments.filter((p) => p.status === 'Paid').reduce((acc, p) => acc + p.totalAmount, 0);
  const totalLate = monthPayments.filter((p) => p.status === 'Late' || p.status === 'Pending').reduce((acc, p) => acc + p.totalAmount, 0);
  const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

  // Build grid items
  const calendarCells = [];

  // Previous Month Padding
  for (let i = startingDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dateStr = formatDateString(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, dayNum);
    calendarCells.push({ dayNum, isCurrentMonth: false, dateStr });
  }

  // Current Month Days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateString(year, month, d);
    calendarCells.push({ dayNum: d, isCurrentMonth: true, dateStr });
  }

  // Next Month Padding to make total 35 or 42
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const dateStr = formatDateString(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, d);
    calendarCells.push({ dayNum: d, isCurrentMonth: false, dateStr });
  }

  // Helper to fetch day events
  const getEventsForDate = (dateStr: string) => {
    const duePayments = filteredPayments
      .filter((p) => p.dueDate === dateStr)
      .map((pay) => ({
        pay,
        tenant: tenants.find((t) => t.id === pay.tenantId),
        property: properties.find((pr) => pr.id === pay.propertyId)
      }));

    const paidPayments = filteredPayments
      .filter((p) => p.paidDate === dateStr && p.status === 'Paid')
      .map((pay) => ({
        pay,
        tenant: tenants.find((t) => t.id === pay.tenantId),
        property: properties.find((pr) => pr.id === pay.propertyId)
      }));

    const leases: Array<{ tenant: Tenant; property?: Property; type: 'start' | 'end' }> = [];
    tenants.forEach((t) => {
      if (selectedPropertyId !== 'ALL' && t.propertyId !== selectedPropertyId) return;
      if (t.leaseStart === dateStr) {
        leases.push({ tenant: t, property: properties.find((p) => p.id === t.propertyId), type: 'start' });
      }
      if (t.leaseEnd === dateStr) {
        leases.push({ tenant: t, property: properties.find((p) => p.id === t.propertyId), type: 'end' });
      }
    });

    return { duePayments, paidPayments, leases };
  };

  const handleCellClick = (dateStr: string, dayNum: number, isCurrentMonth: boolean) => {
    const events = getEventsForDate(dateStr);
    const dateObj = new Date(dateStr);
    const formattedDate = `${dayNum} ${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    setSelectedDayEvents({
      dateStr,
      formattedDate,
      ...events
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-inner">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Échéancier & Suivi des Loyers</span>
            </h2>
            <p className="text-xs text-slate-400">
              Visualisez les dates d'échéances et d'encaissements réels sur le mois
            </p>
          </div>
        </div>

        {/* Filters & Month Navigation */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Property Filter Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">Tous les Biens</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.title} ({p.city})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-800/80 border border-slate-700/80 rounded-xl p-1 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'ALL' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStatusFilter('Paid')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Payés
            </button>
            <button
              onClick={() => setStatusFilter('Late')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'Late' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Retards
            </button>
          </div>

          {/* Month Navigator */}
          <div className="flex items-center bg-slate-800 border border-slate-700/80 rounded-xl p-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
              title="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 font-extrabold text-sm text-white min-w-[130px] text-center">
              {MONTH_NAMES[month]} {year}
            </span>

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
              title="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Aujourd'hui
          </button>

        </div>
      </div>

      {/* Monthly Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
        <div>
          <span className="text-[11px] font-semibold text-slate-400">Total Attendu ({MONTH_NAMES[month]})</span>
          <p className="text-lg font-black text-white">{totalExpected.toLocaleString('fr-FR')} €</p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Perçu à ce jour</span>
          </span>
          <p className="text-lg font-black text-emerald-400">{totalCollected.toLocaleString('fr-FR')} €</p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-rose-400 flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>Reste à percevoir / Retards</span>
          </span>
          <p className="text-lg font-black text-rose-400">{totalLate.toLocaleString('fr-FR')} €</p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-400">Taux de Recouvrement</span>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(collectionRate, 100)}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-slate-200">{collectionRate.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Échéance en retard</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Paiement reçu</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Échéance à venir / En attente</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span>Début / Fin de bail</span>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">Cliquez sur un jour pour voir le détail complet</span>
      </div>

      {/* Calendar Grid Container */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-slate-800/80 border-b border-slate-800 text-center py-2.5 font-bold text-xs text-slate-300">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-px bg-slate-800/50">
          {calendarCells.map(({ dayNum, isCurrentMonth, dateStr }, index) => {
            const events = getEventsForDate(dateStr);
            const hasDue = events.duePayments.length > 0;
            const hasPaid = events.paidPayments.length > 0;
            const hasLease = events.leases.length > 0;

            const isToday = dateStr === '2026-08-05'; // Reference current simulation date

            return (
              <div
                key={`${dateStr}-${index}`}
                onClick={() => handleCellClick(dateStr, dayNum, isCurrentMonth)}
                className={`min-h-[95px] sm:min-h-[110px] p-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrentMonth ? 'bg-slate-900/90 hover:bg-slate-800/90 text-slate-200' : 'bg-slate-950/50 text-slate-600 hover:bg-slate-900/50'
                } ${isToday ? 'ring-2 ring-emerald-500/80 ring-inset bg-emerald-950/20' : ''}`}
              >
                {/* Cell Day Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                    isToday ? 'bg-emerald-500 text-slate-950 font-black' : isCurrentMonth ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {dayNum}
                  </span>
                  
                  {isToday && (
                    <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      Aujourd'hui
                    </span>
                  )}
                </div>

                {/* Event Pills Container */}
                <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                  
                  {/* Due Payments Events */}
                  {events.duePayments.map(({ pay, tenant }) => (
                    <div
                      key={`due-${pay.id}`}
                      className={`px-1.5 py-1 rounded text-[10px] font-bold truncate flex items-center justify-between border ${
                        pay.status === 'Paid'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                          : pay.status === 'Late'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                      }`}
                      title={`Échéance ${tenant ? `${tenant.firstName} ${tenant.lastName}` : ''} - ${pay.totalAmount} € (${pay.status})`}
                    >
                      <span className="truncate">
                        Échéance: {tenant ? tenant.lastName : 'Locataire'}
                      </span>
                      <span className="ml-1 font-extrabold">{pay.totalAmount}€</span>
                    </div>
                  ))}

                  {/* Paid Date Receipts */}
                  {events.paidPayments.map(({ pay, tenant }) => (
                    <div
                      key={`paid-${pay.id}`}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold truncate bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1"
                      title={`Reçu le ${dateStr} - ${pay.totalAmount} €`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">Reçu: {pay.totalAmount} €</span>
                    </div>
                  ))}

                  {/* Lease events */}
                  {events.leases.map(({ tenant, type }) => (
                    <div
                      key={`lease-${tenant.id}-${type}`}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold truncate bg-blue-950/70 text-blue-300 border border-blue-500/30"
                    >
                      {type === 'start' ? '🔑 Début bail' : '🏁 Fin bail'} : {tenant.lastName}
                    </div>
                  ))}

                </div>

                {/* Day Summary Dot indicators on small screens */}
                <div className="flex items-center space-x-1 mt-1 pt-1 border-t border-slate-800/50">
                  {hasDue && <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>}
                  {hasPaid && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                  {hasLease && <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Selected Day Events Drawer / Modal */}
      {selectedDayEvents && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => setSelectedDayEvents(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Événements du {selectedDayEvents.formattedDate}
                </h3>
                <p className="text-xs text-slate-400">Détail des échéances, paiements et baux</p>
              </div>
            </div>

            {selectedDayEvents.duePayments.length === 0 &&
             selectedDayEvents.paidPayments.length === 0 &&
             selectedDayEvents.leases.length === 0 ? (
              <div className="text-center py-8 space-y-2 text-slate-500">
                <Info className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm">Aucun événement enregistré à cette date.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                
                {/* Due Payments List */}
                {selectedDayEvents.duePayments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Échéances de Loyers</h4>
                    {selectedDayEvents.duePayments.map(({ pay, tenant, property }) => (
                      <div
                        key={pay.id}
                        className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-white text-sm">
                              {tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Locataire'}
                            </p>
                            <p className="text-xs text-slate-400">{property?.title}</p>
                          </div>
                          <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                            pay.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            pay.status === 'Late' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}>
                            {pay.status === 'Paid' ? 'Loyer Payé' : pay.status === 'Late' ? 'En Retard' : 'En Attente'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/60 text-slate-300">
                          <span>Montant Total : <strong className="text-white font-extrabold">{pay.totalAmount} €</strong></span>
                          <span>(Loyer {pay.rentAmount}€ + Charges {pay.chargesAmount}€)</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end space-x-2 pt-2">
                          {pay.status === 'Paid' && onOpenQuittanceModal && (
                            <button
                              onClick={() => {
                                setSelectedDayEvents(null);
                                onOpenQuittanceModal();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1 shadow-sm transition-all"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>Émettre Quittance</span>
                            </button>
                          )}

                          {pay.status === 'Late' && setActiveTab && (
                            <button
                              onClick={() => {
                                setSelectedDayEvents(null);
                                setActiveTab('ai_assistant');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1 shadow-sm transition-all"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Relancer par IA</span>
                            </button>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* Paid Date Events */}
                {selectedDayEvents.paidPayments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Encaissements Effectués</h4>
                    {selectedDayEvents.paidPayments.map(({ pay, tenant, property }) => (
                      <div
                        key={`pdate-${pay.id}`}
                        className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <div>
                            <p className="text-xs font-bold text-white">{tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Locataire'}</p>
                            <p className="text-[11px] text-slate-400">{property?.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-emerald-400 text-sm">+{pay.totalAmount} €</p>
                          <p className="text-[10px] text-slate-400">Paiement reçu</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lease events */}
                {selectedDayEvents.leases.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Événements de Baux</h4>
                    {selectedDayEvents.leases.map(({ tenant, property, type }) => (
                      <div
                        key={`lease-m-${tenant.id}`}
                        className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-200"
                      >
                        <div>
                          <p className="font-bold text-white">{tenant.firstName} {tenant.lastName}</p>
                          <p className="text-slate-400 text-[11px]">{property?.title}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                          {type === 'start' ? 'Début de bail' : 'Fin de bail'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedDayEvents(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
