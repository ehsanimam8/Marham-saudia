# Supabase Database Setup Guide

## Option 1: Supabase Dashboard (Recommended for MVP)
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Go to the **SQL Editor** (icon looking like a terminal `>_` on the left sidebar).
4. Click **New Query**.
5. Open the file `supabase/migrations/20241204000000_initial_schema.sql` in your local editor.
6. Copy the entire content of the file.
7. Paste it into the SQL Editor in Supabase.
8. Click **Run** (bottom right).

## Option 2: Supabase CLI
1. Install Supabase CLI (if not already installed):
   ```bash
   npm install -g supabase
   ```
2. Login to Supabase:
   ```bash
   npx supabase login
   ```
3. Link your project (get your Reference ID from Project Settings > General):
   ```bash
   npx supabase link --project-ref your-project-ref
   ```
4. Push the migration:
   ```bash
   npx supabase db push
   ```

## Verification
After applying the migration, go to the **Table Editor** in your Supabase Dashboard. You should see the following tables:
- `profiles`
- `doctors`
- `patients`
- `appointments`
- `consultations`
- `reviews`
- `articles`
- `earnings`
- `doctor_schedules`
