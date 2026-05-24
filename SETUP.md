# 🚀 Setup Guide - Run Roomly on Any PC

This guide will get you running Roomly on a fresh PC in 15 minutes.

## Prerequisites

You'll need:
- **Node.js 16+** ([Download](https://nodejs.org/))
- **Java 21** ([Download](https://www.oracle.com/java/technologies/downloads/) or use adoptium)
- **Maven 3.9+** ([Download](https://maven.apache.org/download.cgi))
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** ([Create one here](https://supabase.com/))

## Step 1: Clone & Extract (2 minutes)

```bash
git clone <your-repo-url>
cd roomly
```

---

## Step 2: Get Supabase Keys (3 minutes)

1. Go to: https://app.supabase.com
2. Select your project (ask your team for the project name if you don't have it)
3. Click **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon Key** (public key, safe to share, starts with `eyJ...`)
   - **Service Role Key** (secret key, keep private, starts with `eyJ...`)
   - **JWT Secret** (at the bottom of the API page)

5. Also go to **Settings** → **Database** and copy:
   - **Connection String** - PostgreSQL (starts with `postgresql://`)

---

## Step 3: Create `.env.local` (2 minutes)

1. In the **root** folder of the project, copy `.env.example` → `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase keys:

   ```bash
   # Frontend Configuration
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJ...  # Paste Anon Key here
   REACT_APP_API_BASE_URL=http://localhost:8080/api

   # Backend Configuration
   SUPABASE_DB_URL=jdbc:postgresql://your-host:5432/postgres?sslmode=require
   SUPABASE_DB_USER=postgres
   SUPABASE_DB_PASSWORD=your-password
   SUPABASE_PROJECT_URL=https://your-project.supabase.co
   SUPABASE_API_KEY=eyJ...  # Paste Anon Key here
   SUPABASE_STORAGE_API_KEY=eyJ...  # Paste Service Role Key here
   JWT_SECRET=your-jwt-secret  # Paste JWT Secret here
   SUPABASE_STORAGE_BUCKET=roomly-images
   ```

3. **Important**: Replace the values - don't leave the placeholders!

---

## Step 4: Setup Database (3 minutes)

1. Go to Supabase Dashboard → Your Project → **SQL Editor**
2. Run this migration to set up the admin functionality:

   ```sql
   -- Add role column to users
   ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'user' 
   CHECK (role IN ('user', 'admin'));
   
   -- Add status column to listings
   ALTER TABLE listings ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending' 
   CHECK (status IN ('pending', 'approved', 'rejected'));
   
   -- Create indexes for performance
   CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
   CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
   ```

3. Make your account an admin (replace your email):

   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

---

## Step 5: Install Dependencies (5 minutes)

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
mvn clean install
cd ..
```

---

## Step 6: Run the Application

### Option A: Using PowerShell Scripts (Recommended for Windows)

**Terminal 1 - Start Backend:**
```powershell
.\run-backend.ps1
```

**Terminal 2 - Start Frontend:**
```bash
npm start
```

The app will open at: **http://localhost:3000**

### Option B: Manual Commands

**Terminal 1 - Start Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 - Start Frontend:**
```bash
npm start
```

---

## ✅ Verification Checklist

- [ ] `.env.local` file created with all values filled in
- [ ] Database migration ran successfully
- [ ] `npm install` completed without errors
- [ ] `mvn clean install` completed without errors
- [ ] Backend running on `http://localhost:8080` (check `/health` endpoint)
- [ ] Frontend running on `http://localhost:3000`
- [ ] Can log in with your account

---

## 🔧 Troubleshooting

### "Cannot connect to database"
- Check if `.env.local` exists and has correct `SUPABASE_DB_URL`
- Verify the database password is correct
- Try using the connection pooler URL instead (Supabase → Settings → Database → Connection pooling)

### "Supabase auth is not configured"
- Check if `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are set in `.env.local`
- Restart the frontend dev server after editing `.env.local`
- Clear browser cache (Ctrl+Shift+Delete)

### "Backend won't start"
- Make sure Java 21 is installed: `java -version`
- Make sure Maven is installed: `mvn -version`
- Delete `backend/target` folder and try again: `mvn clean install`

### "Can't find Maven/Java"
- Update the paths in `run-backend.ps1` if your Java/Maven is installed elsewhere
- Or add them to your system PATH

### Port 3000 or 8080 already in use
- Change the port in:
  - Frontend: `REACT_APP_API_BASE_URL` in `.env.local`
  - Backend: `server.port` in `backend/src/main/resources/application.properties`

---

## 📁 Important Files

- **`.env.local`** - Your local configuration (DO NOT commit to git)
- **`.env.example`** - Template for new developers
- **`backend/.env.example`** - Backend configuration template
- **`database/01_initial_schema.sql`** - Database schema (already in Supabase)

---

## ⚠️ Security

- **NEVER** commit `.env.local` to Git
- **NEVER** share your JWT_SECRET or Service Role Key publicly
- If keys are leaked, regenerate them in Supabase immediately

---

## Next Steps

Once everything is running:
1. Read [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for code structure
2. Check [ADMIN_QUICK_SETUP.md](ADMIN_QUICK_SETUP.md) if you're testing admin features
3. Create a feature branch and start coding!

---

## Need Help?

1. Check the [Troubleshooting](#-troubleshooting) section above
2. Read the error messages carefully - they usually tell you what's wrong
3. Check if Supabase is online: https://status.supabase.com
4. Ask your team for help
