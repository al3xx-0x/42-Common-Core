const vault = require('node-vault');

// Vault configuration
const vaultConfig = {
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR || 'http://localhost:8200',
  token: process.env.VAULT_TOKEN,
};

// Create Vault client correctly
const client = vault(vaultConfig);

// Store environment variables from Vault (loaded on startup)
let envVars = {};

// Function to get all env vars from Vault
async function getEnvFromVault() {
  try {
        console.log('Fetching environment variables from Vault...');

        const result = await client.read('secret/data/myapp/env');
        envVars = result.data.data;
        console.log('Successfully loaded environment variables from Vault');
        return envVars;
  } catch (error) {
    console.error('Error fetching from Vault:', error.message);
    return {};
  }
}

module.exports = {getEnvFromVault}