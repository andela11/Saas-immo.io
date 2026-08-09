export type PropertyType = 'Apartment' | 'House' | 'Commercial' | 'Parking' | 'Building';
export type PropertyStatus = 'Occupied' | 'Vacant' | 'Renovation';
export type DPEGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  address: string;
  city: string;
  postalCode: string;
  surface: number; // in m²
  rooms: number;
  bedrooms: number;
  purchasePrice: number;
  monthlyRent: number; // HC (Hors Charges)
  monthlyCharges: number; // Charges mensuelles
  status: PropertyStatus;
  dpe: DPEGrade;
  imageUrl: string;
  lat: number;
  lng: number;
  tenantId?: string;
  notes?: string;
  annualPropertyTax?: number;
  annualInsurance?: number;
  yearBuilt?: number;
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Late' | 'Partial';

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  leaseStart: string; // YYYY-MM-DD
  leaseEnd: string; // YYYY-MM-DD
  rentAmount: number;
  chargesAmount: number;
  depositAmount: number;
  paymentStatus: PaymentStatus;
  reliabilityScore: number; // 0 - 100%
  jobTitle?: string;
  incomeMonthly?: number;
  guarantorName?: string;
}

export interface PaymentRecord {
  id: string;
  tenantId: string;
  propertyId: string;
  month: string; // e.g., "Août 2026"
  dueDate: string;
  paidDate?: string;
  rentAmount: number;
  chargesAmount: number;
  totalAmount: number;
  status: PaymentStatus;
  quittanceGenerated: boolean;
}

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type MaintenanceStatus = 'New' | 'In_Progress' | 'Scheduled' | 'Resolved';
export type MaintenanceCategory = 'Plumbing' | 'Electricity' | 'Heating' | 'Structural' | 'Appliance' | 'Other';

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  tenantId?: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  createdAt: string;
  estimatedCost?: number;
  actualCost?: number;
  contractorName?: string;
  contractorPhone?: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  propertyId: string;
  amount: number;
  category: 'RENT' | 'RENOVATION' | 'TAX' | 'INSURANCE' | 'COPRO_CHARGES' | 'REPAIR' | 'LEGAL' | 'OTHER';
  date: string;
  description: string;
}

export interface LandlordProfile {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  siret?: string;
  address: string;
  bankIban?: string;
  bankBic?: string;
}

export type ActiveTab = 'landing' | 'dashboard' | 'properties' | 'tenants' | 'finances' | 'maintenance' | 'ai_assistant' | 'map' | 'taxes' | 'settings';
