# Roomly - Presentation Speech
## Core Features & Backend Integration

---

## OPENING (30 seconds)

Good [morning/afternoon], everyone. I'm excited to share Roomly with you today—a full-stack rental listing platform built to solve a real problem: making it easy for students and professionals to find quality housing near their campus.

In the next 10 minutes, I'll walk you through our core features, show you how everything works behind the scenes, and explain the technical decisions that make this platform scalable and secure.

Let's dive in.

---

## THE PROBLEM & SOLUTION (45 seconds)

Finding rental housing near campus is frustrating. You jump between multiple websites, miss listings, can't save favorites, and have no way to contact landlords easily.

Roomly brings everything together in one place:
- **Browse listings** with photos and detailed information
- **Save your favorite homes** for quick access
- **Upload listings** with multiple images automatically stored in the cloud
- **Manage everything** through one secure account

And it all works seamlessly because of the technology stack we've built.

---

## TECH STACK OVERVIEW (1 minute)

We built Roomly using modern, production-ready technology:

**Frontend:** React 19 with React Router—a responsive, fast web application that communicates with our backend through a clean REST API.

**Backend:** Spring Boot 3.4 running on Java 21—a robust, enterprise-grade framework that handles authentication, data validation, and business logic.

**Database:** PostgreSQL hosted on Supabase—a managed cloud database that scales with us and keeps our data safe.

**Storage:** Supabase Storage—S3-compatible cloud storage for rental images.

**Authentication:** Supabase JWT tokens—secure, stateless authentication that works beautifully with our Spring Boot backend.

The key insight here is that we're using modern cloud infrastructure to focus on features, not infrastructure management.

---

## CORE FEATURE 1: RENTAL LISTINGS (2 minutes)

Let's start with the heart of Roomly—rental listings.

**What users see:**
Users can browse all available listings, filter by campus or price, see detailed photos, and click through to more information. It's simple. It's fast.

**Behind the scenes:**
When a user creates a listing, here's what happens:

1. They fill out a form—title, price, location, description, and amenities.
2. They upload multiple photos.
3. They hit submit.

**Now the magic begins:**

Our frontend sends the listing data and images to our backend API. The Spring Boot controller receives the request and checks: Is this user authenticated? Do they have a valid JWT token?

Yes? Great. We proceed.

The backend then calls our image upload service—which takes those photos and uploads them to Supabase Storage. Each image gets a unique public URL on the CDN.

While those images are uploading—and here's important—**if the upload fails, we don't fail the listing.** We log the error and let the user know, but the listing gets saved anyway. Resilience first.

Finally, we save the listing to our PostgreSQL database with all the image URLs attached. The frontend receives confirmation, and boom—the listing is live.

**API Endpoints:**
- `GET /api/listings` - Browse all listings
- `POST /api/listings` - Create a new listing (requires authentication)
- `PUT /api/listings/{id}` - Update a listing (owner only)
- `DELETE /api/listings/{id}` - Delete a listing (owner only)

This is CRUD done right—simple, secure, and built for real-world usage.

---

## CORE FEATURE 2: SAVED HOMES (1 minute)

Users find a listing they love. They click "Save." Where does it go?

Into their personal collection of saved homes. It persists. They log out, log back in the next day, and it's still there.

**How it works:**

When a user saves a listing, we create a relationship in our database: User → SavedHome → Listing.

The backend stores this with a timestamp, so we know exactly when they saved it. We can sort by recent, filter by price—all possible because it's in our database, not just their browser.

**API Endpoints:**
- `GET /api/users/{userId}/saved-homes` - See all saved listings
- `POST /api/users/{userId}/saved-homes` - Add a listing to saved homes
- `DELETE /api/users/{userId}/saved-homes/{id}` - Remove it

Every endpoint is authenticated—meaning only you can see your own saved homes. Security by design.

---

## CORE FEATURE 3: IMAGE STORAGE & MANAGEMENT (1.5 minutes)

Images make listings. But managing them is hard. We solved it.

**The problem we solved:**
Storing images locally on a server doesn't scale. If we have 10,000 listings with 5 images each, that's 50,000 images. Storage fills up. Bandwidth explodes. Performance tanks.

**Our solution:**
Supabase Storage. It's S3-compatible cloud storage. Images live on a CDN, not on our server.

**The flow:**

User uploads an image → Our backend receives it → We send it to Supabase Storage with proper authentication headers → Supabase returns a public URL → We store that URL in the database → Frontend displays it from the CDN.

**Why this matters:**
- **Speed:** Images load from geographically distributed servers, not from our single backend.
- **Scalability:** We can have millions of images without worrying about server storage.
- **Cost:** We pay for what we use. No expensive dedicated storage servers.
- **Reliability:** If our backend goes down, images still load. They're hosted separately.

