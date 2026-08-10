import React, { useState, useRef } from 'react';
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Phone,
  User,
  Building2,
  X,
  Search,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { MaintenanceTicket, MaintenanceStatus, MaintenancePriority, Property, Tenant } from '../types';

interface MaintenanceViewProps {
  tickets: MaintenanceTicket[];
  properties: Property[];
  tenants: Tenant[];
  onAddTicket: (ticket: MaintenanceTicket) => void;
  onUpdateTicketStatus: (ticketId: string, status: MaintenanceStatus) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  tickets,
  properties,
  tenants,
  onAddTicket,
  onUpdateTicketStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<MaintenanceTicket>>({
    title: '',
    description: '',
    category: 'Plumbing',
    priority: 'Medium',
    status: 'New',
    propertyId: properties[0]?.id || '',
    estimatedCost: 150,
    contractorName: '',
    contractorPhone: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTicketFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Veuillez choisir un fichier image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({ ...prev, imageUrl: event.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.propertyId) return;

    const newTicket: MaintenanceTicket = {
      id: `maint-${Date.now()}`,
      propertyId: formData.propertyId || properties[0]?.id || '',
      tenantId: formData.tenantId,
      title: formData.title || '',
      description: formData.description || '',
      category: formData.category || 'Plumbing',
      priority: formData.priority || 'Medium',
      status: formData.status || 'New',
      createdAt: new Date().toISOString().split('T')[0],
      imageUrl: formData.imageUrl,
      estimatedCost: Number(formData.estimatedCost) || 0,
      contractorName: formData.contractorName,
      contractorPhone: formData.contractorPhone,
    };

    onAddTicket(newTicket);
    setIsModalOpen(false);
  };

  const columns: { status: MaintenanceStatus; label: string; color: string }[] = [
    { status: 'New', label: 'Nouvelles Demandes', color: 'border-blue-500' },
    { status: 'In_Progress', label: 'Interventions en Cours', color: 'border-amber-500' },
    { status: 'Scheduled', label: 'Planifiées', color: 'border-purple-500' },
    { status: 'Resolved', label: 'Résolues', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Wrench className="w-6 h-6 text-amber-400" />
            <span>Maintenance & Suivi des Travaux</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gérez les demandes de réparation des locataires et les devis artisans.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Demande</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTickets = tickets.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className={`bg-slate-900/80 border-t-4 ${col.color} border-slate-800 rounded-xl p-4 space-y-3 min-h-[420px]`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">{col.label}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                  {colTickets.length}
                </span>
              </div>

              <div className="space-y-3">
                {colTickets.map((ticket) => {
                  const property = properties.find((p) => p.id === ticket.propertyId);

                  return (
                    <div
                      key={ticket.id}
                      className="bg-slate-800 border border-slate-700 rounded-xl p-3.5 space-y-2 hover:border-slate-600 transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          ticket.priority === 'Emergency' ? 'bg-rose-500/20 text-rose-400' :
                          ticket.priority === 'High' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {ticket.priority === 'Emergency' ? 'URGENCE' : ticket.priority}
                        </span>
                        <span className="text-[10px] text-slate-400">{ticket.createdAt}</span>
                      </div>

                      <h4 className="font-bold text-white text-sm">{ticket.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2">{ticket.description}</p>
                      
                      {ticket.imageUrl && (
                        <div className="relative h-28 rounded-lg overflow-hidden border border-slate-700/80 my-1">
                          <img
                            src={ticket.imageUrl}
                            alt={ticket.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <p className="text-[11px] text-emerald-400 font-medium truncate">{property?.title}</p>

                      {ticket.contractorName && (
                        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                          <span>Artisan: <strong className="text-slate-200">{ticket.contractorName}</strong></span>
                          {ticket.estimatedCost && <span className="text-amber-400 font-bold">{ticket.estimatedCost} €</span>}
                        </div>
                      )}

                      {/* Status Selector */}
                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Statut :</span>
                        <select
                          value={ticket.status}
                          onChange={(e) => onUpdateTicketStatus(ticket.id, e.target.value as MaintenanceStatus)}
                          className="bg-slate-900 text-slate-200 text-[10px] font-bold px-2 py-1 rounded border border-slate-700"
                        >
                          <option value="New">Nouvelle</option>
                          <option value="In_Progress">En cours</option>
                          <option value="Scheduled">Planifiée</option>
                          <option value="Resolved">Résolue</option>
                        </select>
                      </div>

                    </div>
                  );
                })}

                {colTickets.length === 0 && (
                  <p className="text-center py-8 text-xs text-slate-600 italic">Aucun ticket dans cette catégorie.</p>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* New Maintenance Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Nouvelle Intervention de Maintenance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Bien Concerné *</label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Titre du Problème / Travaux *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Fuite robinet, problème chaudière"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Urgence</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                  >
                    <option value="Low">Faible</option>
                    <option value="Medium">Moyenne</option>
                    <option value="High">Haute</option>
                    <option value="Emergency">Urgence Absolue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Coût Estimé (€)</label>
                  <input
                    type="number"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs p-2.5 rounded-lg border border-slate-700"
                />
              </div>

              {/* Photo attachment from local device */}
              <div>
                <label className="block text-xs text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Photo / Justificatif Visuel</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Depuis votre appareil</span>
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleTicketFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-800/60 p-2.5 rounded-lg text-center cursor-pointer transition-colors flex items-center justify-between"
                >
                  {formData.imageUrl ? (
                    <div className="flex items-center space-x-2.5 w-full">
                      <img
                        src={formData.imageUrl}
                        alt="Photo jointe"
                        className="w-10 h-10 object-cover rounded-md border border-slate-700 flex-shrink-0"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <span className="text-xs text-emerald-400 font-bold block">Photo locale jointe ✓</span>
                        <span className="text-[10px] text-slate-400 block truncate">Cliquer pour remplacer</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((prev) => ({ ...prev, imageUrl: undefined }));
                        }}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 w-full text-slate-400 py-1">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-slate-300">Importer une photo (PC / Mobile)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Artisan / Prestataire</label>
                  <input
                    type="text"
                    placeholder="Plomberie Express"
                    value={formData.contractorName}
                    onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Téléphone Artisan</label>
                  <input
                    type="text"
                    placeholder="+33 1 23 45 67 89"
                    value={formData.contractorPhone}
                    onChange={(e) => setFormData({ ...formData, contractorPhone: e.target.value })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Créer le Ticket
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
