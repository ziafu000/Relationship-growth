// Test script for Resend email integration
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Verify API key is loaded
if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY not found in .env.local');
  console.error('   Please add your API key to .env.local:');
  console.error('   RESEND_API_KEY=re_your_api_key_here\n');
  process.exit(1);
}

console.log('✅ API key loaded from .env.local\n');

import { sendConfirmationEmail, sendPasswordResetEmail } from '../lib/email/resend';

async function testEmails() {
  console.log('🧪 Testing Resend Email Integration...\n');

  // Test 1: Confirmation Email
  console.log('📧 Test 1: Sending confirmation email...');
  try {
    const confirmResult = await sendConfirmationEmail(
      'test@example.com',
      'http://localhost:3000/auth/confirm?token=test-token-123',
      'Test User'
    );

    if (confirmResult.success) {
      console.log('✅ Confirmation email sent successfully!');
      console.log('   Email ID:', confirmResult.data?.id);
    } else {
      console.log('❌ Failed to send confirmation email');
      console.error('   Error:', confirmResult.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error);
  }

  console.log('');

  // Test 2: Password Reset Email
  console.log('📧 Test 2: Sending password reset email...');
  try {
    const resetResult = await sendPasswordResetEmail(
      'test@example.com',
      'http://localhost:3000/auth/reset?token=reset-token-456',
      'Test User'
    );

    if (resetResult.success) {
      console.log('✅ Password reset email sent successfully!');
      console.log('   Email ID:', resetResult.data?.id);
    } else {
      console.log('❌ Failed to send password reset email');
      console.error('   Error:', resetResult.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error);
  }

  console.log('\n✨ Test complete! Check your Resend dashboard for delivery status.');
  console.log('🌐 Dashboard: https://resend.com/emails\n');
}

testEmails().catch(console.error);