The technical detail: We use an HTTP client called OkHttp to communicate with Supabase. Every request includes authentication headers—a Bearer token and an API key. It's simple, it's secure, and it works every time.

---

## CORE FEATURE 4: USER ACCOUNTS & AUTHENTICATION (2 minutes)

Here's something unique about Roomly: **We auto-create user accounts.**

**Traditional flow:** User signs up → Creates password → Confirms email → Account created.

**Our flow:** User logs in with Supabase → We get a JWT token → User can immediately post listings.

Why? Because Supabase handles identity. We trust that if the JWT is valid, the person is who they claim to be.

**The authentication flow in detail:**

1. **Frontend:** User logs in through Supabase. Supabase returns a JWT token.
2. **Frontend:** From now on, every request includes this token: `Authorization: Bearer {token}`
3. **Backend:** A special filter intercepts the request. It validates the JWT signature using Supabase's public key.
4. **Backend:** If valid, we extract the user's ID and email from the token.
5. **Backend:** We then check: Does this user exist in our database?
6. **Backend:** If not, we create them. Auto-account-creation.
7. **Backend:** Either way, we attach the user to the request context.
8. **Controller:** Now the controller knows who the user is. It can assign listings to them, check if they own a listing, etc.
9. **Response:** The request proceeds and returns a response.

This is elegant because it's **stateless**. We don't need to store sessions. Every request has everything we need.

**Security:** We validate the JWT signature. We check expiration. We ensure the token came from Supabase, not someone's laptop.

---

## CORE FEATURE 5: CAMPUS & LOCATION DATA (45 seconds)

Roomly is built for Cebu. We have a list of campuses—USJ-R, Ateneo, UV, Benilde.

Each campus has coordinates. Each listing is linked to a campus.

This enables:
- **Filtering:** Show me only listings near Ateneo.
- **Mapping:** Visual display of where listings are.
- **Proximity queries:** In the future, "Show me listings within 2km of this campus."

It's a small feature, but it's foundational. Without geographic context, Roomly is just another classified ads site.

---

## ARCHITECTURE OVERVIEW (1.5 minutes)

Let me tie this all together with a high-level view of how Roomly works.

**The Frontend (React):**
- React is running in the user's browser
- When a user browses listings, React makes an HTTP request to our backend
- The backend responds with JSON data
- React renders it as HTML and CSS
- When a user saves a home, React calls a different endpoint
- Everything flows through our `rentalApi.js` service, which attaches the JWT token to every request

**The Backend (Spring Boot):**
- Spring Boot is a Java server running on `localhost:8080`
- It has a `DispatcherServlet` that routes HTTP requests to the right controller
- Before any controller runs, our `SupabaseJwtFilter` checks the JWT
- If valid, it auto-creates the user if needed and sets the security context
- Controllers then handle business logic: creating listings, saving homes, fetching data
- They call service layer objects like `ListingService` and `UserService`
- Services use JPA repositories to query PostgreSQL

**The Database (PostgreSQL on Supabase):**
- Four main tables: `users`, `listings`, `campuses`, and `saved_homes`
- Foreign keys enforce relationships: A listing must belong to a user and a campus
- A saved_home must reference both a user and a listing
- Constraints ensure data integrity

**The Storage (Supabase Storage):**
- When we upload images, they go here
- Each image gets a URL like: `https://klhgcqoypnxkqnrnbesz.supabase.co/storage/v1/object/public/roomly-images/...`
- Frontend displays these URLs directly from the CDN

**The flow visually:**
User clicks "Browse" → React → HTTP GET to /api/listings → Spring Boot processes → JPA queries PostgreSQL → Returns JSON → React renders with image URLs from Supabase Storage.

It's a clean architecture. Each piece has one job. They talk to each other through well-defined interfaces.

---

## WHY THIS ARCHITECTURE? (1 minute)

You might ask: Why Spring Boot? Why Supabase? Why React?

**React:** It's the most popular JavaScript framework. Easy to learn, huge community, great libraries.

**Spring Boot:** It's battle-tested in enterprise. It scales. It handles security well. And we get dependency injection, aspect-oriented programming, and a ton of built-in features.

**PostgreSQL/Supabase:** PostgreSQL is the gold standard for relational databases. Supabase is a managed service, which means we don't have to manage servers ourselves. We focus on code, not ops.

**JWT authentication:** It's stateless, which means our backend doesn't need to store sessions. We can run multiple backend instances and they all work together without sharing session data.

**Supabase Storage:** We could store images on our server, but that's not scalable. Cloud storage is the modern way.

These choices mean Roomly is built on industry best practices. We're not experimenting with bleeding-edge tech that might disappear. We're using proven, stable, well-supported tools.

---

## SECURITY (1 minute)

