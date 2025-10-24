export interface Tenant {
  id: string;
  name: string;
  number: string;
  email: string;
  imageUri: string | null;
}

export interface Property {
  id: string;
  name: string; // complex name
  address: string;
  tenantId: string | null; // Reference to tenant
  imageUri: string | null;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  tenantId: string;
  propertyId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  imageUri?: string | null;
}

export interface RentPayment {
  id: string;
  amount: number;
  month: string; // e.g., "2024-01"
  paidAt: string; // ISO date string
  tenantId: string;
  propertyId: string;
  status: 'completed' | 'pending' | 'failed';
}