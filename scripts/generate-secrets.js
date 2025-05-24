#!/usr/bin/env node

/**
 * Generate secure random secrets for Railway deployment
 * Run: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function generateSecrets() {
  console.log('🔐 Generated Secure Secrets for Railway Deployment\n');
  console.log('Copy these to your Railway environment variables:\n');
  
  console.log('# Security Secrets');
  console.log(`JWT_SECRET=${generateSecret(64)}`);
  console.log(`JWT_REFRESH_SECRET=${generateSecret(64)}`);
  console.log(`SESSION_SECRET=${generateSecret(64)}`);
  
  console.log('\n# Additional Security');
  console.log(`ENCRYPTION_KEY=${generateSecret(32)}`);
  console.log(`API_KEY_SECRET=${generateSecret(32)}`);
  
  console.log('\n⚠️  Important:');
  console.log('1. Keep these secrets secure and private');
  console.log('2. Never commit them to version control');
  console.log('3. Use Railway\'s Variables tab to set them');
  console.log('4. Generate new secrets for each environment');
  
  console.log('\n🔄 To regenerate secrets, run: node scripts/generate-secrets.js');
}

// Main execution
if (require.main === module) {
  generateSecrets();
}

module.exports = { generateSecret, generateSecrets }; 