#!/bin/bash

# Database Reset Script for Marham Saudi
# This script resets the database and applies all migrations including updated seed data

echo "🔄 Resetting Marham Saudi Database..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

# Source the environment variables
source .env.local

echo "📋 Database Reset Steps:"
echo "1. Drop all existing tables"
echo "2. Apply initial schema migration"
echo "3. Apply seed data with doctor profile images"
echo ""

# Instructions for manual reset via Supabase Dashboard
echo "⚠️  MANUAL RESET REQUIRED"
echo ""
echo "Please follow these steps in your Supabase Dashboard:"
echo ""
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Select your project"
echo "3. Navigate to SQL Editor (left sidebar)"
echo "4. Run the following SQL to drop all tables:"
echo ""
echo "   DROP SCHEMA public CASCADE;"
echo "   CREATE SCHEMA public;"
echo "   GRANT ALL ON SCHEMA public TO postgres;"
echo "   GRANT ALL ON SCHEMA public TO public;"
echo ""
echo "5. Then run the schema migration:"
echo "   - Open: supabase/migrations/20241204000000_initial_schema.sql"
echo "   - Copy all content and paste in SQL Editor"
echo "   - Click 'Run'"
echo ""
echo "6. Finally, run the seed data:"
echo "   - Open: supabase/migrations/20241204000001_seed_data.sql"
echo "   - Copy all content and paste in SQL Editor"
echo "   - Click 'Run'"
echo ""
echo "✅ After completing these steps, your database will have:"
echo "   - All tables recreated"
echo "   - 5 doctors with profile images"
echo "   - Sample schedules"
echo ""
