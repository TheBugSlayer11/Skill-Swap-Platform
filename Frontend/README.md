# 🤝 SkillSwap Platform

A comprehensive skill exchange platform where users can offer their expertise and learn new skills through peer-to-peer swaps!

## 🛠️ Setup Instructions

1. **Download this project**

2. **Open terminal/command prompt in the project folder**

3. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

4. **Set up your Backend API:**
   - Make sure your backend is running on the URL specified in `.env.local`
   - The backend should implement all the API routes for users, swaps, and admin functions

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
   NEXT_PUBLIC_API_URL=your_backend_url_here
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

### 🎯 **Core Features**
- 🏠 **Beautiful landing page** with skill-focused messaging
- 🔐 **Authentication** with Clerk (username collection enabled)
- 👤 **Profile completion flow** for new users
- 📊 **Dashboard** with swap statistics and recent activity
- 🔍 **Browse skills** with search and filtering
- 💬 **Swap management** (request, accept, reject, cancel)
- ⭐ **Rating system** and user feedback
- 👑 **Admin dashboard** for user and platform management

### 📱 **User Experience**
- 🎨 **Modern UI** with Tailwind CSS and shadcn/ui
- 📱 **Fully responsive** design
- 🛡️ **Protected routes** and authentication
- 🔄 **Real-time updates** and notifications
- 📸 **Profile photo upload** via Cloudinary integration

### 🔄 **User Flow**

1. **Landing Page** → User discovers the platform
2. **Sign Up/In** → Clerk handles authentication
3. **Profile Completion** → New users complete their profile with skills
4. **Dashboard** → View swap activity and statistics
5. **Browse Skills** → Find users with desired skills
6. **Request Swaps** → Send skill exchange requests
7. **Manage Swaps** → Accept/reject requests, provide feedback

### 🛠️ **Backend Integration**

The platform integrates with your backend API for:

**User Management:**
- `POST /users/` - Create new user
- `GET /users/{user_id}` - Get user profile
- `PUT /users/{user_id}` - Update user profile
- `POST /users/{user_id}/upload-photo` - Upload profile photo
- `POST /users/{user_id}/rate` - Rate a user

**Swap Management:**
- `POST /swaps/request` - Send swap request
- `GET /swaps/my-swaps` - Get user's swaps
- `PUT /swaps/accept/{swap_id}` - Accept swap
- `PUT /swaps/reject/{swap_id}` - Reject swap
- `DELETE /swaps/cancel/{swap_id}` - Cancel swap
- `POST /swaps/feedback/{swap_id}` - Submit feedback

**Admin Functions:**
- `GET /admin/users` - List all users
- `PUT /admin/ban/{user_id}` - Ban user
- `GET /admin/swaps` - Monitor all swaps
- `POST /admin/broadcast` - Send platform messages

### 🎯 **Key Features**

#### **For Users:**
- ✅ Create detailed profiles with skills offered/wanted
- ✅ Set availability and privacy preferences
- ✅ Browse and search other users by skills
- ✅ Send and manage swap requests
- ✅ Rate and provide feedback after swaps
- ✅ Upload and manage profile photos

#### **For Admins:**
- ✅ Monitor all users and their activities
- ✅ Ban inappropriate users with reasons
- ✅ View and track all swap requests
- ✅ Send platform-wide announcements
- ✅ Export user and swap data

### 🔒 **Security & Privacy**
- 🛡️ **Secure authentication** with Clerk
- 🔐 **Private/public profile** options
- 🚫 **User banning** and moderation tools
- 📊 **Admin oversight** of all platform activity

## 🚀 **Getting Started**

1. **Complete your profile** with skills you can offer and want to learn
2. **Browse the community** to find interesting skill exchanges
3. **Send swap requests** to users whose skills interest you
4. **Accept requests** from others who want to learn from you
5. **Exchange skills** through video calls, meetings, or projects
6. **Rate and review** your experience to help the community

## 🎉 **Perfect for:**
- 🎓 **Students** wanting to learn new skills
- 💼 **Professionals** expanding their expertise
- 🎨 **Creatives** sharing and learning artistic skills
- 💻 **Developers** teaching and learning technologies
- 🌍 **Anyone** interested in skill exchange and community learning

---

**Built with:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Clerk Auth

**Ready to start swapping skills?** 🤝✨