Security is not an afterthought. It's built in.

**JWT Validation:** Every request is checked. If the token is invalid or expired, the request fails.

**CORS (Cross-Origin Resource Sharing):** Our backend only accepts requests from our frontend. Requests from random websites are rejected.

**Database Security:** We use parameterized queries through JPA. We don't concatenate user input into SQL. This prevents SQL injection attacks.

**Password Security:** We don't even handle passwords. Supabase does. They use bcrypt, salting, the works.

**HTTPS in Production:** In production, all communication between frontend and backend is encrypted. Today we're on localhost, so we're not using HTTPS, but on a real server, we would.

The principle: Assume nothing is safe. Validate everything.

---

## SCALABILITY (1 minute)

Right now, Roomly runs locally. But how does it scale to 10,000 users?

**Frontend:** We use React Router for client-side navigation. That reduces server load.

**Backend:** Spring Boot is designed to scale horizontally. We can run multiple instances behind a load balancer.

**Database:** PostgreSQL handles indexes and query optimization. For extreme scale, we could add read replicas or move to a distributed system.

**Storage:** Supabase Storage scales automatically. We pay as we go. If we have 1 million images or 100 million, the cost and performance scale gracefully.

**Caching:** We're not doing this yet, but we could cache listing data in Redis. The first user loads a listing from the database, subsequent users get it from cache.

The good news: We've built for scale. We're not going to hit a wall at 1,000 users.

---

## WHAT'S NOT DONE YET (1 minute)

Be honest about what's missing:

**Landlord permissions:** We have the data model for it, but we're not enforcing it yet. A regular user could theoretically edit another user's listing (the UI doesn't let them, but the backend allows it).

**Search filters:** We support basic filtering by campus, but not by price range, amenities, or availability.

**Messaging:** Tenants and landlords can't message each other yet. In the future, they could.

**Reviews and ratings:** No way to rate a landlord or review a property.

**Mobile app:** Right now, it's web-only. A React Native version would give us iOS and Android.

These aren't bugs. These are features we intentionally deferred. We built the core platform first. These additions will be straightforward because the architecture supports them.

---

## DEMONSTRATION (optional, 3-5 minutes)

*[If showing live demo]*

Let me show you Roomly in action.

*[Open browser to localhost:3000]*

This is the search page. You can see listings with photos. Each photo was uploaded by a landlord and is stored in Supabase. When you click to save a home, it's persisted to our database. 

*[Click save]*

You've just created a database record linking your user to this listing.

*[Go to dashboard]*

This is where landlords post new listings. They upload photos, fill out details, and hit submit. Behind the scenes, the backend uploads images to Supabase and stores the listing in PostgreSQL.

*[Show network tab in DevTools]*

In the network tab, you can see every HTTP request. Each one includes the JWT token. Watch—I'll filter the requests to show only API calls.

Here's a POST request to create a listing. Here's the response with the listing ID. Clean, simple, RESTful.

---

## CLOSING (1 minute)

Roomly shows how modern web development works:

- **Frontend:** React handles the user interface.
- **Backend:** Spring Boot handles the business logic and data validation.
- **Database:** PostgreSQL stores everything.
- **Storage:** Supabase Storage scales images without us worrying.
- **Auth:** JWT tokens keep everything secure.

Each piece is simple. Together, they make a powerful platform.

We've proven the concept. Users can post listings. Users can find them. Images work. Authentication works. It's ready for real users.

The next phase is adding the features we talked about—landlord permissions, messaging, reviews—and then rolling it out to Cebu.

**Thank you.** I'm happy to take questions.

---

## Q&A TALKING POINTS

**Q: How do you handle image sizes? Won't huge images slow things down?**
A: Great question. In a production version, we'd compress images on the frontend before upload, and use thumbnails for listings grids. Supabase Storage also offers on-the-fly image transformations—crop, resize, etc.

**Q: What happens if Supabase goes down?**
A: Then the image CDN and the database are both down. That's a risk. In production, we'd have a backup database and storage provider, or use a platform like AWS that has redundancy built in.

**Q: How do you prevent users from posting fake listings?**
A: Right now, we don't really. In production, we'd verify landlord identity, add verification badges, and have a review/reporting system so other users can flag spam.

**Q: Can you sell this to other cities?**
A: Absolutely. The architecture is city-agnostic. We'd just swap out the campuses list and adapt the UI for local branding.

**Q: How much does this cost to run?**
A: Supabase charges for database queries and storage. React hosting on Vercel is free for small projects. Spring Boot hosting on a cloud provider like AWS or Heroku would be around $10-50/month depending on scale. Very affordable.

**Q: How did you learn Spring Boot?**
A: Documentation, tutorials, and hands-on experience. Spring Boot is well-documented, and the community is huge. Most common problems have solutions online.

