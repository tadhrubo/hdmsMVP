-- ============================================================
-- HDMS MVP — Migration: Land Owners Rich Personal Details
-- ============================================================

alter table land_owners 
  add column if not exists nid text,
  add column if not exists email text,
  add column if not exists address text;
