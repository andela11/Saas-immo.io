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
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';

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
  saveAllUserDocs,
  deleteUserDoc,
  User,
} from './lib/firebase';

export default function App() {
  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudSyncReady, setIsCloudSyncReady] = useState(false);

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

  // Listen to Firebase Auth state & sync initial data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsCloudSyncReady(false);
        // Sync & Fetch User Firestore Profile
        const dbProfile = await syncUserProfile(user);
        if (dbProfile) {
          setProfile((prev) => ({
            ...prev,
            ...dbProfile,
            name: dbProfile.name || user.displayName || prev.name,
            email: dbProfile.email || user.email || prev.email,
          }));
        } else {
          saveUserDoc('users', user.uid, profile, user.uid);
        }

        // Fetch properties
        const cloudProps = await fetchUserData<Property>('properties', user.uid);
        if (cloudProps.length > 0) {
          setProperties(cloudProps);
        } else if (properties.length > 0) {
          saveAllUserDocs('properties', properties, user.uid);
        }

        // Fetch tenants
        const cloudTenants = await fetchUserData<Tenant>('tenants', user.uid);
        if (cloudTenants.length > 0) {
          setTenants(cloudTenants);
        } else if (tenants.length > 0) {
          saveAllUserDocs('tenants', tenants, user.uid);
        }

        // Fetch payments
        const cloudPayments = await fetchUserData<PaymentRecord>('payments', user.uid);
        if (cloudPayments.length > 0) {
          setPayments(cloudPayments);
        } else if (payments.length > 0) {
          saveAllUserDocs('payments', payments, user.uid);
        }

        // Fetch maintenance tickets
        const cloudTickets = await fetchUserData<MaintenanceTicket>('maintenanceTickets', user.uid);
        if (cloudTickets.length > 0) {
          setMaintenanceTickets(cloudTickets);
        } else if (maintenanceTickets.length > 0) {
          saveAllUserDocs('maintenanceTickets', maintenanceTickets, user.uid);
        }

        // Fetch transactions
        const cloudTxs = await fetchUserData<FinancialTransaction>('transactions', user.uid);
        if (cloudTxs.length > 0) {
          setTransactions(cloudTxs);
        } else if (transactions.length > 0) {
          saveAllUserDocs('transactions', transactions, user.uid);
        }

        setIsCloudSyncReady(true);
      } else {
        setIsCloudSyncReady(false);
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
      setActiveTabState('landing');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const [activeTab, setActiveTabState] = useState<ActiveTab>('landing');
  const [tabHistory, setTabHistory] = useState<ActiveTab[]>(['landing']);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleNavigate = (newTab: ActiveTab) => {
    setTabHistory((prev) => [...prev, newTab]);
    setActiveTabState(newTab);
  };

  const handleBack = () => {
    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop();
      setTabHistory(newHistory);
      setActiveTabState(newHistory[newHistory.length - 1]);
    } else {
      setActiveTabState('landing');
    }
  };

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const setActiveTab = (tab: ActiveTab) => {
    handleNavigate(tab);
  };

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
    if (currentUser && isCloudSyncReady) {
      saveUserDoc('users', currentUser.uid, profile, currentUser.uid);
    }
  }, [profile, currentUser, isCloudSyncReady]);

  useEffect(() => {
    localStorage.setItem('immogestion_properties', JSON.stringify(properties));
    if (currentUser && isCloudSyncReady) {
      saveAllUserDocs('properties', properties, currentUser.uid);
    }
  }, [properties, currentUser, isCloudSyncReady]);

  useEffect(() => {
    localStorage.setItem('immogestion_tenants', JSON.stringify(tenants));
    if (currentUser && isCloudSyncReady) {
      saveAllUserDocs('tenants', tenants, currentUser.uid);
    }
  }, [tenants, currentUser, isCloudSyncReady]);

  useEffect(() => {
    localStorage.setItem('immogestion_payments', JSON.stringify(payments));
    if (currentUser && isCloudSyncReady) {
      saveAllUserDocs('payments', payments, currentUser.uid);
    }
  }, [payments, currentUser, isCloudSyncReady]);

  useEffect(() => {
    localStorage.setItem('immogestion_maintenance', JSON.stringify(maintenanceTickets));
    if (currentUser && isCloudSyncReady) {
      saveAllUserDocs('maintenanceTickets', maintenanceTickets, currentUser.uid);
    }
  }, [maintenanceTickets, currentUser, isCloudSyncReady]);

  useEffect(() => {
    localStorage.setItem('immogestion_transactions', JSON.stringify(transactions));
    if (currentUser && isCloudSyncReady) {
      saveAllUserDocs('transactions', transactions, currentUser.uid);
    }
  }, [transactions, currentUser, isCloudSyncReady]);

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
    let updatedPayment: PaymentRecord | undefined;
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          updatedPayment = {
            ...p,
            status: newStatus,
            paidDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : undefined,
          };
          return updatedPayment;
        }
        return p;
      })
    );
    if (currentUser && updatedPayment) {
      saveUserDoc('payments', paymentId, updatedPayment, currentUser.uid);
    }
  };

  const handleAddTransaction = (newTx: FinancialTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);
    if (currentUser) {
      saveUserDoc('transactions', newTx.id, newTx, currentUser.uid);
    }
  };

  const handleAddMaintenanceTicket = (newTicket: MaintenanceTicket) => {
    setMaintenanceTickets((prev) => [newTicket, ...prev]);
    if (currentUser) {
      saveUserDoc('maintenanceTickets', newTicket.id, newTicket, currentUser.uid);
    }
  };

  const handleUpdateTicketStatus = (ticketId: string, status: MaintenanceStatus) => {
    let updatedTicket: MaintenanceTicket | undefined;
    setMaintenanceTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          updatedTicket = { ...t, status };
          return updatedTicket;
        }
        return t;
      })
    );
    if (currentUser && updatedTicket) {
      saveUserDoc('maintenanceTickets', ticketId, updatedTicket, currentUser.uid);
    }
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
      if (data.properties) {
        setProperties(data.properties);
        if (currentUser) saveAllUserDocs('properties', data.properties, currentUser.uid);
      }
      if (data.tenants) {
        setTenants(data.tenants);
        if (currentUser) saveAllUserDocs('tenants', data.tenants, currentUser.uid);
      }
      if (data.payments) {
        setPayments(data.payments);
        if (currentUser) saveAllUserDocs('payments', data.payments, currentUser.uid);
      }
      if (data.maintenanceTickets) {
        setMaintenanceTickets(data.maintenanceTickets);
        if (currentUser) saveAllUserDocs('maintenanceTickets', data.maintenanceTickets, currentUser.uid);
      }
      if (data.transactions) {
        setTransactions(data.transactions);
        if (currentUser) saveAllUserDocs('transactions', data.transactions, currentUser.uid);
      }
      if (data.profile) {
        setProfile(data.profile);
        if (currentUser) saveUserDoc('users', currentUser.uid, data.profile, currentUser.uid);
      }
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
          onEnterApp={(targetTab) => handleNavigate(targetTab || 'dashboard')}
          onOpenAuthModal={handleOpenAuthModal}
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          properties={properties}
          onAddCandidateApplication={(candidate) => {
            alert(`✓ Candidature reçue pour ${candidate.propertyTitle} !\nNom : ${candidate.name}\nEmail : ${candidate.email}\nRevenus : ${candidate.incomeMonthly} €/mois`);
          }}
        />

        {/* Global Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={(demo) => {
            if (demo) {
              handleNavigate('dashboard');
            } else {
              handleNavigate('dashboard');
            }
          }}
        />

        {/* Global Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          profile={profile}
          onUpdateProfile={(updated) => {
            setProfile(updated);
            if (currentUser) {
              saveUserDoc('users', currentUser.uid, updated, currentUser.uid);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden w-full max-w-full">
      
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
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
        onBackToLanding={() => handleNavigate('landing')}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-4 sm:gap-6 min-w-0">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unpaidCount={unpaidCount}
          openMaintenanceCount={openMaintenanceCount}
          onBackToLanding={() => handleNavigate('landing')}
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
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
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
          onUpdateProperty={(updatedProp) => {
            handleSaveProperty(updatedProp);
            setSelectedProperty(updatedProp);
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

      {/* 4. Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={(demo) => {
          if (demo) {
            handleNavigate('dashboard');
          } else {
            handleNavigate('dashboard');
          }
        }}
      />

      {/* 5. Global Payment & Subscription Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => {
          setProfile(updated);
          if (currentUser) {
            saveUserDoc('users', currentUser.uid, updated, currentUser.uid);
          }
        }}
      />

    </div>
  );
}
