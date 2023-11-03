#!/usr/bin/bash

source .env

echo $VITE_INSTANCE_ADDRESS
echo $VITE_ADMIN_EMAIL
echo $VITE_ADMIN_PASSWORD

npx pocketbase-typegen --url $VITE_INSTANCE_ADDRESS --email $VITE_ADMIN_EMAIL --password $VITE_ADMIN_PASSWORD --out src/types/pocketbase-types.ts