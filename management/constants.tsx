
import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Package,
  Bell,
  Smile,
  ClipboardList,
  BarChart3,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard />, path: '/app' },
  { id: 'customers', label: 'Customers', icon: <Users />, path: '/app/customers' },
  { id: 'appointments', label: 'Appointments', icon: <Calendar />, path: '/app/appointments' },
  { id: 'invoices', label: 'Invoices', icon: <FileText />, path: '/app/billing' },
  { id: 'memberships', label: 'Memberships', icon: <CreditCard />, path: '/app/memberships' },
  { id: 'packages', label: 'Packages', icon: <Package />, path: '/app/packages' },
  { id: 'campaigns', label: 'Campaigns', icon: <Bell />, path: '/app/marketing' },
  { id: 'cxm', label: 'Experience', icon: <Smile />, path: '/app/cxm' },
  { id: 'inventory', label: 'Inventory', icon: <ClipboardList />, path: '/app/inventory' },
  { id: 'reports', label: 'Reports', icon: <BarChart3 />, path: '/app/reports' },
  { id: 'configuration', label: 'Configuration', icon: <Settings />, path: '/app/settings' },
  { id: 'profile', label: 'Profile', icon: <User />, path: '/app/profile' },
  { id: 'help', label: 'Help', icon: <HelpCircle />, path: '/app/help' },
];

export const GST_RATE = 18;

export const MOCK_SALONS = [
  {
    id: 1,
    name: "The Rosewood Spa",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=1000",
    rating: 4.8,
    reviews: 128,
    distance: "0.8 km",
    location: "Indiranagar",
    tags: ["Spa", "Massage"],
    priceRange: "₹2,000 - ₹8,500",
    discount: "20% OFF"
  },
  {
    id: 2,
    name: "Aura Beauty Lounge",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000",
    rating: 4.5,
    reviews: 85,
    distance: "1.2 km",
    location: "Koramangala",
    tags: ["Hair", "Skin"],
    priceRange: "₹1,500 - ₹5,000",
    discount: ""
  },
  {
    id: 3,
    name: "Luxe Hair & Co.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1000",
    rating: 4.9,
    reviews: 342,
    distance: "2.5 km",
    location: "Domlur",
    tags: ["Hair", "Premium"],
    priceRange: "₹3,000 - ₹12,000",
    discount: ""
  },
  {
    id: 4,
    name: "Velvet Nail Bar",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    reviews: 210,
    distance: "3.0 km",
    location: "MG Road",
    tags: ["Nails", "Art"],
    priceRange: "₹800 - ₹2,500",
    discount: "15% OFF"
  }
];
