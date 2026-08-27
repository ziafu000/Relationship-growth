#!/usr/bin/env node
/**
 * Cross-platform migration helper script
 * Works on Windows, Mac, and Linux
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(color + message + colors.reset);
}

function execCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function main() {
  log('\n🚀 Supabase Migration Helper', colors.cyan + colors.bright);
  log('==============================\n', colors.cyan);

  // Check if Supabase CLI is installed
  try {
    const version = execCommand('supabase --version').trim();
    log(`✅ Supabase CLI found (${version})`, colors.green);
  } catch (error) {
    log('❌ Supabase CLI not found!', colors.red);
    log('Install: npm install -g supabase\n', colors.yellow);
    process.exit(1);
  }

  console.log('');

  // Check if project is linked
  const projectRefPath = path.join(process.cwd(), '.supabase', 'project-ref');
  if (!fs.existsSync(projectRefPath)) {
    log('⚠️  Project not linked yet!', colors.yellow);
    console.log('');
    log('Please run:', colors.cyan);
    log('  npm run supabase:link', colors.bright);
    log('  (Or: supabase link --project-ref aqrykpomzxumiwgorydn --token YOUR_TOKEN)', colors.bright);
    console.log('');
    log('Get token from: https://supabase.com/dashboard', colors.cyan);
    log('(Account Settings → Access Tokens)\n', colors.cyan);
    process.exit(1);
  }

  const projectRef = fs.readFileSync(projectRefPath, 'utf8').trim();
  log(`✅ Project linked: ${projectRef}`, colors.green);
  console.log('');

  // Check migrations directory
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    log('❌ Migrations directory not found!', colors.red);
    process.exit(1);
  }

  const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  log(`📋 Found ${migrationFiles.length} migration files`, colors.cyan);
  console.log('');

  // Show critical migrations
  log('⚠️  CRITICAL MIGRATIONS TO APPLY:', colors.yellow);
  log('  - 009_fix_recursive_policy.sql (Fix infinite recursion)');
  log('  - 010_auto_create_public_user.sql (Auto-create users)');
  console.log('');

  // Prompt user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Do you want to push all migrations? (y/n) ', async (answer) => {
    rl.close();

    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('');
      log('🚀 Pushing migrations to remote database...', colors.cyan);
      console.log('');

      try {
        const output = execCommand('supabase db push');
        console.log(output);

        console.log('');
        log('✅ Migrations applied successfully!', colors.green);
        console.log('');

        // Verify critical migrations
        log('🔍 Verifying critical migrations...', colors.cyan);
        console.log('');

        log('Checking RLS policies...');
        try {
          const policies = execCommand('supabase db query "SELECT policyname FROM pg_policies WHERE tablename = \'relationship_members\';"');
          console.log(policies);
        } catch (e) {
          log('  ⚠️ Could not verify policies', colors.yellow);
        }

        console.log('');
        log('Checking user trigger...');
        try {
          const triggers = execCommand('supabase db query "SELECT tgname FROM pg_trigger WHERE tgname = \'on_auth_user_created\';"');
          console.log(triggers);
        } catch (e) {
          log('  ⚠️ Could not verify trigger', colors.yellow);
        }

        console.log('');
        log('✅ All done! Your database is up to date.', colors.green);
      } catch (error) {
        console.log('');
        log('❌ Error applying migrations:', colors.red);
        console.error(error.message);
        console.log('');
        log('Try manual application:', colors.yellow);
        log('  1. Go to Supabase Dashboard → SQL Editor');
        log('  2. Copy content from migration files');
        log('  3. Run each migration');
      }
    } else {
      console.log('');
      log('❌ Migration cancelled', colors.yellow);
      console.log('');
      log('To apply migrations manually:', colors.cyan);
      log('  1. Go to Supabase Dashboard → SQL Editor');
      log('  2. Copy content from migration files');
      log('  3. Run each migration');
    }

    console.log('');
    log('📚 For more info, see: SUPABASE_CLI_SETUP.md', colors.cyan);
  });
}

main().catch(error => {
  log('\n❌ Error:', colors.red);
  console.error(error);
  process.exit(1);
});
