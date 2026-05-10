# 🚀 Quick Start: Get Your Supabase API Keys

Your Supabase project is ready! Now get the API keys to complete the backend setup.

## 1. Go to Supabase Dashboard

Visit: https://app.supabase.com/project/klhgcqoypnxkqnrnbesz/settings/api

## 2. Copy Your Keys

From the **Project API keys** section, copy these two:

### Anon Key (Public)
- Label: "anon public"
- Starts with: `eyJ...`
- Purpose: Public API access (read listings, etc.)

### Service Role Key
- Label: "service_role secret"  
- Starts with: `eyJ...` (different from Anon)
- Purpose: Backend storage operations (write images, etc.)

## 3. Copy Your JWT Secret

From the **JWT Settings** section above, copy:
- Label: "JWT Secret"
- Used for: Validating authentication tokens

## 4. Update `.env.local`

Edit `roomly/.env.local` and replace:

```bash
SUPABASE_API_KEY=<paste-anon-key>
SUPABASE_STORAGE_API_KEY=<paste-service-role-key>
JWT_SECRET=<paste-jwt-secret>
```

## 5. Create Database Schema

1. Go to: https://app.supabase.com/project/klhgcqoypnxkqnrnbesz/sql/new
2. Copy entire content from: `roomly/database/01_initial_schema.sql`
3. Paste into SQL Editor and click **Run**

## 6. Create Storage Bucket

1. Go to: https://app.supabase.com/project/klhgcqoypnxkqnrnbesz/storage/buckets
2. Click **Create a new bucket**
3. Name: `roomly-images`
4. Uncheck "Private bucket" (make it public)
5. Click **Create**

## 7. Run Backend

```bash
cd roomly/backend
set JAVA_HOME=C:\Users\Matebook D14 BE\.jdk\jdk-21.0.8
mvn clean spring-boot:run
```

## 8. Test API

```bash
curl http://localhost:8080/api/listings
```

Should return: `[]` (empty or with existing listings)

---

**Full Setup Guide:** See `SUPABASE_SETUP.md` for detailed instructions and troubleshooting.
