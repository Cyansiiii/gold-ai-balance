#!/bin/bash

# Generate key to file
node scripts/generate_clean_key.js > private.pem

# Set CONVEX_AUTH_PRIVATE_KEY
echo "Setting CONVEX_AUTH_PRIVATE_KEY..."
npx convex env set CONVEX_AUTH_PRIVATE_KEY "$(cat private.pem)"

# Set JWT_PRIVATE_KEY (as backup/alternative)
echo "Setting JWT_PRIVATE_KEY..."
npx convex env set JWT_PRIVATE_KEY "$(cat private.pem)"

# Clean up
rm private.pem

echo "Done. Keys updated."
