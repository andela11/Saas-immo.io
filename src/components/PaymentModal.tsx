import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Download,
  Building2,
  Zap,
  Check,
  RefreshCw,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { LandlordProfile, SubscriptionPlanId, SubscriptionBillingCycle, SubscriptionInvoice } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LandlordProfile;
  onUpdateProfile: (updated: LandlordProfile) => void;
  initialPlan?: SubscriptionPlanId;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  initialPlan = 'pro',
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>(
    profile.subscriptionPlan || initialPlan
  );
  const [billingCycle, setBillingCycle] = useState<SubscriptionBillingCycle>(
    profile.billingCycle || 'monthly'
  );
  const [paymentType, setPaymentType] = useState<'card' | 'sepa'>('card');

  // Form State
  const [cardholder, setCardholder] = useState(profile.name || '');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [sepaIban, setSepaIban] = useState(profile.bankIban || '');

  // UI State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<SubscriptionInvoice | null>(null);

  if (!isOpen) return null;

  // Plan Price Calculations
  const getPrice = (plan: SubscriptionPlanId, cycle: SubscriptionBillingCycle) => {
    if (plan === 'free') return 0;
    if (plan === 'pro') return cycle === 'yearly' ? 15 : 19;
    if (plan === 'patrimoine') return cycle === 'yearly' ? 39 : 49;
    return 0;
  };

  const monthlyPrice = getPrice(selectedPlan, billingCycle);
  const subtotalHT = Math.round(monthlyPrice * (billingCycle === 'yearly' ? 12 : 1) * 0.833);
  const tva = Math.round(monthlyPrice * (billingCycle === 'yearly' ? 12 : 1) * 0.167);
  const totalTTC = monthlyPrice * (billingCycle === 'yearly' ? 12 : 1);

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Format Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
    }, 1200);

    setTimeout(() => {
      setProcessingStep(3);
    }, 2400);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const planName =
        selectedPlan === 'pro'
          ? 'Pro SCI & Multi-Biens'
          : selectedPlan === 'patrimoine'
          ? 'Patrimoine / Agence'
          : 'Starter Gratuit';

      const newInvoice: SubscriptionInvoice = {
        id: `inv-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: totalTTC,
        planName,
        billingCycle,
        status: 'Paid',
        pdfNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      setLastInvoice(newInvoice);

      const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '4242';

      const updatedProfile: LandlordProfile = {
        ...profile,
        subscriptionPlan: selectedPlan,
        billingCycle,
        subscriptionStatus: 'active',
        subscriptionRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        paymentMethod: {
          cardLast4: last4,
          brand: 'visa',
          expiryMonth: expiry.split('/')[0] || '12',
          expiryYear: expiry.split('/')[1] ? `20${expiry.split('/')[1]}` : '2028',
          cardholderName: cardholder || profile.name,
        },
        subscriptionInvoices: [newInvoice, ...(profile.subscriptionInvoices || [])],
      };

      onUpdateProfile(updatedProfile);
    }, 3600);
  };

  const handlePrintReceipt = (inv: SubscriptionInvoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facture Immogestion - ${inv.pdfNumber}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-b: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 900; color: #0284c7; }
            .badge { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 99px; font-weight: bold; font-size: 12px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            th { background: #f1f5f9; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
            td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            .total-box { margin-left: auto; width: 250px; font-size: 14px; }
            .total-box div { display: flex; justify-content: space-between; padding: 6px 0; }
            .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #0f172a; color: #0f172a; padding-top: 10px; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #64748b; border-t: 1px solid #e2e8f0; padding-top: 20px; }
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
              SIRET : 880 123 456 00019<br/>
              TVA Intracommunautaire : FR88880123456
            </div>
            <div>
              <strong>Client :</strong><br/>
              ${profile.companyName || profile.name}<br/>
              ${profile.name}<br/>
              ${profile.address || 'France'}<br/>
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
            Paiement effectué par Carte Bancaire via protocole sécurisé 3D-Secure.<br/>
            Merci de votre confiance. Pour toute question : billing@immogestion.fr
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative my-auto">
        
        {/* Modal Top Header */}
        <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Passerelle de Paiement & Abonnement
              </h2>
              <p className="text-xs text-slate-400">
                Abonnement sécurisé avec arrêt à tout moment en 1 clic
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                Félicitations ! Votre abonnement est actif
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Votre transaction a été validée avec succès par protocole 3D Secure 2.0. Toutes les fonctionnalités de votre formule sont désormais débloquées.
              </p>
            </div>

            {lastInvoice && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center space-x-1.5 font-bold text-slate-200">
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span>Facture N° {lastInvoice.pdfNumber}</span>
                  </span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Payé
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Formule</span>
                    <span className="font-bold text-white">{lastInvoice.planName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Montant Régler</span>
                    <span className="font-black text-emerald-400">{lastInvoice.amount} € TTC</span>
                  </div>
                </div>

                <button
                  onClick={() => handlePrintReceipt(lastInvoice)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center space-x-2 transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Imprimer / Télécharger la Facture (PDF)</span>
                </button>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all"
              >
                Accéder à mon Espace Immogestion
              </button>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="p-12 text-center space-y-8 min-h-[400px] flex flex-col justify-center items-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
              <Lock className="w-8 h-8 text-emerald-400 absolute inset-0 m-auto" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white">
                Traitement du Paiement en cours...
              </h3>
              <div className="space-y-2 max-w-sm mx-auto text-xs">
                <div
                  className={`flex items-center space-x-2 p-2.5 rounded-lg border transition-all ${
                    processingStep >= 1
                      ? 'bg-slate-800 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}
                >
                  {processingStep >= 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                  )}
                  <span>Connexion chiffrée SSL 256-bit...</span>
                </div>

                <div
                  className={`flex items-center space-x-2 p-2.5 rounded-lg border transition-all ${
                    processingStep >= 2
                      ? 'bg-slate-800 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}
                >
                  {processingStep >= 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                  )}
                  <span>Authentification 3D Secure 2.0...</span>
                </div>

                <div
                  className={`flex items-center space-x-2 p-2.5 rounded-lg border transition-all ${
                    processingStep >= 3
                      ? 'bg-slate-800 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}
                >
                  {processingStep >= 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                  )}
                  <span>Génération de la facture & activation...</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            
            {/* Cycle Selector & Plan Cards Grid */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="text-xs font-bold text-slate-300">
                  Choisissez la période de facturation :
                </div>

                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      billingCycle === 'yearly'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Annuel</span>
                    <span className="bg-slate-950 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                      -20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Tier Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* Starter Free */}
                <div
                  onClick={() => setSelectedPlan('free')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 relative ${
                    selectedPlan === 'free'
                      ? 'bg-slate-800/80 border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase">Starter</span>
                    {selectedPlan === 'free' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white">0 €</span>
                    <span className="text-[10px] text-slate-400"> / mois pour toujours</span>
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1">
                    <li>• 1 lot ou appartement</li>
                    <li>• Quittances illimitées</li>
                    <li>• Support basique</li>
                  </ul>
                </div>

                {/* Pro SCI */}
                <div
                  onClick={() => setSelectedPlan('pro')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 relative ${
                    selectedPlan === 'pro'
                      ? 'bg-slate-800/90 border-2 border-emerald-500 shadow-xl shadow-emerald-500/20'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="absolute -top-2.5 right-4 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full">
                    Populaire
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Pro SCI</span>
                    {selectedPlan === 'pro' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white">
                      {getPrice('pro', billingCycle)} €
                    </span>
                    <span className="text-[10px] text-slate-400"> / mois</span>
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-1">
                    <li className="font-bold text-emerald-400">• Jusqu'à 10 lots</li>
                    <li>• Assistant IA Gemini Illimité</li>
                    <li>• Relances & Baux automatiques</li>
                  </ul>
                </div>

                {/* Patrimoine */}
                <div
                  onClick={() => setSelectedPlan('patrimoine')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 relative ${
                    selectedPlan === 'patrimoine'
                      ? 'bg-slate-800/80 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 uppercase">Patrimoine</span>
                    {selectedPlan === 'patrimoine' && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white">
                      {getPrice('patrimoine', billingCycle)} €
                    </span>
                    <span className="text-[10px] text-slate-400"> / mois</span>
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-1">
                    <li>• Lots & Biens illimités</li>
                    <li>• Exports comptables LMNP / FEC</li>
                    <li>• Multi-associés & API</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Form & Order Breakdown Grid */}
            <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 border-t border-slate-800">
              
              {/* Payment Info Inputs */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Method Tabs */}
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('card')}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      paymentType === 'card'
                        ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Carte Bancaire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('sepa')}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      paymentType === 'sepa'
                        ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Prélèvement SEPA</span>
                  </button>
                </div>

                {paymentType === 'card' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Nom figurant sur la carte
                      </label>
                      <input
                        type="text"
                        required
                        value={cardholder}
                        onChange={(e) => setCardholder(e.target.value)}
                        placeholder="Alexandre De Saint-Germain"
                        className="w-full bg-slate-950/80 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                        <span>Numéro de carte bancaire</span>
                        <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          <span>Chiffrement TLS 1.3</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-slate-950/80 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 font-mono tracking-wider focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Expiration (MM/YY)
                        </label>
                        <input
                          type="text"
                          required
                          value={expiry}
                          onChange={handleExpiryChange}
                          placeholder="12/28"
                          className="w-full bg-slate-950/80 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          placeholder="888"
                          className="w-full bg-slate-950/80 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Titulaire du Compte SEPA
                      </label>
                      <input
                        type="text"
                        required
                        value={cardholder}
                        onChange={(e) => setCardholder(e.target.value)}
                        className="w-full bg-slate-950/80 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        IBAN Compte Bancaire
                      </label>
                      <input
                        type="text"
                        required
                        value={sepaIban}
                        onChange={(e) => setSepaIban(e.target.value)}
                        placeholder="FR76 3000 4018 2000 0123 4567 890"
                        className="w-full bg-slate-950/80 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 font-mono"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Order Summary & Submit Button */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white uppercase tracking-wider border-b border-slate-800 pb-2 mb-3">
                    Récapitulatif Commande
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Formule :</span>
                      <span className="font-bold text-white">
                        {selectedPlan === 'pro'
                          ? 'Pro SCI'
                          : selectedPlan === 'patrimoine'
                          ? 'Patrimoine'
                          : 'Starter'}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Fréquence :</span>
                      <span className="text-white">
                        {billingCycle === 'yearly' ? 'Annuel (-20%)' : 'Mensuel'}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Sous-total HT :</span>
                      <span className="text-white">{subtotalHT} €</span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>TVA (20%) :</span>
                      <span className="text-white">{tva} €</span>
                    </div>

                    <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-black text-emerald-400">
                      <span>Total TTC :</span>
                      <span>{totalTTC} €</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>Valider & Payer ({totalTTC} €)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Paiement sécurisé 3D Secure • Satisfait ou remboursé 14j</span>
                  </div>
                </div>

              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
