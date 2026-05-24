# ⚡ Quick Start Guide

## 🆕 First Time Setup?

**👉 See [SETUP.md](SETUP.md)** for the complete step-by-step guide including:
- Installing prerequisites (Java, Node.js, Maven)
- Getting Supabase keys
- Creating `.env.local` configuration
- Database migrations
- Troubleshooting

---

## ⚡ Quick Reference (For Existing Developers)

### Prerequisites

- ✅ Java 21, Maven 3.9+, Node.js, Git
- ✅ `.env.local` file with Supabase keys configured
- ✅ Supabase project already set up

---

### Running the Application

**Terminal 1 - Backend:**
```powershell
.\run-backend.ps1
```

**Terminal 2 - Frontend:**
```bash
npm start
```

✅ Access at **http://localhost:3000** and **http://localhost:8080**

---

## 📁 Configuration

Your `.env.local` should have:
- `REACT_APP_SUPABASE_URL` - Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Public API key
- `SUPABASE_DB_URL` - Database connection string
- `SUPABASE_API_KEY` - Backend API key
- `JWT_SECRET` - JWT secret for tokens

See `.env.example` for all required variables.

---

## API Quick Reference

### Admin Endpoints (role='admin' required)
```
GET  /api/admin/listings/pending
PATCH /api/admin/listings/{id}/status
DELETE /api/admin/listings/{id}
```

### User Endpoints
```
GET  /api/users/me
GET  /api/listings
POST /api/listings
```

---

## 🔧 Common Tasks

| Task | Command |
|------|---------|
| Check backend status | `curl http://localhost:8080/health` |
| Restart backend | Stop script (Ctrl+C), run again |
| Restart frontend | Stop (Ctrl+C) in npm terminal, `npm start` |
| View database | `psql -h host -U postgres -d roomly` |

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Database connection error | Check `.env.local` keys are correct |
| "Supabase not configured" | Restart frontend after editing `.env.local` |
| Port in use | Change port in config files |
| Maven/Java not found | Update paths in `run-backend.ps1` |

See [SETUP.md - Troubleshooting](SETUP.md#-troubleshooting) for detailed solutions.

---

## 📚 Full Documentation

- [SETUP.md](SETUP.md) - Complete setup for new developers
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Code structure & architecture
- [ADMIN_QUICK_SETUP.md](ADMIN_QUICK_SETUP.md) - Admin panel guide
- [README.md](README.md) - Project overview

---

## ⭐ Legacy Reference Below

The sections below are the original quick start. Most information is now in [SETUP.md](SETUP.md).

---

## Step 1: Get API Keys (2 minutes)

1. Visit: https://app.supabase.com/project/klhgcqoypnxkqnrnbesz/settings/api

2. Find and copy these three keys:
   - **Anon Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`, different from Anon)
   - **JWT Secret** (looks like a long random string)

---

## Step 2: Update Environment Variables (1 minute)

1. Open: `roomly\.env.local`

2. Replace these three lines:
   ```bash
   SUPABASE_API_KEY=eyJ...  # Replace with Anon Key
   SUPABASE_STORAGE_API_KEY=eyJ...  # Replace with Service Role Key
   JWT_SECRET=your-jwt-secret  # Replace with JWT Secret
   ```

3. Add these frontend auth lines in the same `.env.local` file so the React login and register pages can connect to Supabase:
  ```bash
  REACT_APP_SUPABASE_URL=https://klhgcqoypnxkqnrnbesz.supabase.co
  REACT_APP_SUPABASE_ANON_KEY=eyJ...  # Replace with Anon Key
  REACT_APP_API_BASE_URL=http://localhost:8080/api
  ```

  Important: the React app only reads these variables when it starts, so restart the frontend dev server after saving `.env.local`.

  If you see `Supabase auth is not configured`, it means one of these frontend values is missing or the app was not restarted after editing the file.

4. Save the file

---

## Step 3: Create Database Schema (2 minutes)

1. Visit: https://app.supabase.com/project/klhgcqoypnxkqnrnbesz/sql/new

2. Open file: `roomly\database\01_initial_schema.sql`

3. Copy ALL the SQL code

4. Paste into Supabase SQL editor

5. Click **Run**

✅ Database created!

---

## Step 4: Create Storage Bucket (1 minute)

1. Visit: https://app.supabase.com/project/klhgcqoypnxkqnrnbesz/storage/buckets

2. Click: **Create a new bucket**

3. Name: `roomly-images`

4. Uncheck: **Private bucket** (make it public)

5. Click: **Create**

✅ Storage ready!

---

## Step 5: Run Backend (2 minutes)

Open PowerShell and run:

```powershell
cd "c:\Users\Matebook D14 BE\Desktop\Roomly\roomly"
.\run-backend.ps1
```

✅ Backend running on **http://localhost:8080**

If you prefer to run Maven manually from inside the backend folder, use this equivalent command instead:

```powershell
cd "c:\Users\Matebook D14 BE\Desktop\Roomly\roomly\backend"
& "C:\Users\Matebook D14 BE\.maven\maven-3.9.15\bin\mvn.cmd" spring-boot:run
```

---

## Step 6: Test It Works (1 minute)

Open a new PowerShell window:

```powershell
# Get all listings
curl http://localhost:8080/api/listings

# Get campuses
curl http://localhost:8080/api/campuses

# Get hotspots
curl http://localhost:8080/api/hotspots
```

✅ You should get JSON responses!

---

## Create a Test Listing

```powershell
curl -X POST http://localhost:8080/api/listings `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Cozy Studio",
    "city": "Cebu",
    "neighborhood": "IT Park",
    "university": "UV",
    "price": 5000,
    "beds": 1,
    "baths": 1,
    "sizeSqm": 35.0,
    "description": "Nice room for students"
  }'
