
export enum AppointmentStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  staff: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  unit: string;
  price: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  originalPrice: number;
  gstRate: number; // Percentage
  type?: 'service' | 'product' | 'package' | 'misc';
}

export interface Package {
  id: string;
  name: string;
  services: string[];
  totalPrice: number;
  validityDays: number;
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'SMS' | 'Email';
  status: 'Draft' | 'Scheduled' | 'Sent';
  scheduledDate: string;
  recipientCount: number;
  openRate?: number; // percentage 0-100
  clickRate?: number; // percentage 0-100
  conversionRate?: number; // percentage 0-100
}

export interface SegmentCriteria {
  minSpend?: number;
  minVisits?: number;
  lastCheckInDays?: number;
}

export interface Segment {
  id: string;
  name: string;
  criteria: string;
  memberCount: number;
  rules?: SegmentCriteria;
  icon?: any;
}
