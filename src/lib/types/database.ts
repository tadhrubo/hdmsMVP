// ============================================================
// HDMS MVP — Database Type Definitions
// Auto-aligned with schema_migration.sql
// ============================================================

export type FlatStatus = 'Available' | 'Reserved' | 'Sold' | 'Handed Over'
export type PaymentMethod = 'Cash' | 'Bank' | 'Cheque'
export type ProjectStatus = 'Planning' | 'Under Construction' | 'Completed' | 'On Hold'

export interface Project {
  id: string
  name: string
  location: string
  code: string
  status: ProjectStatus
  budget: number | null
  created_at: string
  updated_at: string
}

export interface Building {
  id: string
  project_id: string
  name: string
  total_floors: number
  created_at: string
  updated_at: string
}

export interface Flat {
  id: string
  building_id: string
  flat_number: string
  size_sqft: number
  price: number
  status: FlatStatus
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  full_name: string
  phone: string
  nid: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  client_id: string
  flat_id: string
  agreement_date: string
  total_price: number
  pdf_url: string | null
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  booking_id: string
  amount: number
  payment_date: string
  method: PaymentMethod
  created_at: string
  updated_at: string
}

// ─── Joined / Enriched types for UI ──────────────────────────
export interface FlatWithBuilding extends Flat {
  buildings: Building & {
    projects: Project
  }
}

export interface BookingWithDetails extends Booking {
  clients: Client
  flats: Flat & {
    buildings: Building & {
      projects: Project
    }
  }
}

export interface PaymentWithBooking extends Payment {
  bookings: BookingWithDetails
}

// ─── Supabase Database Type Map ───────────────────────────────
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
      }
      buildings: {
        Row: Building
        Insert: Omit<Building, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Building, 'id' | 'created_at' | 'updated_at'>>
      }
      flats: {
        Row: Flat
        Insert: Omit<Flat, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Flat, 'id' | 'created_at' | 'updated_at'>>
      }
      clients: {
        Row: Client
        Insert: Omit<Client, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>
      }
      payments: {
        Row: Payment
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Payment, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Enums: {
      flat_status: FlatStatus
      payment_method: PaymentMethod
      project_status: ProjectStatus
    }
  }
}
