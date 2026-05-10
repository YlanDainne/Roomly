# Roomly Project - Developer Guide

Welcome to Roomly! This guide covers the current state of the project and what's been implemented.

## 📚 Project Overview

**Roomly** is a room rental platform for Cebu, Philippines. It connects landlords with students looking for accommodation near various university campuses.

**Tech Stack:**
- **Frontend:** React 18+ (in `roomly/src`)
- **Backend:** Spring Boot 3.4.5 with Java 21 (in `roomly/backend`)
- **Database:** PostgreSQL via Supabase (https://klhgcqoypnxkqnrnbesz.supabase.co)
- **Storage:** Supabase Storage for images
- **Auth:** Supabase Authentication

---

## ✅ What's Complete

### Backend (Spring Boot)

#### Architecture
- ✅ **Layered Design**: Controller → Service → Repository → Entity
- ✅ **JPA Entities**: Listing, SavedHome, Campus models
- ✅ **Spring Data Repositories**: ListingRepository, SavedHomesRepository
- ✅ **REST API**: Full CRUD endpoints for listings and saved homes

#### Database Integration
- ✅ **PostgreSQL via Supabase**: JPA-managed persistence
- ✅ **Automatic Schema**: Hibernate `ddl-auto=update` creates tables
- ✅ **SQL Migration**: 01_initial_schema.sql available for manual schema creation
- ✅ **Connection Pooling**: Spring Data JPA with PostgreSQL driver

#### Storage & Files
- ✅ **Supabase Storage Service**: Class for bucket operations
- ✅ **Upload Support**: Multipart file handling in controllers
- ✅ **Image References**: JPA `@ElementCollection` for image URLs

#### Security & Authentication
- ✅ **JWT Validation**: Filter to validate Supabase tokens
- ✅ **Token Provider**: SupabaseJwtProvider for token verification
- ✅ **Security Context**: Spring Security integration
- ✅ **User-scoped Endpoints**: Saved homes require valid JWT

#### Endpoints
- ✅ `GET /api/listings` - List all listings (public)
- ✅ `GET /api/listings/{id}` - Get listing details (public)
- ✅ `POST /api/listings` - Create listing (public for now)
- ✅ `PUT /api/listings/{id}` - Update listing (public for now)
- ✅ `DELETE /api/listings/{id}` - Delete listing (public for now)
- ✅ `GET /api/saved-homes` - Get user's saved homes (auth required)
- ✅ `POST /api/saved-homes/{id}` - Save a listing (auth required)
- ✅ `DELETE /api/saved-homes/{id}` - Unsave a listing (auth required)
- ✅ `GET /api/campuses` - List all campuses (public)
- ✅ `GET /api/hotspots` - Hotspot aggregations (public)

### Frontend (React)

#### Completed
- ✅ Landing page with campus/neighborhood display
- ✅ Search results page with map and listings
- ✅ Dashboard with saved homes list
- ✅ Login and registration pages (UI only)
- ✅ Responsive design with CSS
- ✅ RentalDataContext for state management
- ✅ API service layer (`rentalApi.js`)

---

## ⏳ What's Partially Complete

### Backend Configuration
- 🟡 **Environment Variables**: Template created (`.env.local`), needs actual values
- 🟡 **API Keys**: Placeholder values, need Supabase dashboard keys
- 🟡 **Database Schema**: SQL file created, needs execution in Supabase

### Storage Integration
- 🟡 **SupabaseStorageService**: Code written, not yet used in FileStorageService
- 🟡 **Image Uploads**: Multipart handling ready, but still uses local filesystem
- 🟡 **Public URLs**: Service ready to generate Supabase Storage URLs

### Authentication
- 🟡 **JWT Validation**: Backend ready, frontend not integrated
- 🟡 **Saved Homes**: Backend endpoints ready, need frontend calls
- 🟡 **User Context**: Backend has user ID from JWT, frontend needs to provide token

---

## ⏹️ What's Not Started

### Backend
- ❌ Landlord authentication and permissions
- ❌ User profiles and reviews
- ❌ Search and filtering by price/location
- ❌ Notifications
- ❌ Payment processing
- ❌ Admin endpoints
- ❌ Rate limiting

### Frontend
- ❌ Supabase Auth integration (login/signup)
- ❌ JWT token attachment to API calls
- ❌ User profile page
- ❌ Landlord dashboard
- ❌ Image upload UI
- ❌ Search filters
- ❌ Reviews section

---

## 🚀 Next Steps

### Immediate (Required to Test)

1. **Get Supabase API Keys** (5 minutes)
   - Visit: https://app.supabase.com/project/klhgcqoypnxkqnrnbesz/settings/api
   - Copy: Anon Key, Service Role Key, JWT Secret
   - Update: `roomly/.env.local`

2. **Create Database Schema** (2 minutes)
   - Go to: https://app.supabase.com/project/klhgcqoypnxkqnrnbesz/sql/new
   - Copy & paste: `roomly/database/01_initial_schema.sql`
   - Click: Run

3. **Create Storage Bucket** (1 minute)
   - Go to: https://app.supabase.com/project/klhgcqoypnxkqnrnbesz/storage/buckets
   - Create bucket: `roomly-images` (public)

4. **Run Backend** (2 minutes)
   - Load `.env.local` variables
   - Run: `mvn spring-boot:run` from `roomly/backend`
   - Test: `curl http://localhost:8080/api/listings`

### Short Term (Frontend Integration)

1. **Install Supabase Client**
   ```bash
   cd roomly
   npm install @supabase/supabase-js
   ```

2. **Create Supabase Client**
   - Create: `roomly/src/services/supabaseClient.js`
   - Export: Supabase client instance

3. **Add Login/Signup**
   - Update: `roomly/src/pages/LoginPage.js`
   - Update: `roomly/src/pages/RegisterPage.js`
   - Use: Supabase Auth

4. **Attach Tokens to Requests**
   - Update: `roomly/src/services/rentalApi.js`
   - Add: `Authorization: Bearer <token>` header
   - Use: Supabase session token

5. **Test Authentication**
   - Sign up → Get token
   - Save a listing → POST /api/saved-homes/1
   - Verify: Token is validated

### Medium Term (Enhancement)

1. **Improve Listings**
   - Add search filters (price, beds, location)
   - Add sorting options
   - Improve map integration

2. **User Profiles**
   - Show saved homes
   - User preferences
   - Contact landlord

3. **Image Uploads**
   - Frontend file picker
   - Integration with Supabase Storage
   - Preview before upload

---

## 📁 Project Structure

```
roomly/
├── package.json                    # Frontend dependencies
├── .env.local                      # Backend environment variables (template)
├── SUPABASE_SETUP.md              # Detailed setup guide
├── SUPABASE_KEYS.md               # API keys reference
├── INTEGRATION_COMPLETE.md        # Integration summary
├── SUPABASE_CHECKLIST.md          # Completion checklist
│
├── public/                         # Static assets
├── build/                          # Production frontend build
│
├── src/                            # React frontend
│   ├── index.js
│   ├── App.js
│   ├── components/                 # React components
│   ├── pages/                      # Page components
│   ├── services/                   # API and utilities
│   │   └── rentalApi.js           # Backend API calls
│   ├── context/
│   │   └── RentalDataContext.js   # Global state
│   └── data/
│       └── cebuCampuses.js        # Campus reference data
│
├── backend/                        # Spring Boot backend
│   ├── pom.xml                     # Maven dependencies
│   ├── SUPABASE_KEYS.md           # Quick reference
│   ├── src/main/
│   │   ├── java/com/roomly/backend/
│   │   │   ├── RoomlyApplication.java
│   │   │   ├── config/             # Spring configuration
│   │   │   ├── controller/         # REST endpoints
│   │   │   ├── entity/             # JPA entities
│   │   │   ├── repository/         # Data access
│   │   │   ├── service/            # Business logic
│   │   │   └── security/           # Auth & security
│   │   └── resources/
│   │       └── application.properties
│   ├── target/                     # Compiled output
│   └── uploads/                    # Temporary file storage
│
└── database/                       # Database migrations
    ├── 01_initial_schema.sql       # Schema definition
    └── README.md                   # Migration guide
```

---

## 🔧 Development Commands

### Frontend

```bash
# Install dependencies
cd roomly
npm install

# Start development server
npm start        # Port 3000

# Build for production
npm run build

# Run tests
npm test
```

### Backend

```bash
# Set Java & Maven paths
set JAVA_HOME=C:\Users\Matebook D14 BE\.jdk\jdk-21.0.8
set PATH=%JAVA_HOME%\bin;%PATH%

# Compile
cd roomly/backend
mvn clean compile

# Run
mvn spring-boot:run        # Port 8080

# Build JAR
mvn clean package

# Run tests
mvn test
```

---

## 🧪 Testing

### Backend API Tests

```bash
# Create listing
curl -X POST http://localhost:8080/api/listings \
  -H "Content-Type: application/json" \
  -d '{"title":"Studio","city":"Cebu","price":5000}'

# Get all listings
curl http://localhost:8080/api/listings

# Get campuses
curl http://localhost:8080/api/campuses

# Get hotspots
curl http://localhost:8080/api/hotspots
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | Complete Supabase integration guide |
| [SUPABASE_KEYS.md](backend/SUPABASE_KEYS.md) | Quick API keys reference |
| [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) | What's included in integration |
| [SUPABASE_CHECKLIST.md](SUPABASE_CHECKLIST.md) | Completion status checklist |
| [database/README.md](database/README.md) | Database migration guide |

---

## 💡 Key Architecture Decisions

1. **Single Supabase Project**: All data, storage, and auth in one place
2. **JPA/Hibernate**: Automatic schema management with `ddl-auto=update`
3. **Spring Security**: Standard Java web security with JWT
4. **React Context**: Simple state management without Redux
5. **Layered Architecture**: Clean separation of concerns (controller/service/repo)

---

## 🐛 Known Limitations

1. **No Image Resize**: Uploaded images not resized or optimized
2. **No Pagination**: All listings loaded at once (will need pagination for scale)
3. **No Search/Filter**: Basic list only, no advanced search
4. **No Rate Limiting**: API endpoints not rate-limited
5. **No Validation**: Minimal input validation on requests
6. **No Admin Panel**: No way to manage users or listings as admin

---

## 📝 Notes for Future Development

- Keep `.env.local` out of version control (add to .gitignore)
- Document any new environment variables
- Add logging for debugging production issues
- Implement pagination before production (current setup returns all listings)
- Add input validation to prevent SQL injection and invalid data
- Add proper error handling and HTTP status codes
- Consider caching for frequently accessed data (campuses)
- Implement rate limiting to prevent abuse
- Add CORS configuration for production domains
- Set up proper database backups

---

## 👥 Team Reference

**Project Setup:**
- Backend: Spring Boot 3.4.5 with Java 21
- Frontend: React (with Supabase SDK)
- Database: PostgreSQL on Supabase
- Deployment: (Ready for Docker/Cloud)

**Contact:** Check project repository for contributor info

---

**Last Updated:** May 4, 2026  
**Status:** Backend Supabase Integration Complete ✅
