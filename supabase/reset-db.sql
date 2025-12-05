-- Quick Database Reset for Marham Saudi
-- Run this in Supabase SQL Editor to reset and reseed the database

-- Step 1: Drop all tables (this will cascade and remove all data)
DROP TABLE IF EXISTS earnings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_schedules CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 2: Drop all types
DROP TYPE IF EXISTS payout_status CASCADE;
DROP TYPE IF EXISTS article_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS consultation_type CASCADE;
DROP TYPE IF EXISTS appointment_status CASCADE;
DROP TYPE IF EXISTS doctor_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Step 3: Now you can run the migrations in order:
-- 1. First run: 20241204000000_initial_schema.sql
-- 2. Then run: 20241204000001_seed_data.sql

-- This file just cleans up the database.
-- After running this, execute the migration files in the SQL Editor.
