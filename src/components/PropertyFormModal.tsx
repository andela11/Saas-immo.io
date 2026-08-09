import React, { useState, useEffect } from 'react';
import { X, Building2, Calculator, Image as ImageIcon } from 'lucide-react';
import { Property, PropertyType, PropertyStatus, DPEGrade } from '../types';

interface PropertyFormModalProps {
  propertyToEdit?: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Property) => void;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  propertyToEdit,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    type: 'Apartment',
    address: '',
    city: 'Paris',
    postalCode: '75000',
    surface: 50,
    rooms: 2,
    bedrooms: 1,
    purchasePrice: 250000,
    monthlyRent: 950,
    monthlyCharges: 80,
    status: 'Vacant',
    dpe: 'C',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    lat: 48.8566,
    lng: 2.3522,
    notes: '',
    annualPropertyTax: 800,
    annualInsurance: 200,
  });

  useEffect(() => {
    if (propertyToEdit) {
      setFormData(propertyToEdit);
    }
  }, [propertyToEdit]);

  const handleChange = (field: keyof Property, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculatedYield = formData.purchasePrice && formData.monthlyRent
    ? ((formData.monthlyRent * 12) / formData.purchasePrice) * 100
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.address || !formData.city) return;

    const finalProperty: Property = {
      id: propertyToEdit ? propertyToEdit.id : `prop-${Date.now()}`,
      title: formData.title || 'Bien Immobilier',
      type: (formData.type as PropertyType) || 'Apartment',
      address: formData.address || '',
      city: formData.city || 'Paris',
      postalCode: formData.postalCode || '75000',
      surface: Number(formData.surface) || 0,
      rooms: Number(formData.rooms) || 1,
      bedrooms: Number(formData.bedrooms) || 0,
      purchasePrice: Number(formData.purchasePrice) || 0,
      monthlyRent: Number(formData.monthlyRent) || 0,
      monthlyCharges: Number(formData.monthlyCharges) || 0,
      status: (formData.status as PropertyStatus) || 'Vacant',
      dpe: (formData.dpe as DPEGrade) || 'C',
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      lat: Number(formData.lat) || 48.8566,
      lng: Number(formData.lng) || 2.3522,
      tenantId: formData.tenantId,
      notes: formData.notes,
      annualPropertyTax: Number(formData.annualPropertyTax) || 0,
      annualInsurance: Number(formData.annualInsurance) || 0,
    };

    onSave(finalProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {propertyToEdit ? 'Modifier le Bien' : 'Nouveau Bien Immobilier'}
              </h2>
              <p className="text-xs text-slate-400">Renseignez les données financières et techniques</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nom / Titre du Bien *
            </label>
            <input
              type="text"
              required
              placeholder="ex: T3 Lumineux Haussmannien"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full bg-slate-800 text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Type de Bien</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as PropertyType)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="Apartment">Appartement</option>
                <option value="House">Maison</option>
                <option value="Commercial">Local Commercial</option>
                <option value="Parking">Parking / Garage</option>
                <option value="Building">Immeuble de Rapport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Statut d'Occupation</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as PropertyStatus)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="Occupied">Occupé</option>
                <option value="Vacant">Vacant</option>
                <option value="Renovation">En Rénovation</option>
              </select>
            </div>
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse *</label>
              <input
                type="text"
                required
                placeholder="24 Rue de Courcelles"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ville *</label>
              <input
                type="text"
                required
                placeholder="Paris"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Surface & Rooms */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Surface (m²)</label>
              <input
                type="number"
                value={formData.surface}
                onChange={(e) => handleChange('surface', e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pièces</label>
              <input
                type="number"
                value={formData.rooms}
                onChange={(e) => handleChange('rooms', e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Diagnostic DPE</label>
              <select
                value={formData.dpe}
                onChange={(e) => handleChange('dpe', e.target.value as DPEGrade)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 font-bold text-emerald-400"
              >
                <option value="A">Classé A (Très économe)</option>
                <option value="B">Classé B</option>
                <option value="C">Classé C</option>
                <option value="D">Classé D</option>
                <option value="E">Classé E</option>
                <option value="F">Classé F (Passoire thermique)</option>
                <option value="G">Classé G (Passoire thermique)</option>
              </select>
            </div>
          </div>

          {/* Financials & Live Yield Calculation */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center space-x-1">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Indicateurs Financiers</span>
              </span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Rendement Brut Live : {calculatedYield.toFixed(2)} %
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Prix d'Achat Net (€)</label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => handleChange('purchasePrice', e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Loyer Mensuel HC (€)</label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleChange('monthlyRent', e.target.value)}
                  className="w-full bg-slate-900 text-emerald-400 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 font-extrabold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Charges Mensuelles (€)</label>
                <input
                  type="number"
                  value={formData.monthlyCharges}
                  onChange={(e) => handleChange('monthlyCharges', e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>URL de la Photo du Bien</span>
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className="w-full bg-slate-800 text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Remarques & Atouts</label>
            <textarea
              rows={2}
              placeholder="ex: Parquet, balcon, cave, proche métro..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full bg-slate-800 text-slate-100 text-xs p-3 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              Enregistrer le Bien
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
