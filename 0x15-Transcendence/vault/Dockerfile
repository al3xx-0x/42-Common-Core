FROM hashicorp/vault:1.16

# Copy the entrypoint script
COPY entrypoint.sh /vault/entrypoint.sh

RUN chmod +x /vault/entrypoint.sh

# Use custom entrypoint that starts Vault and initializes secrets
ENTRYPOINT ["/vault/entrypoint.sh"]
