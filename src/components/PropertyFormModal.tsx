import React, { useState, useEffect, useRef } from 'react';
import { X, Building2, Calculator, Image as ImageIcon, Upload, Link, Trash2, Check, FileImage } from 'lucide-react';
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

  const [photoSourceMode, setPhotoSourceMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (propertyToEdit) {
      setFormData(propertyToEdit);
    }
  }, [propertyToEdit]);

  const handleChange = (field: keyof Property, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier sélectionné dépasse 10 Mo. Veuillez choisir une image plus légère.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handleChange('imageUrl', e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
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

          {/* Photo Management Section */}
          <div className="space-y-2.5 bg-slate-800/40 p-4 rounded-xl border border-slate-700/80">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Photo du Bien Immobilier</span>
              </label>

              {/* Toggle Mode */}
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setPhotoSourceMode('upload')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    photoSourceMode === 'upload'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Depuis mon appareil</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoSourceMode('url')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    photoSourceMode === 'url'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Link className="w-3 h-3" />
                  <span>Lien URL</span>
                </button>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload Box Mode */}
            {photoSourceMode === 'upload' ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-900/60'
                }`}
              >
                {formData.imageUrl ? (
                  <div className="w-full flex items-center space-x-3 text-left">
                    <img
                      src={formData.imageUrl}
                      alt="Aperçu"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-1">
                        {formData.imageUrl.startsWith('data:') ? 'Photo Locale Importée' : 'Photo Définie'}
                      </span>
                      <p className="text-xs text-slate-300 font-medium truncate">
                        Cliquer ou glisser un fichier pour remplacer la photo
                      </p>
                      <p className="text-[10px] text-slate-500">Formats supportés: JPG, PNG, WEBP, GIF (Max 10 Mo)</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChange('imageUrl', '');
                      }}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"
                      title="Supprimer la photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        Glissez-déposez une photo ici ou <span className="text-emerald-400 underline">Parcourir</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Importation directe depuis votre PC, Smartphone ou Tablette
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* URL Mode */
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
                {formData.imageUrl && (
                  <div className="flex items-center space-x-2 text-xs text-slate-400 pt-1">
                    <img
                      src={formData.imageUrl}
                      alt="Aperçu URL"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                    />
                    <span className="text-[11px] text-slate-300 truncate">Aperçu du lien d'image</span>
                  </div>
                )}
              </div>
            )}
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
