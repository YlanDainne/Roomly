# Database Migrations

This directory contains SQL migration files for Roomly's PostgreSQL database hosted on Supabase.

## Files

### `01_initial_schema.sql`
Initial database schema with all necessary tables, indexes, and security policies.

**Tables Created:**
- `users` - User accounts and profiles
- `listings` - Rental property listings
- `listing_images` - Image references for listings
- `saved_homes` - User bookmarks/saved listings
- `user_preferences` - User settings and preferences

**Features:**
- Auto-incrementing primary keys
- UUID support for user IDs
- Timestamps with automatic updates
- Indexes for query performance
- Row-level security policies
- Unique constraints to prevent duplicates

## How to Apply Migrations

### Method 1: Supabase Dashboard (Recommended for first-time setup)

1. Go to: https://app.supabase.com/project/klhgcqoypnxkqnrnbesz/sql/new
2. Copy the entire contents of `01_initial_schema.sql`
3. Paste into the SQL editor
4. Click **Run**

### Method 2: CLI (if you have Supabase CLI installed)

```bash
supabase db push --password <your-db-password>
```

### Method 3: psql Command Line

```bash
psql -h db.klhgcqoypnxkqnrnbesz.supabase.co \
     -U postgres \
     -d postgres \
     -f 01_initial_schema.sql \
     -W  # will prompt for password: Cute.kaayoko1
```

## Verification

After running migrations, verify in Supabase Dashboard:

1. Go to **Databases** → **Tables**
2. You should see these 5 tables:
   - `users`
   - `listings`
   - `listing_images`
   - `saved_homes`
   - `user_preferences`

## Future Migrations

For additional schema changes, create new files following the naming convention:
- `02_add_reviews_table.sql`
- `03_add_notifications_table.sql`
- etc.

Then apply them using the methods above.

## Rollback

If you need to drop all tables and start over:

```sql
-- WARNING: This deletes all data!
DROP TABLE IF EXISTS saved_homes CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS listing_images CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Then re-run `01_initial_schema.sql`.
