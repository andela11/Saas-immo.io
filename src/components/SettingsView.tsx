import React, { useState } from 'react';
import {
  Settings,
  Save,
  Building2,
  CreditCard,
  Download,
  Upload,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  Receipt,
  ArrowUpRight
} from 'lucide-react';
import { LandlordProfile, SubscriptionInvoice } from '../types';
import { PaymentModal } from './PaymentModal';

interface SettingsViewProps {
  profile: LandlordProfile;
  onUpdateProfile: (profile: LandlordProfile) => void;
  fullStateJson: string;
  onImportStateJson: (jsonStr: string) => void;
  onOpenPaymentModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  fullStateJson,
  onImportStateJson,
  onOpenPaymentModal,
}) => {
  const [formData, setFormData] = useState<LandlordProfile>(profile);
  const [saved, setSaved] = useState(false);
  const [importText, setImportText] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExport = () => {
    const blob = new Blob([fullStateJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-immogestion-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    try {
      onImportStateJson(importText);
      alert('Sauvegarde importée avec succès !');
      setImportText('');
    } catch (err) {
      alert("Erreur lors de l'import du fichier JSON.");
    }
  };

  const handlePrintInvoice = (inv: SubscriptionInvoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facture Immogestion - ${inv.pdfNumber}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 900; color: #0284c7; }
            .badge { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 99px; font-weight: bold; font-size: 12px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            th { background: #f1f5f9; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
            td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            .total-box { margin-left: auto; width: 250px; font-size: 14px; }
            .total-box div { display: flex; justify-content: space-between; padding: 6px 0; }
            .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #0f172a; color: #0f172a; padding-top: 10px; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Immogestion SaaS</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Gestion Immobilière Intelligente</div>
            </div>
            <div style="text-align: right;">
              <span class="badge">FACTURE PAYÉE</span>
              <div style="font-size: 12px; color: #64748b; margin-top: 8px;">N° ${inv.pdfNumber}</div>
              <div style="font-size: 12px; color: #64748b;">Date: ${inv.date}</div>
            </div>
          </div>

          <div class="info-grid">
            <div>
              <strong>Émetteur :</strong><br/>
              Immogestion France SAS<br/>
              128 Rue La Boétie, 75008 Paris<br/>
              SIRET : 880 123 456 00019
            </div>
            <div>
              <strong>Client :</strong><br/>
              ${profile.companyName || profile.name}<br/>
              ${profile.name}<br/>
              ${profile.email}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Désignation</th>
                <th>Période</th>
                <th>Montant HT</th>
                <th>TVA (20%)</th>
                <th>Total TTC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Abonnement ${inv.planName}</strong></td>
                <td>${inv.billingCycle === 'yearly' ? '1 An' : '1 Mois'}</td>
                <td>${Math.round(inv.amount * 0.833)} €</td>
                <td>${Math.round(inv.amount * 0.167)} €</td>
                <td><strong>${inv.amount} €</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="total-box">
            <div><span>Total HT :</span><span>${Math.round(inv.amount * 0.833)} €</span></div>
            <div><span>TVA (20%) :</span><span>${Math.round(inv.amount * 0.167)} €</span></div>
            <div class="grand-total"><span>Total Régler TTC :</span><span>${inv.amount} €</span></div>
          </div>

          <div class="footer">
            Paiement sécurisé via Carte Bancaire 3D Secure.<br/>
            Contact Support : billing@immogestion.fr
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const currentPlanName =
    profile.subscriptionPlan === 'pro'
      ? 'Pro SCI & Multi-Biens'
      : profile.subscriptionPlan === 'patrimoine'
      ? 'Patrimoine / Agence'
      : 'Starter Gratuit';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Settings className="w-6 h-6 text-slate-400" />
            <span>Paramètres SCI & Compte Propriétaire</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gérez la raison sociale de votre SCI, coordonnées bancaires, abonnement SaaS et sauvegardes.
          </p>
        </div>
      </div>

      {/* Subscription SaaS Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Abonnement Actif</span>
            </span>
            <span className="text-xs text-slate-400">Renouvellement le {profile.subscriptionRenewalDate || '2026-09-01'}</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <span>{currentPlanName}</span>
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Profitez de l'assistant IA Gemini 3.6 Flash, de la génération illimitée de quittances, du suivi fiscal LMNP et de la synchronisation cloud en temps réel.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              if (onOpenPaymentModal) onOpenPaymentModal();
              else setIsPaymentModalOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Changer de Formule / Moyen de Paiement</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Profil de la Société / Propriétaire</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nom du Représentant Légal</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Raison Sociale / SCI</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email de Contact</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Téléphone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Numéro SIRET (Optionnel)</label>
                <input
                  type="text"
                  value={formData.siret || ''}
                  onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse Siège Social</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bank Info */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Coordonnées Bancaires (Sur Quittances)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">IBAN</label>
                  <input
                    type="text"
                    value={formData.bankIban || ''}
                    onChange={(e) => setFormData({ ...formData, bankIban: e.target.value })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">BIC</label>
                  <input
                    type="text"
                    value={formData.bankBic || ''}
                    onChange={(e) => setFormData({ ...formData, bankBic: e.target.value })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Modifications Enregistrées !' : 'Enregistrer les Paramètres'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Data Backup & Invoices Side Panel */}
        <div className="space-y-6">
          
          {/* Invoice History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span>Historique des Factures</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                {profile.subscriptionInvoices?.length || 0} reçues
              </span>
            </h3>

            {profile.subscriptionInvoices && profile.subscriptionInvoices.length > 0 ? (
              <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar">
                {profile.subscriptionInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{inv.pdfNumber}</div>
                      <div className="text-[10px] text-slate-400">
                        {inv.date} • {inv.planName} ({inv.amount} €)
                      </div>
                    </div>

                    <button
                      onClick={() => handlePrintInvoice(inv)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                      title="Imprimer / Télécharger"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Aucune facture enregistrée pour le moment.</p>
            )}
          </div>

          {/* Backup & Restore Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Download className="w-5 h-5 text-blue-400" />
              <span>Sauvegarde & Exportation</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Exportez l'intégralité de vos données (biens, locataires, historique des loyers, interventions) au format JSON.
            </p>

            <button
              onClick={handleExport}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Télécharger Sauvegarde JSON</span>
            </button>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Importer une Sauvegarde</label>
              <textarea
                rows={3}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Collez ici le contenu de votre fichier JSON..."
                className="w-full bg-slate-800 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-700 resize-none font-mono focus:border-emerald-500 focus:outline-none"
              />
              <button
                onClick={handleImportSubmit}
                disabled={!importText.trim()}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Restaurer la Sauvegarde</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => {
          onUpdateProfile(updated);
          setFormData(updated);
        }}
      />

    </div>
  );
};

