# 🚀 Hackathon Template

A beautiful Next.js template with authentication, onboarding, and stunning UI for hackathons!

## 🛠️ Setup Instructions

1. **Download this project**

2. **Open terminal/command prompt in the project folder**

3. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

4. **Set up your Backend API:**
   - Make sure your backend is running on `http://localhost:8000`
   - Update `NEXT_PUBLIC_API_URL` in `.env.local` if different

5. **Set up Clerk Authentication:**
   - Go to [clerk.com](https://clerk.com)
   - Create account and new application
   - **Enable username collection** in Clerk Dashboard:
     - Go to User & Authentication → Email, Phone, Username
     - Enable "Username" and set it as required for sign-up
   - Copy your keys to `.env.local`:
   \`\`\`env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
   CLERK_SECRET_KEY=your_secret_key_here
   NEXT_PUBLIC_API_URL=http://localhost:8000
   \`\`\`

6. **Run the project:**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open [http://localhost:3000](http://localhost:3000)**

## 🔧 If You Get Errors

If installation fails, try:
\`\`\`bash
npm cache clean --force
npm install --legacy-peer-deps
\`\`\`

## ✨ What's Included

- 🏠 Beautiful landing page
- 🔐 Login/signup pages with Clerk
- 👤 **Clerk username collection** (configured in Clerk dashboard)
- 🎯 **Onboarding flow** that uses Clerk username + collects additional info
- 📊 Dashboard with stats and projects
- 👤 Profile page with backend integration
- 🎨 Tailwind CSS styling
- 📱 Fully responsive design
- 🛡️ Protected routes
- 🔗 **Backend API integration** for user management

## 🔄 Simplified User Flow

1. **Landing Page** → User sees beautiful homepage
2. **Sign In** → If account exists, user signs in
3. **Sign Up** → If no account, redirects to sign up
4. **Clerk Username Collection** → Clerk collects username (first time only)
5. **Automatic API Call** → Backend user creation happens automatically
6. **Dashboard** → User redirected to dashboard immediately

## 🎯 Backend Integration

The template automatically calls your backend API immediately after signup:

**After Clerk Username Collection:**
\`\`\`bash
POST http://localhost:8000/users
{
  "username": "parth_03",           // From Clerk username
  "fullname": "Parth Thakkar",      // From Clerk name
  "clerk_id": "clrk_6789",          // From Clerk user ID
  "address": "",                    // Empty initially
  "profile_url": "https://profile-image-url"  // From Clerk or generated
}
\`\`\`

**For Existing Users:**
- Checks if user exists in backend
- If exists, directly goes to dashboard
- If not exists, creates user then goes to dashboard

## ⚙️ Clerk Configuration Required

In your Clerk Dashboard:
1. Go to **User & Authentication** → **Email, Phone, Username**
2. **Enable "Username"** 
3. Set username as **"Required"** for sign-up
4. This ensures Clerk collects username before API call

No separate onboarding page needed - everything happens automatically! 🚀
