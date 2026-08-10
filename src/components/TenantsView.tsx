import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  Building2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Sparkles,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { Tenant, Property } from '../types';

interface TenantsViewProps {
  tenants: Tenant[];
  properties: Property[];
  onAddTenant: (tenant: Tenant) => void;
  onEditTenant: (tenant: Tenant) => void;
  onDeleteTenant: (tenantId: string) => void;
  onOpenQuittanceModal: () => void;
  onOpenAiForTenant: (tenant: Tenant) => void;
}

export const TenantsView: React.FC<TenantsViewProps> = ({
  tenants,
  properties,
  onAddTenant,
  onEditTenant,
  onDeleteTenant,
  onOpenQuittanceModal,
  onOpenAiForTenant,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const [formData, setFormData] = useState<Partial<Tenant>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyId: properties[0]?.id || '',
    leaseStart: '2024-01-01',
    leaseEnd: '2027-01-01',
    rentAmount: 850,
    chargesAmount: 70,
    depositAmount: 1700,
    paymentStatus: 'Paid',
    reliabilityScore: 95,
    jobTitle: '',
  });

  const filteredTenants = tenants.filter(
    (t) =>
      t.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingTenant(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      propertyId: properties[0]?.id || '',
      leaseStart: '2024-01-01',
      leaseEnd: '2027-01-01',
      rentAmount: 850,
      chargesAmount: 70,
      depositAmount: 1700,
      paymentStatus: 'Paid',
      reliabilityScore: 95,
      jobTitle: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData(tenant);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.propertyId) return;

    const finalTenant: Tenant = {
      id: editingTenant ? editingTenant.id : `ten-${Date.now()}`,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      propertyId: formData.propertyId || properties[0]?.id || '',
      leaseStart: formData.leaseStart || '2024-01-01',
      leaseEnd: formData.leaseEnd || '2027-01-01',
      rentAmount: Number(formData.rentAmount) || 0,
      chargesAmount: Number(formData.chargesAmount) || 0,
      depositAmount: Number(formData.depositAmount) || 0,
      paymentStatus: formData.paymentStatus || 'Paid',
      reliabilityScore: Number(formData.reliabilityScore) || 90,
      jobTitle: formData.jobTitle,
      incomeMonthly: Number(formData.incomeMonthly) || 0,
      guarantorName: formData.guarantorName,
    };

    if (editingTenant) {
      onEditTenant(finalTenant);
    } else {
      onAddTenant(finalTenant);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Gestion des Locataires ({tenants.length})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Suivi des baux de location, coordonnées, scoring de ponctualité et quittances.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Locataire</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un locataire par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar max-w-full">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Locataire</th>
                <th className="py-3.5 px-4">Bien Loué</th>
                <th className="py-3.5 px-4">Loyer Mensuel</th>
                <th className="py-3.5 px-4">Période du Bail</th>
                <th className="py-3.5 px-4">Statut Paiement</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTenants.map((tenant) => {
                const property = properties.find((p) => p.id === tenant.propertyId);

                return (
                  <tr key={tenant.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Tenant Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center border border-slate-700">
                          {tenant.firstName[0]}{tenant.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{tenant.firstName} {tenant.lastName}</p>
                          <p className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span>{tenant.email}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-slate-500" />
                              <span>{tenant.phone}</span>
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Linked Property */}
                    <td className="py-4 px-4 font-medium text-slate-200">
                      {property ? (
                        <div>
                          <p className="font-semibold text-slate-100 truncate max-w-[200px]">{property.title}</p>
                          <p className="text-[11px] text-slate-400">{property.city}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Bien supprimé</span>
                      )}
                    </td>

                    {/* Rent */}
                    <td className="py-4 px-4 font-extrabold text-emerald-400 text-sm">
                      {(tenant.rentAmount + tenant.chargesAmount).toLocaleString('fr-FR')} € <span className="text-[10px] text-slate-400 font-normal">/ mo CC</span>
                    </td>

                    {/* Lease Dates */}
                    <td className="py-4 px-4 text-slate-300">
                      <div className="flex items-center space-x-1.5 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Du {tenant.leaseStart} au {tenant.leaseEnd}</span>
                      </div>
                    </td>

                    {/* Payment Status & Scoring */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          tenant.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {tenant.paymentStatus === 'Paid' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>À Jour</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              <span>En Retard</span>
                            </>
                          )}
                        </span>
                        
                        <p className="text-[10px] text-slate-400">
                          Fiabilité : <span className="font-bold text-slate-200">{tenant.reliabilityScore}%</span>
                        </p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right space-x-2">
                      
                      <button
                        onClick={onOpenQuittanceModal}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                        title="Émettre la quittance"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenAiForTenant(tenant)}
                        className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
                        title="Générer un courrier IA pour ce locataire"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(tenant)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteTenant(tenant.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Tenant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base">
                {editingTenant ? 'Modifier le Locataire' : 'Nouveau Locataire'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Téléphone *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Bien Attribué *</label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Début du Bail</label>
                  <input
                    type="date"
                    value={formData.leaseStart}
                    onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Fin du Bail</label>
                  <input
                    type="date"
                    value={formData.leaseEnd}
                    onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Loyer HC (€)</label>
                  <input
                    type="number"
                    value={formData.rentAmount}
                    onChange={(e) => setFormData({ ...formData, rentAmount: Number(e.target.value) })}
                    className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Dépôt de Garantie (€)</label>
                  <input
                    type="number"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
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
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Enregistrer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
