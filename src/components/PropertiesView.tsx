import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  SlidersHorizontal,
  Home,
  Store,
  Car,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Edit,
  Trash2,
  Info
} from 'lucide-react';
import { Property, PropertyType, PropertyStatus, Tenant } from '../types';

interface PropertiesViewProps {
  properties: Property[];
  tenants: Tenant[];
  onOpenAddModal: () => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenAiForProperty: (property: Property) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  properties,
  tenants,
  onOpenAddModal,
  onEditProperty,
  onDeleteProperty,
  onSelectProperty,
  onOpenAiForProperty,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: PropertyType) => {
    switch (type) {
      case 'House':
        return <Home className="w-4 h-4 text-emerald-400" />;
      case 'Commercial':
        return <Store className="w-4 h-4 text-blue-400" />;
      case 'Parking':
        return <Car className="w-4 h-4 text-amber-400" />;
      default:
        return <Building2 className="w-4 h-4 text-purple-400" />;
    }
  };

  const getDpeBadgeColor = (dpe: string) => {
    switch (dpe) {
      case 'A': return 'bg-emerald-600 text-white';
      case 'B': return 'bg-emerald-500 text-white';
      case 'C': return 'bg-lime-500 text-slate-950';
      case 'D': return 'bg-yellow-500 text-slate-950';
      case 'E': return 'bg-orange-500 text-white';
      case 'F': return 'bg-rose-500 text-white';
      case 'G': return 'bg-red-700 text-white';
      default: return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <span>Parc Immobilier ({filteredProperties.length})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gérez vos appartements, maisons, locaux commerciaux et parkings.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un Bien</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, ville, adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-1 text-xs text-slate-400 mr-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtres :</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tous les Types</option>
            <option value="Apartment">Appartement</option>
            <option value="House">Maison</option>
            <option value="Commercial">Local Commercial</option>
            <option value="Parking">Parking / Garage</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tous les Statuts</option>
            <option value="Occupied">Occupé</option>
            <option value="Vacant">Vacant</option>
            <option value="Renovation">En Rénovation</option>
          </select>
        </div>

      </div>

      {/* Property Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => {
            const tenant = tenants.find((t) => t.id === prop.tenantId);
            const grossYield = ((prop.monthlyRent * 12) / prop.purchasePrice) * 100;

            return (
              <div
                key={prop.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Property Image & Status Overlay */}
                  <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onSelectProperty(prop)}>
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-md ${
                        prop.status === 'Occupied' ? 'bg-emerald-600' :
                        prop.status === 'Vacant' ? 'bg-rose-600' : 'bg-amber-600'
                      }`}>
                        {prop.status === 'Occupied' ? 'Occupé' : prop.status === 'Vacant' ? 'Vacant' : 'En Travaux'}
                      </span>
                      
                      <span className={`px-2 py-0.5 rounded-md text-xs font-black shadow-md ${getDpeBadgeColor(prop.dpe)}`}>
                        DPE {prop.dpe}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-black text-white border border-slate-700">
                      {prop.monthlyRent.toLocaleString('fr-FR')} € <span className="text-[10px] text-slate-400 font-normal">/ mo HC</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-slate-800">
                        {getTypeIcon(prop.type)}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {prop.type === 'Apartment' ? 'Appartement' : prop.type === 'House' ? 'Maison' : prop.type === 'Commercial' ? 'Local Commercial' : 'Parking'}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectProperty(prop)}
                      className="font-bold text-white text-base hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {prop.title}
                    </h3>

                    <p className="text-xs text-slate-400 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{prop.address}, {prop.city}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                      <div className="bg-slate-800/60 p-2 rounded-lg">
                        <span className="text-slate-400 text-[10px] block">Surface / Pièces</span>
                        <span className="font-semibold text-slate-200">{prop.surface} m² ({prop.rooms} p.)</span>
                      </div>
                      <div className="bg-slate-800/60 p-2 rounded-lg">
                        <span className="text-slate-400 text-[10px] block">Rendement Brut</span>
                        <span className="font-bold text-emerald-400">{grossYield.toFixed(1)} %</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-slate-400">Locataire : </span>
                      {tenant ? (
                        <span className="font-semibold text-emerald-400">{tenant.firstName} {tenant.lastName}</span>
                      ) : (
                        <span className="text-rose-400 italic">Aucun (Recherche de locataire)</span>
                      )}
                    </div>

                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-800/60 mt-2">
                  
                  <button
                    onClick={() => onOpenAiForProperty(prop)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/40 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                    title="Générer une annonce ou analyser ce bien avec l'IA"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    <span>Annonce IA</span>
                  </button>

                  <button
                    onClick={() => onSelectProperty(prop)}
                    className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Fiche</span>
                  </button>

                  <button
                    onClick={() => onEditProperty(prop)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Modifier le bien"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteProperty(prop.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Supprimer le bien"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-semibold text-lg text-white">Aucun bien trouvé</p>
          <p className="text-xs text-slate-500 mt-1">Ajustez vos filtres de recherche ou ajoutez un nouveau bien immobilier.</p>
        </div>
      )}

    </div>
  );
};
