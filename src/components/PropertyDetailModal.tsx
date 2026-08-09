import React from 'react';
import {
  X,
  Building2,
  MapPin,
  TrendingUp,
  User,
  Wrench,
  Receipt,
  Sparkles,
  FileText,
  DollarSign,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Property, Tenant, MaintenanceTicket } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  tenant: Tenant | undefined;
  maintenanceTickets: MaintenanceTicket[];
  onClose: () => void;
  onOpenAiAssistant: (property: Property) => void;
  onOpenQuittanceModal: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  tenant,
  maintenanceTickets,
  onClose,
  onOpenAiAssistant,
  onOpenQuittanceModal,
}) => {
  if (!property) return null;

  const annualRent = property.monthlyRent * 12;
  const grossYield = (annualRent / property.purchasePrice) * 100;
  
  // Estimated net yield (taking into account charges, tax, insurance)
  const annualExpenses = (property.annualPropertyTax || 0) + (property.annualInsurance || 0) + (property.monthlyCharges * 12 * 0.3);
  const netIncome = annualRent - annualExpenses;
  const netYield = (netIncome / property.purchasePrice) * 100;

  const propertyTickets = maintenanceTickets.filter((t) => t.propertyId === property.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header with Background Photo */}
        <div className="relative h-64 sm:h-72">
          <img
            src={property.imageUrl}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white flex items-center justify-center border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold text-white ${
                property.status === 'Occupied' ? 'bg-emerald-600' :
                property.status === 'Vacant' ? 'bg-rose-600' : 'bg-amber-600'
              }`}>
                {property.status === 'Occupied' ? 'Occupé' : property.status === 'Vacant' ? 'Vacant' : 'Rénovation'}
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                DPE Classé {property.dpe}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{property.title}</h2>
            <p className="text-sm text-slate-300 flex items-center space-x-1 mt-1">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{property.address}, {property.postalCode} {property.city}</span>
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">
              Prix d'Achat : <span className="font-extrabold text-white text-sm">{property.purchasePrice.toLocaleString('fr-FR')} €</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAiAssistant(property)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Analyser / Rédiger par IA</span>
              </button>

              <button
                onClick={onOpenQuittanceModal}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all"
              >
                <Receipt className="w-4 h-4" />
                <span>Émettre Quittance</span>
              </button>
            </div>
          </div>

          {/* Financial Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Loyer Mensuel HC</span>
              <span className="text-lg font-black text-emerald-400">{property.monthlyRent} €</span>
            </div>

            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Charges Mensuelles</span>
              <span className="text-lg font-black text-slate-200">{property.monthlyCharges} €</span>
            </div>

            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Rendement Brut</span>
              <span className="text-lg font-black text-emerald-400">{grossYield.toFixed(2)} %</span>
            </div>

            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Rendement Net Estimé</span>
              <span className="text-lg font-black text-blue-400">{netYield.toFixed(2)} %</span>
            </div>
          </div>

          {/* Main Info Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Property Specifications & Notes */}
            <div className="space-y-4 bg-slate-800/30 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-400">Fiche Technique</h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Type</span>
                  <span className="font-semibold text-slate-200">{property.type}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Surface</span>
                  <span className="font-semibold text-slate-200">{property.surface} m²</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nombre de Pièces</span>
                  <span className="font-semibold text-slate-200">{property.rooms} pièce(s)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Chambres</span>
                  <span className="font-semibold text-slate-200">{property.bedrooms} chambre(s)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Taxe Foncière / An</span>
                  <span className="font-semibold text-slate-200">{property.annualPropertyTax || 0} €</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assurance PNO / An</span>
                  <span className="font-semibold text-slate-200">{property.annualInsurance || 0} €</span>
                </div>
              </div>

              {property.notes && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Remarques & Équipements :</span>
                  <p className="text-xs text-slate-300 leading-relaxed italic">{property.notes}</p>
                </div>
              )}
            </div>

            {/* Right: Active Tenant & Maintenance */}
            <div className="space-y-4">
              
              {/* Tenant Box */}
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-400 mb-3">Locataire en Place</h3>
                
                {tenant ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-base">{tenant.firstName} {tenant.lastName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        Scoring {tenant.reliabilityScore}%
                      </span>
                    </div>
                    <p className="text-slate-300">{tenant.email} • {tenant.phone}</p>
                    <p className="text-slate-400">Bail : du {tenant.leaseStart} au {tenant.leaseEnd}</p>
                    <p className="text-slate-400">Profession : {tenant.jobTitle || 'Non renseigné'}</p>
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500 text-xs">
                    <User className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span>Bien actuellement vacant. Aucun locataire rattaché.</span>
                  </div>
                )}
              </div>

              {/* Maintenance Tickets History */}
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-400 mb-3">Interventions & Travaux</h3>
                {propertyTickets.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {propertyTickets.map((t) => (
                      <div key={t.id} className="p-2 rounded bg-slate-800 border border-slate-700 flex justify-between">
                        <div>
                          <p className="font-semibold text-slate-200">{t.title}</p>
                          <p className="text-[10px] text-slate-400">{t.createdAt} • {t.status}</p>
                        </div>
                        <span className="font-bold text-amber-400">{t.estimatedCost || 0} €</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Aucune demande de travaux enregistrée.</p>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
