import React, { useState } from 'react';
import { Settings, Save, Building2, CreditCard, Download, Upload, Check } from 'lucide-react';
import { LandlordProfile } from '../types';

interface SettingsViewProps {
  profile: LandlordProfile;
  onUpdateProfile: (profile: LandlordProfile) => void;
  fullStateJson: string;
  onImportStateJson: (jsonStr: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  fullStateJson,
  onImportStateJson,
}) => {
  const [formData, setFormData] = useState<LandlordProfile>(profile);
  const [saved, setSaved] = useState(false);
  const [importText, setImportText] = useState('');

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
      alert('Erreur lors de l\'import du fichier JSON.');
    }
  };

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
            Gérez la raison sociale de votre SCI, coordonnées de contact, IBAN pour quittances et sauvegardes.
          </p>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nom du Représentant Légat</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Raison Sociale / SCI</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700"
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
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Téléphone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700"
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
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse Siège Social</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700"
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
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">BIC</label>
                  <input
                    type="text"
                    value={formData.bankBic || ''}
                    onChange={(e) => setFormData({ ...formData, bankBic: e.target.value })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Modifications Enregistrées !' : 'Enregistrer les Paramètres'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Data Backup & Restore Panel */}
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
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Télécharger Sauvegarde JSON</span>
          </button>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Importer une Sauvegarde</label>
            <textarea
              rows={4}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Collez ici le contenu de votre fichier JSON de sauvegarde..."
              className="w-full bg-slate-800 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-700 resize-none font-mono"
            />
            <button
              onClick={handleImportSubmit}
              disabled={!importText.trim()}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>Restaurer la Sauvegarde</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
