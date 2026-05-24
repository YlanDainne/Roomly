# 🏡 Welcome to Roomly (RentBuddy)

Hi there! Welcome to **Roomly**, a passion project built to solve a struggle many students face: finding the perfect place to live during university. 

As students, we know how stressful and overwhelming it can be to hunt for apartments or dorms that are safe, affordable, and close to campus. We designed Roomly so that other students can skip the headache and find their ideal home with total peace of mind.

## 🌟 Why We Built Roomly

We wanted to create a platform that feels like a breath of fresh air. No cluttered listings or confusing forms. Just a clean, beautiful space focusing on what really matters to a student.

Our platform highlights:
* **Verified Landlords:** So you always know exactly who you are renting from.
* **Student Budgets:** Easy ways to filter places that actually fit a student lifestyle.
* **Campus Proximity:** Quickly see what is within walking distance of your classes.
* **Secure Contracts:** Keeping everything safe and official for your peace of mind.

## 🚀 How to Try It Out (Pull the Code)

Follow the **[Complete Setup Guide](SETUP.md)** to get Roomly running on your PC in 15 minutes.

The guide includes:
- ✅ Prerequisites (Java, Node.js, Maven)
- ✅ Getting Supabase keys
- ✅ Creating `.env.local` configuration
- ✅ Running frontend + backend
- ✅ Troubleshooting common issues

**Quick Start:**
```bash
git clone https://github.com/YlanDainne/Roomly.git
cd Roomly/roomly
cp .env.example .env.local
# Fill in your Supabase keys in .env.local
npm install
cd backend && mvn install && cd ..
npm start
# In another terminal: .\run-backend.ps1
```

See [SETUP.md](SETUP.md) for detailed instructions with screenshots and troubleshooting.

**2. For existing developers**
Next, tell your computer to prepare all the necessary pieces to run it:
```bash
npm install
```

**3. Launch the app!**
Finally, start up the application:
```bash
npm start
```

*Your web browser will automatically open up and you can click around and explore Roomly yourself!*

***
*Created with love and lots of coffee by a student, for students.*
