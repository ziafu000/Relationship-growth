#!/bin/bash
# Supabase Migration Helper Script
# Usage: ./apply-migrations.sh

set -e

echo "🚀 Supabase Migration Helper"
echo "=============================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "Install: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found ($(supabase --version))"
echo ""

# Check if project is linked
if [ ! -f ".supabase/project-ref" ]; then
    echo "⚠️  Project not linked yet!"
    echo ""
    echo "Please run:"
    echo "  supabase link --project-ref aqrykpomzxumiwgorydn --token YOUR_TOKEN"
    echo ""
    echo "Get token from: https://supabase.com/dashboard (Account Settings → Access Tokens)"
    exit 1
fi

PROJECT_REF=$(cat .supabase/project-ref)
echo "✅ Project linked: $PROJECT_REF"
echo ""

# List pending migrations
echo "📋 Checking migrations..."
echo ""

MIGRATIONS_DIR="supabase/migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "❌ Migrations directory not found!"
    exit 1
fi

# Count migration files
MIGRATION_COUNT=$(ls -1 $MIGRATIONS_DIR/*.sql 2>/dev/null | wc -l)
echo "Found $MIGRATION_COUNT migration files"
echo ""

# Show critical migrations that need attention
echo "⚠️  CRITICAL MIGRATIONS TO APPLY:"
echo "  - 009_fix_recursive_policy.sql (Fix infinite recursion)"
echo "  - 010_auto_create_public_user.sql (Auto-create users)"
echo ""

# Prompt user
read -p "Do you want to push all migrations? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Pushing migrations to remote database..."
    echo ""

    # Push migrations
    supabase db push

    echo ""
    echo "✅ Migrations applied successfully!"
    echo ""

    # Verify critical migrations
    echo "🔍 Verifying critical migrations..."
    echo ""

    echo "Checking RLS policies..."
    supabase db query "SELECT policyname FROM pg_policies WHERE tablename = 'relationship_members';" || true

    echo ""
    echo "Checking user trigger..."
    supabase db query "SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';" || true

    echo ""
    echo "✅ All done! Your database is up to date."
else
    echo ""
    echo "❌ Migration cancelled"
    echo ""
    echo "To apply migrations manually:"
    echo "  1. Go to Supabase Dashboard → SQL Editor"
    echo "  2. Copy content from migration files"
    echo "  3. Run each migration"
fi

echo ""
echo "📚 For more info, see: SUPABASE_CLI_SETUP.md"
