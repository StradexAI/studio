#!/bin/bash

echo "🧹 Cleaning up existing user and starting fresh..."

cat << 'SQL' | psql "$DATABASE_URL" || echo "Note: If psql isn't available, run these commands manually"
-- Delete the existing user (this will cascade delete related records)
DELETE FROM "accounts" WHERE "userId" IN (SELECT id FROM "users" WHERE email = 'michelle@stradexai.com');
DELETE FROM "sessions" WHERE "userId" IN (SELECT id FROM "users" WHERE email = 'michelle@stradexai.com');
DELETE FROM "projects" WHERE "consultantId" IN (SELECT id FROM "users" WHERE email = 'michelle@stradexai.com');
DELETE FROM "users" WHERE email = 'michelle@stradexai.com';

-- Verify deletion
SELECT email, role FROM "users";
SQL

echo "✅ Cleanup complete! You can now sign in with Google and it will create a fresh user."
