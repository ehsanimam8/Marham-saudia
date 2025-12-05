# Marham Saudi - Telemedicine Platform

## Overview
Marham is a telemedicine platform for women in Saudi Arabia, connecting patients with female Saudi doctors.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Internationalization**: i18next (Arabic/English)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file with the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Project Structure
- `/app`: Next.js App Router pages
  - `/(patient)`: Patient portal routes
  - `/(doctor)`: Doctor portal routes
- `/components`: React components
  - `/ui`: Shadcn/UI components
- `/lib`: Utility functions and configurations
- `/public`: Static assets and locales
