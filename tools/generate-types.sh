#!/usr/bin/bash

source .env

echo $INSTANCE_ADDRESS
echo $ADMIN_EMAIL
echo $ADMIN_PASSWORD

npx pocketbase-typegen --url $INSTANCE_ADDRESS --email $ADMIN_EMAIL --password $ADMIN_PASSWORD --out src/types/pocketbase-types.ts