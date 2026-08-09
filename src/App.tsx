import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPageView } from './components/LandingPageView';
import { DashboardView } from './components/DashboardView';
import { PropertiesView } from './components/PropertiesView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PropertyFormModal } from './components/PropertyFormModal';
import { TenantsView } from './components/TenantsView';
import { FinancesView } from './components/FinancesView';
import { QuittanceModal } from './components/QuittanceModal';
import { MaintenanceView } from './components/MaintenanceView';
import { AiAssistantView } from './components/AiAssistantView';
import { MapView } from './components/MapView';
import { TaxReportView } from './components/TaxReportView';
import { SettingsView } from './components/SettingsView';

import {
  Property,
  Tenant,
  PaymentRecord,
  MaintenanceTicket,
  FinancialTransaction,
  LandlordProfile,
  ActiveTab,
  MaintenanceStatus,
} from './types';

import {
  initialProfile,
  initialProperties,
  initialTenants,
  initialPayments,
  initialMaintenanceTickets,
  initialTransactions,
} from './data/mockData';

import {
  auth,
  signInWithGoogle,
  logoutUser,
  onAuthStateChanged,
  syncUserProfile,
  fetchUserData,
  saveUserDoc,
  deleteUserDoc,
  User,
} from './lib/firebase';

export default function App() {
  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // LocalStorage State Initialization with Fallbacks
  const [profile, setProfile] = useState<LandlordProfile>(() => {
    const saved = localStorage.getItem('immogestion_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('immogestion_properties');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('immogestion_tenants');
    return saved ? JSON.parse(saved) : initialTenants;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('immogestion_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('immogestion_maintenance');
    return saved ? JSON.parse(saved) : initialMaintenanceTickets;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('immogestion_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync & Fetch User Firestore Data
        const dbProfile = await syncUserProfile(user);
        if (dbProfile) {
          setProfile((prev) => ({
            ...prev,
            name: dbProfile.name || user.displayName || prev.name,
            email: dbProfile.email || user.email || prev.email,
          }));
        }

        const cloudProps = await fetchUserData<Property>('properties', user.uid);
        if (cloudProps.length > 0) setProperties(cloudProps);

        const cloudTenants = await fetchUserData<Tenant>('tenants', user.uid);
        if (cloudTenants.length > 0) setTenants(cloudTenants);

        const cloudPayments = await fetchUserData<PaymentRecord>('payments', user.uid);
        if (cloudPayments.length > 0) setPayments(cloudPayments);

        const cloudTickets = await fetchUserData<MaintenanceTicket>('maintenanceTickets', user.uid);
        if (cloudTickets.length > 0) setMaintenanceTickets(cloudTickets);

        const cloudTxs = await fetchUserData<FinancialTransaction>('transactions', user.uid);
        if (cloudTxs.length > 0) setTransactions(cloudTxs);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignInGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign-in failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);

  const [isQuittanceOpen, setIsQuittanceOpen] = useState(false);
  const [selectedPaymentForQuittance, setSelectedPaymentForQuittance] = useState<PaymentRecord | null>(null);

  const [selectedPropertyForAi, setSelectedPropertyForAi] = useState<Property | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('immogestion_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('immogestion_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('immogestion_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('immogestion_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('immogestion_maintenance', JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem('immogestion_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Handlers
  const handleSaveProperty = (savedProperty: Property) => {
    setProperties((prev) => {
      const exists = prev.some((p) => p.id === savedProperty.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProperty.id ? savedProperty : p));
      } else {
        return [savedProperty, ...prev];
      }
    });
    if (currentUser) {
      saveUserDoc('properties', savedProperty.id, savedProperty, currentUser.uid);
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce bien immobilier ?')) {
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      if (currentUser) {
        deleteUserDoc('properties', propertyId);
      }
    }
  };

  const handleAddTenant = (newTenant: Tenant) => {
    setTenants((prev) => [newTenant, ...prev]);
    if (currentUser) {
      saveUserDoc('tenants', newTenant.id, newTenant, currentUser.uid);
    }
  };

  const handleEditTenant = (updatedTenant: Tenant) => {
    setTenants((prev) => prev.map((t) => (t.id === updatedTenant.id ? updatedTenant : t)));
    if (currentUser) {
      saveUserDoc('tenants', updatedTenant.id, updatedTenant, currentUser.uid);
    }
  };

  const handleDeleteTenant = (tenantId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce locataire ?')) {
      setTenants((prev) => prev.filter((t) => t.id !== tenantId));
      if (currentUser) {
        deleteUserDoc('tenants', tenantId);
      }
    }
  };

  const handleUpdatePaymentStatus = (paymentId: string, newStatus: 'Paid' | 'Late' | 'Pending') => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: newStatus,
              paidDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : undefined,
            }
          : p
      )
    );
  };

  const handleAddTransaction = (newTx: FinancialTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleAddMaintenanceTicket = (newTicket: MaintenanceTicket) => {
    setMaintenanceTickets((prev) => [newTicket, ...prev]);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: MaintenanceStatus) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  const handleOpenQuittance = (payment?: PaymentRecord) => {
    setSelectedPaymentForQuittance(payment || null);
    setIsQuittanceOpen(true);
  };

  const handleOpenAiForProperty = (property: Property) => {
    setSelectedPropertyForAi(property);
    setActiveTab('ai_assistant');
  };

  const handleImportFullStateJson = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.properties) setProperties(data.properties);
      if (data.tenants) setTenants(data.tenants);
      if (data.payments) setPayments(data.payments);
      if (data.maintenanceTickets) setMaintenanceTickets(data.maintenanceTickets);
      if (data.transactions) setTransactions(data.transactions);
      if (data.profile) setProfile(data.profile);
    } catch (err) {
      throw new Error('JSON invalide.');
    }
  };

  const fullStateJson = JSON.stringify(
    { profile, properties, tenants, payments, maintenanceTickets, transactions },
    null,
    2
  );

  const unpaidCount = payments.filter((p) => p.month.includes('Août') && p.status === 'Late').length;
  const openMaintenanceCount = maintenanceTickets.filter((t) => t.status !== 'Resolved').length;

  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
        <LandingPageView
          onEnterApp={(targetTab) => setActiveTab(targetTab || 'dashboard')}
          properties={properties}
          onAddCandidateApplication={(candidate) => {
            alert(`✓ Candidature reçue pour ${candidate.propertyTitle} !\nNom : ${candidate.name}\nEmail : ${candidate.email}\nRevenus : ${candidate.incomeMonthly} €/mois`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddProperty={() => {
          setEditingProperty(null);
          setIsPropertyFormOpen(true);
        }}
        onOpenQuittanceModal={() => handleOpenQuittance()}
        pendingAlertsCount={unpaidCount + openMaintenanceCount}
        currentUser={currentUser}
        onSignInGoogle={handleSignInGoogle}
        onLogout={handleLogout}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unpaidCount={unpaidCount}
          openMaintenanceCount={openMaintenanceCount}
        />

        {/* Dynamic View Panel */}
        <main className="flex-1 min-w-0">
          
          {activeTab === 'dashboard' && (
            <DashboardView
              properties={properties}
              tenants={tenants}
              payments={payments}
              maintenanceTickets={maintenanceTickets}
              setActiveTab={setActiveTab}
              onOpenQuittanceModal={() => handleOpenQuittance()}
              onSelectProperty={(p) => setSelectedProperty(p)}
            />
          )}

          {activeTab === 'properties' && (
            <PropertiesView
              properties={properties}
              tenants={tenants}
              onOpenAddModal={() => {
                setEditingProperty(null);
                setIsPropertyFormOpen(true);
              }}
              onEditProperty={(p) => {
                setEditingProperty(p);
                setIsPropertyFormOpen(true);
              }}
              onDeleteProperty={handleDeleteProperty}
              onSelectProperty={(p) => setSelectedProperty(p)}
              onOpenAiForProperty={handleOpenAiForProperty}
            />
          )}

          {activeTab === 'tenants' && (
            <TenantsView
              tenants={tenants}
              properties={properties}
              onAddTenant={handleAddTenant}
              onEditTenant={handleEditTenant}
              onDeleteTenant={handleDeleteTenant}
              onOpenQuittanceModal={() => handleOpenQuittance()}
              onOpenAiForTenant={() => setActiveTab('ai_assistant')}
            />
          )}

          {activeTab === 'finances' && (
            <FinancesView
              payments={payments}
              transactions={transactions}
              properties={properties}
              tenants={tenants}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
              onAddTransaction={handleAddTransaction}
              onOpenQuittanceModal={handleOpenQuittance}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceView
              tickets={maintenanceTickets}
              properties={properties}
              tenants={tenants}
              onAddTicket={handleAddMaintenanceTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
            />
          )}

          {activeTab === 'ai_assistant' && (
            <AiAssistantView
              properties={properties}
              tenants={tenants}
              profile={profile}
              selectedPropertyForAi={selectedPropertyForAi}
              onUpdateProperty={(updatedProp) => handleSaveProperty(updatedProp)}
            />
          )}

          {activeTab === 'map' && (
            <MapView
              properties={properties}
              tenants={tenants}
              onSelectProperty={(p) => setSelectedProperty(p)}
            />
          )}

          {activeTab === 'taxes' && (
            <TaxReportView
              properties={properties}
              transactions={transactions}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={setProfile}
              fullStateJson={fullStateJson}
              onImportStateJson={handleImportFullStateJson}
            />
          )}

        </main>

      </div>

      {/* Global Modals */}

      {/* 1. Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          tenant={tenants.find((t) => t.id === selectedProperty.tenantId)}
          maintenanceTickets={maintenanceTickets}
          onClose={() => setSelectedProperty(null)}
          onOpenAiAssistant={(p) => {
            setSelectedProperty(null);
            handleOpenAiForProperty(p);
          }}
          onOpenQuittanceModal={() => {
            setSelectedProperty(null);
            handleOpenQuittance();
          }}
        />
      )}

      {/* 2. Property Add / Edit Form Modal */}
      <PropertyFormModal
        propertyToEdit={editingProperty}
        isOpen={isPropertyFormOpen}
        onClose={() => {
          setIsPropertyFormOpen(false);
          setEditingProperty(null);
        }}
        onSave={handleSaveProperty}
      />

      {/* 3. Official Rent Receipt Quittance Modal */}
      <QuittanceModal
        isOpen={isQuittanceOpen}
        onClose={() => setIsQuittanceOpen(false)}
        profile={profile}
        properties={properties}
        tenants={tenants}
        paymentToGenerate={selectedPaymentForQuittance}
      />

    </div>
  );
}
