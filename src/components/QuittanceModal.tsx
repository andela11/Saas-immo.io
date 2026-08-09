import React, { useState } from 'react';
import { X, Printer, Copy, Check, ShieldCheck, Download, Receipt, Building2 } from 'lucide-react';
import { LandlordProfile, Property, Tenant, PaymentRecord } from '../types';

interface QuittanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LandlordProfile;
  properties: Property[];
  tenants: Tenant[];
  paymentToGenerate?: PaymentRecord | null;
}

export const QuittanceModal: React.FC<QuittanceModalProps> = ({
  isOpen,
  onClose,
  profile,
  properties,
  tenants,
  paymentToGenerate,
}) => {
  if (!isOpen) return null;

  const initialTenant = paymentToGenerate
    ? tenants.find((t) => t.id === paymentToGenerate.tenantId) || tenants[0]
    : tenants[0];

  const [selectedTenantId, setSelectedTenantId] = useState<string>(initialTenant?.id || '');
  const [period, setPeriod] = useState<string>(paymentToGenerate?.month || 'Août 2026');
  const [copied, setCopied] = useState(false);

  const currentTenant = tenants.find((t) => t.id === selectedTenantId) || tenants[0];
  const currentProperty = properties.find((p) => p.id === currentTenant?.propertyId) || properties[0];

  const rentAmount = currentTenant?.rentAmount || 850;
  const chargesAmount = currentTenant?.chargesAmount || 70;
  const totalAmount = rentAmount + chargesAmount;

  const currentDateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `QUITTANCE DE LOYER
Période : ${period}

BAILLEUR :
${profile.companyName || profile.name}
${profile.address}
SIRET : ${profile.siret || 'N/A'}

LOCATAIRE :
${currentTenant?.firstName} ${currentTenant?.lastName}
${currentProperty?.address}, ${currentProperty?.postalCode} ${currentProperty?.city}

DETAIL DES SOMMES VERSEES :
- Loyer hors charges : ${rentAmount} €
- Provision sur charges : ${chargesAmount} €
TOTAL PAYÉ : ${totalAmount} €

Je soussigné(e) ${profile.name}, représentant le bailleur, reconnais avoir reçu la somme de ${totalAmount} € au titre du loyer et des charges pour la période susmentionnée.

Fait à Paris, le ${currentDateStr}
Signature du Bailleur`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Controls Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Quittance de Loyer Officielle</h2>
              <p className="text-xs text-slate-400">Document conforme à la Loi n° 89-462 du 6 juillet 1989</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selection Bar */}
        <div className="bg-slate-800/60 p-4 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Locataire Destinataire</label>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="w-full bg-slate-900 text-white font-bold p-2 rounded-lg border border-slate-700"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName} ({t.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Mois de la Quittance</label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="ex: Août 2026"
              className="w-full bg-slate-900 text-white font-bold p-2 rounded-lg border border-slate-700"
            />
          </div>
        </div>

        {/* Official Printable Receipt Document */}
        <div className="p-8 bg-white text-slate-900 font-sans print:p-0 print:m-0" id="printable-quittance">
          
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">QUITTANCE DE LOYER</h1>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1">
                Période : {period}
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="font-bold text-slate-900 block">{profile.companyName}</span>
              <span className="text-slate-600 block">SIRET : {profile.siret || 'N/A'}</span>
            </div>
          </div>

          {/* Landlord vs Tenant Box */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
            {/* Bailleur */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-extrabold uppercase text-slate-500 text-[10px] tracking-wider mb-2">Bailleur / Mandataire</h3>
              <p className="font-bold text-slate-900 text-sm">{profile.name}</p>
              <p className="font-semibold text-slate-700">{profile.companyName}</p>
              <p className="text-slate-600 mt-1">{profile.address}</p>
              <p className="text-slate-600">{profile.email} • {profile.phone}</p>
            </div>

            {/* Locataire */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-extrabold uppercase text-slate-500 text-[10px] tracking-wider mb-2">Locataire</h3>
              <p className="font-bold text-slate-900 text-sm">{currentTenant?.firstName} {currentTenant?.lastName}</p>
              <p className="text-slate-700 mt-1">{currentProperty?.address}</p>
              <p className="text-slate-700">{currentProperty?.postalCode} {currentProperty?.city}</p>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="mb-6">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-y border-slate-300">
                  <th className="py-2.5 px-3">Désignation</th>
                  <th className="py-2.5 px-3 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-800">Loyer Principal Hors Charges</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">{rentAmount.toFixed(2)} €</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-800">Provision pour charges locatives</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">{chargesAmount.toFixed(2)} €</td>
                </tr>
                <tr className="bg-emerald-50 font-black">
                  <td className="py-3 px-3 text-emerald-900 text-sm">TOTAL ACQUITTÉ</td>
                  <td className="py-3 px-3 text-right text-emerald-900 text-base">{totalAmount.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Declaration Statement */}
          <div className="text-xs leading-relaxed text-slate-700 mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p>
              Je soussigné(e), <strong className="text-slate-900">{profile.name}</strong>, représentant du bailleur <strong className="text-slate-900">{profile.companyName}</strong>, reconnais avoir reçu de M./Mme <strong className="text-slate-900">{currentTenant?.firstName} {currentTenant?.lastName}</strong> la somme de <strong className="text-slate-900">{totalAmount.toFixed(2)} €</strong> au titre du paiement du loyer et des charges pour la période du mois de <strong>{period}</strong>.
            </p>
            <p className="mt-2 text-[11px] text-slate-500 italic">
              Cette quittance annule tous les reçus qui auraient pu être donnés pour acompte versé à ce jour. À conserver pendant une durée minimale de 3 ans.
            </p>
          </div>

          {/* Signature Footer */}
          <div className="flex justify-between items-end pt-4 border-t border-slate-300 text-xs">
            <div>
              <p className="text-slate-500 text-[11px]">Fait à Paris, le {currentDateStr}</p>
              <p className="text-slate-500 text-[11px] font-mono mt-1">Réf Document : QUIT-{Date.now().toString().slice(-6)}</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-slate-900 mb-8">Signature du Bailleur</p>
              <div className="inline-block border-b-2 border-slate-400 w-36 pb-1 text-[10px] text-slate-400 font-serif italic">
                {profile.companyName}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