```

✅ Listing created in Supabase!

---

## Verify in Supabase Dashboard

1. Go to: https://app.supabase.com/project/klhgcqoypnxkqnrnbesz
2. Click: **Databases** → **listings**
3. You should see your test listing!

---

## 🎉 Done!

Your Roomly backend is now connected to Supabase and running!

### What's Next?

- **React Frontend**: Install `@supabase/supabase-js` and integrate Supabase Auth
- **Images**: Upload images with listings (use multipart form data)
- **Saved Homes**: Requires JWT token from Supabase Auth login

---

## Troubleshooting

### Backend won't start
```
mvn clean compile
```
If compilation fails, check `.env.local` variables are set.

### Login or register says `Supabase auth is not configured`
- Confirm `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are present in `roomly\.env.local`
- Confirm `REACT_APP_API_BASE_URL=http://localhost:8080/api` is present too, or leave it out and use the default runtime value
- Make sure you restarted the React frontend after editing `.env.local`
- Verify the values came from Supabase Project Settings > API, not the backend database keys
- Email confirmation settings do not cause this message; this message means the browser client never initialized

### Database connection fails
- Verify Supabase project isn't paused (check Project Settings)
- Verify `SUPABASE_DB_PASSWORD=Cute.kaayoko1` is correct
- If you see `UnknownHostException` for `db.klhgcqoypnxkqnrnbesz.supabase.co`, open Supabase Dashboard > Project Settings > Database and copy the pooler connection string instead of the direct host.
- Paste that pooler JDBC URL into `SUPABASE_DB_URL` in `.env.local`, then run `.
un-backend.ps1` again.

### "Cannot find listings table"
- Run SQL migration again from Step 3
- Verify table appears in Supabase → Databases → Tables

### Port 8080 already in use
```powershell
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

---

## Useful Commands

```powershell
# Compile only (don't run)
mvn clean compile

# Run with debug output
mvn spring-boot:run -X

# Build production JAR
mvn clean package

# Kill backend
# Ctrl+C in the terminal window
```

---

## Architecture

```
Frontend (React)
    ↓ HTTP + JWT Token
Backend (Spring Boot)
    ↓ JPA Queries
Supabase PostgreSQL
    ↓ Storage API
Supabase Storage (roomly-images bucket)
```

---

**Status: Ready to Go! 🚀**

Questions? Check the detailed guides:
- `SUPABASE_SETUP.md` - Full setup guide
- `DEVELOPER_GUIDE.md` - Architecture overview
- `database/README.md` - Database migration reference
