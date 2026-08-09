import React, { useState } from 'react';
import { MapPin, Building2, Eye, TrendingUp, Info } from 'lucide-react';
import { Property, Tenant } from '../types';

interface MapViewProps {
  properties: Property[];
  tenants: Tenant[];
  onSelectProperty: (property: Property) => void;
}

export const MapView: React.FC<MapViewProps> = ({ properties, tenants, onSelectProperty }) => {
  const [selectedPin, setSelectedPin] = useState<Property | null>(properties[0] || null);

  // Simplified visual map canvas representing real estate locations in France
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            <span>Carte de Géolocalisation du Parc</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualisez la répartition géographique et le statut d'occupation de vos {properties.length} biens.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Occupé ({properties.filter(p => p.status === 'Occupied').length})</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span>Vacant ({properties.filter(p => p.status === 'Vacant').length})</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Rénovation ({properties.filter(p => p.status === 'Renovation').length})</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Stylized France Map Frame */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative min-h-[460px] flex flex-col justify-between overflow-hidden shadow-xl">
          
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 z-10">
            Carte de France Interactive (Aperçu)
          </div>

          {/* Interactive Pins Container */}
          <div className="relative w-full h-[380px] bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {/* Simulated Map Markers positioned proportionally */}
            {properties.map((prop, idx) => {
              // Simple relative coordinate mapping for French cities
              let top = '40%';
              let left = '50%';

              if (prop.city.includes('Paris')) { top = '30%'; left = '52%'; }
              else if (prop.city.includes('Lyon')) { top = '58%'; left = '65%'; }
              else if (prop.city.includes('Bordeaux')) { top = '62%'; left = '32%'; }
              else if (prop.city.includes('Marseille')) { top = '78%'; left = '68%'; }
              else if (prop.city.includes('Nantes')) { top = '42%'; left = '28%'; }

              const isSelected = selectedPin?.id === prop.id;

              return (
                <div
                  key={prop.id}
                  style={{ top, left }}
                  onClick={() => setSelectedPin(prop)}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group z-20"
                >
                  <div className={`relative flex items-center justify-center p-2 rounded-full shadow-lg transition-transform hover:scale-125 ${
                    isSelected ? 'ring-4 ring-emerald-400 scale-125' : ''
                  } ${
                    prop.status === 'Occupied' ? 'bg-emerald-500 text-slate-950' :
                    prop.status === 'Vacant' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    <Building2 className="w-4 h-4 font-bold" />
                    <span className="absolute -bottom-6 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700 whitespace-nowrap shadow-md opacity-90">
                      {prop.city} ({prop.monthlyRent}€)
                    </span>
                  </div>
                </div>
              );
            })}

          </div>

        </div>

        {/* Selected Property Popup Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Info className="w-5 h-5 text-emerald-400" />
            <span>Fiche du Bien Sélectionné</span>
          </h3>

          {selectedPin ? (
            <div className="space-y-4">
              <div className="relative h-40 rounded-xl overflow-hidden border border-slate-700">
                <img
                  src={selectedPin.imageUrl}
                  alt={selectedPin.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                  selectedPin.status === 'Occupied' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}>
                  {selectedPin.status === 'Occupied' ? 'Occupé' : 'Vacant'}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">{selectedPin.title}</h4>
                <p className="text-xs text-slate-400">{selectedPin.address}, {selectedPin.city}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800 p-2.5 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Loyer HC</span>
                  <span className="font-bold text-emerald-400 text-sm">{selectedPin.monthlyRent} €</span>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Rendement Brut</span>
                  <span className="font-bold text-white text-sm">
                    {(((selectedPin.monthlyRent * 12) / selectedPin.purchasePrice) * 100).toFixed(1)} %
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectProperty(selectedPin)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Ouvrir la Fiche Détaillée</span>
              </button>
            </div>
          ) : (
            <p className="text-slate-500 text-xs py-10 text-center">Cliquez sur un marqueur de la carte pour afficher le détail.</p>
          )}

        </div>

      </div>

    </div>
  );
};
