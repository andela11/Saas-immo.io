import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Receipt,
  Download,
  Filter,
  Search,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';
import { PaymentRecord, FinancialTransaction, Property, Tenant } from '../types';

interface FinancesViewProps {
  payments: PaymentRecord[];
  transactions: FinancialTransaction[];
  properties: Property[];
  tenants: Tenant[];
  onUpdatePaymentStatus: (paymentId: string, status: 'Paid' | 'Late' | 'Pending') => void;
  onAddTransaction: (transaction: FinancialTransaction) => void;
  onOpenQuittanceModal: (payment?: PaymentRecord) => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  payments,
  transactions,
  properties,
  tenants,
  onUpdatePaymentStatus,
  onAddTransaction,
  onOpenQuittanceModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'payments' | 'transactions'>('payments');
  const [monthFilter, setMonthFilter] = useState('Août 2026');
  
  // Transaction Form state
  const [showTxModal, setShowTxModal] = useState(false);
  const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [txPropertyId, setTxPropertyId] = useState(properties[0]?.id || '');
  const [txAmount, setTxAmount] = useState(250);
  const [txCategory, setTxCategory] = useState<any>('RENOVATION');
  const [txDescription, setTxDescription] = useState('');

  const filteredPayments = payments.filter((p) => p.month === monthFilter);

  const totalIncomes = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const netCashflow = totalIncomes - totalExpenses;

  const handleAddTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      type: txType,
      propertyId: txPropertyId,
      amount: Number(txAmount),
      category: txCategory,
      date: new Date().toISOString().split('T')[0],
      description: txDescription || (txType === 'INCOME' ? 'Recette locative' : 'Dépense de gestion'),
    };
    onAddTransaction(newTx);
    setShowTxModal(false);
    setTxDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <span>Finances & Quittances de Loyer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Suivi des encaissements mensuels, quittances officielles et livre de caisse.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTxModal(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Saisir une Dépense/Recette</span>
          </button>

          <button
            onClick={() => onOpenQuittanceModal()}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Receipt className="w-4 h-4" />
            <span>Émettre une Quittance</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Recettes Totales Imputées</span>
          <div className="text-2xl font-black text-emerald-400 flex items-center space-x-1">
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            <span>{totalIncomes.toLocaleString('fr-FR')} €</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Dépenses & Charges Imputées</span>
          <div className="text-2xl font-black text-rose-400 flex items-center space-x-1">
            <ArrowDownRight className="w-5 h-5 text-rose-400" />
            <span>{totalExpenses.toLocaleString('fr-FR')} €</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Cashflow Net Net</span>
          <div className="text-2xl font-black text-white flex items-center space-x-1">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>{netCashflow.toLocaleString('fr-FR')} €</span>
          </div>
        </div>

      </div>

      {/* Sub Tabs Toggle */}
      <div className="flex border-b border-slate-800 space-x-4">
        <button
          onClick={() => setActiveSubTab('payments')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeSubTab === 'payments'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Registre des Loyers ({monthFilter})
        </button>

        <button
          onClick={() => setActiveSubTab('transactions')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeSubTab === 'transactions'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Livre de Caisse ({transactions.length} écritures)
        </button>
      </div>

      {/* Sub Tab 1: Payments Ledger */}
      {activeSubTab === 'payments' && (
        <div className="space-y-4">
          
          {/* Month Selector */}
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-3 rounded-xl w-fit">
            <span className="text-xs font-semibold text-slate-400">Période :</span>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-slate-800 text-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700"
            >
              <option value="Août 2026">Août 2026</option>
              <option value="Juillet 2026">Juillet 2026</option>
              <option value="Juin 2026">Juin 2026</option>
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Locataire & Bien</th>
                    <th className="py-3.5 px-4">Échéance</th>
                    <th className="py-3.5 px-4">Loyer HC</th>
                    <th className="py-3.5 px-4">Charges</th>
                    <th className="py-3.5 px-4">Total Dû</th>
                    <th className="py-3.5 px-4">Statut</th>
                    <th className="py-3.5 px-4 text-right">Quittance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPayments.map((pay) => {
                    const tenant = tenants.find((t) => t.id === pay.tenantId);
                    const property = properties.find((p) => p.id === pay.propertyId);

                    return (
                      <tr key={pay.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-white">{tenant?.firstName} {tenant?.lastName}</p>
                          <p className="text-[11px] text-slate-400">{property?.title}</p>
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          {pay.dueDate}
                          {pay.paidDate && (
                            <span className="block text-[10px] text-emerald-400">Payé le {pay.paidDate}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-200 font-semibold">{pay.rentAmount} €</td>
                        <td className="py-3.5 px-4 text-slate-400">{pay.chargesAmount} €</td>
                        <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">{pay.totalAmount} €</td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <select
                              value={pay.status}
                              onChange={(e) => onUpdatePaymentStatus(pay.id, e.target.value as any)}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                                pay.status === 'Paid'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              <option value="Paid">Payé</option>
                              <option value="Late">En Retard</option>
                              <option value="Pending">En Attente</option>
                            </select>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onOpenQuittanceModal(pay)}
                            className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors"
                          >
                            Générer Quittance
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Sub Tab 2: Cashflow Transactions */}
      {activeSubTab === 'transactions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Bien Concerné</th>
                  <th className="py-3.5 px-4 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map((tx) => {
                  const property = properties.find((p) => p.id === tx.propertyId);

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400">{tx.date}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {tx.type === 'INCOME' ? 'RECETTE' : 'DÉPENSE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">{tx.category}</td>
                      <td className="py-3.5 px-4 text-slate-300">{tx.description}</td>
                      <td className="py-3.5 px-4 text-slate-400">{property?.title || 'SCI Générale'}</td>
                      <td className={`py-3.5 px-4 text-right font-bold text-sm ${
                        tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} €
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction Entry Modal */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Saisir une Écriture Comptable</h3>
            
            <form onSubmit={handleAddTxSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Type d'opération</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType('EXPENSE')}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      txType === 'EXPENSE' ? 'bg-rose-500/20 text-rose-400 border-rose-500' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Dépense
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('INCOME')}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      txType === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Recette
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Bien Immobilier</label>
                <select
                  value={txPropertyId}
                  onChange={(e) => setTxPropertyId(e.target.value)}
                  className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Montant (€)</label>
                <input
                  type="number"
                  required
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Facture plombier, Taxe foncière..."
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTxModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
