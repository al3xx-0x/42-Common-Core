#!/bin/sh

# Start Vault in dev mode in the background
vault server -dev \
  -dev-root-token-id=myroottoken \
  -dev-listen-address=0.0.0.0:8200 &

VAULT_PID=$!

# Wait for Vault to be ready
echo "⏳ Waiting for Vault to start..."
export VAULT_ADDR='http://0.0.0.0:8200'
export VAULT_TOKEN='myroottoken'

# Wait until Vault is actually ready
until vault status > /dev/null 2>&1; do
  echo "Waiting for Vault..."
  sleep 1
done

echo "✅ Vault is ready!"

# Enable KV secrets engine (ignore error if already enabled)
echo "🔧 Enabling KV secrets engine..."
vault secrets enable -path=secret kv-v2 2>/dev/null || echo "KV engine already enabled"

# Put the secrets
echo "🔐 Storing secrets in Vault..."
vault kv put secret/myapp/env

echo "✅ Vault initialized with secrets!"

# Keep the container running (wait for Vault process)
wait $VAULT_PID
