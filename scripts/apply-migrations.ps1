# Supabase Migration Helper Script (Windows PowerShell)
# Usage: .\apply-migrations.ps1

Write-Host "🚀 Supabase Migration Helper" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
try {
    $version = supabase --version
    Write-Host "✅ Supabase CLI found ($version)" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host "Install: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if project is linked
if (-not (Test-Path ".supabase/project-ref")) {
    Write-Host "⚠️  Project not linked yet!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please run:" -ForegroundColor Cyan
    Write-Host '  $env:SUPABASE_ACCESS_TOKEN="YOUR_TOKEN"' -ForegroundColor White
    Write-Host "  supabase link --project-ref aqrykpomzxumiwgorydn" -ForegroundColor White
    Write-Host ""
    Write-Host "Get token from: https://supabase.com/dashboard (Account Settings → Access Tokens)" -ForegroundColor Cyan
    exit 1
}

$projectRef = Get-Content ".supabase/project-ref"
Write-Host "✅ Project linked: $projectRef" -ForegroundColor Green
Write-Host ""

# List pending migrations
Write-Host "📋 Checking migrations..." -ForegroundColor Cyan
Write-Host ""

$migrationsDir = "supabase/migrations"

if (-not (Test-Path $migrationsDir)) {
    Write-Host "❌ Migrations directory not found!" -ForegroundColor Red
    exit 1
}

# Count migration files
$migrationCount = (Get-ChildItem -Path $migrationsDir -Filter "*.sql").Count
Write-Host "Found $migrationCount migration files" -ForegroundColor White
Write-Host ""

# Show critical migrations
Write-Host "⚠️  CRITICAL MIGRATIONS TO APPLY:" -ForegroundColor Yellow
Write-Host "  - 009_fix_recursive_policy.sql (Fix infinite recursion)" -ForegroundColor White
Write-Host "  - 010_auto_create_public_user.sql (Auto-create users)" -ForegroundColor White
Write-Host ""

# Prompt user
$response = Read-Host "Do you want to push all migrations? (y/n)"

if ($response -match "^[Yy]$") {
    Write-Host ""
    Write-Host "🚀 Pushing migrations to remote database..." -ForegroundColor Cyan
    Write-Host ""

    # Push migrations
    try {
        supabase db push

        Write-Host ""
        Write-Host "✅ Migrations applied successfully!" -ForegroundColor Green
        Write-Host ""

        # Verify critical migrations
        Write-Host "🔍 Verifying critical migrations..." -ForegroundColor Cyan
        Write-Host ""

        Write-Host "Checking RLS policies..." -ForegroundColor White
        supabase db query "SELECT policyname FROM pg_policies WHERE tablename = 'relationship_members';"

        Write-Host ""
        Write-Host "Checking user trigger..." -ForegroundColor White
        supabase db query "SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';"

        Write-Host ""
        Write-Host "✅ All done! Your database is up to date." -ForegroundColor Green
    } catch {
        Write-Host ""
        Write-Host "❌ Error applying migrations: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Try manual application:" -ForegroundColor Yellow
        Write-Host "  1. Go to Supabase Dashboard → SQL Editor" -ForegroundColor White
        Write-Host "  2. Copy content from migration files" -ForegroundColor White
        Write-Host "  3. Run each migration" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "❌ Migration cancelled" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To apply migrations manually:" -ForegroundColor Cyan
    Write-Host "  1. Go to Supabase Dashboard → SQL Editor" -ForegroundColor White
    Write-Host "  2. Copy content from migration files" -ForegroundColor White
    Write-Host "  3. Run each migration" -ForegroundColor White
}

Write-Host ""
Write-Host "📚 For more info, see: SUPABASE_CLI_SETUP.md" -ForegroundColor Cyan
