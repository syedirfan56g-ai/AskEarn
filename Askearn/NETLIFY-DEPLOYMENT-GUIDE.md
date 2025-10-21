# 🚀 Deploy AskEarn to Netlify - Complete Guide

## ✅ Overview

This guide will help you deploy the AskEarn application to Netlify. The application will be hosted as a static site with Firebase integration for authentication and database functionality.

## 📋 Prerequisites

1. A Netlify account (free at https://netlify.com)
2. A Firebase account (free at https://firebase.google.com)
3. This AskEarn project folder

## 🔧 Step-by-Step Deployment

### Step 1: Prepare the Project

1. Make sure you have all the necessary files in your project folder
2. The `.env` file should be configured (we already created this)
3. The database has been reset and seeded (we already did this)

### Step 2: Build the Application

Open a terminal in your project folder and run:

```bash
npm run build
```

This will create a `.next` directory with the built application.

### Step 3: Create a Static Export (Alternative Method)

Since we're using Netlify, we can also use Netlify's build system. Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 4: Deploy to Netlify

#### Option A: Drag & Drop (Easiest)

1. Go to https://app.netlify.com/drop
2. Drag and drop your entire project folder
3. Netlify will automatically detect it's a Next.js app and build it

#### Option B: Git Deployment

1. Push your project to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify:
   - Go to https://app.netlify.com/
   - Click "New site from Git"
   - Select your provider and repository
   - Set build command to: `npm run build`
   - Set publish directory to: `.next`
   - Click "Deploy site"

### Step 5: Configure Environment Variables

In Netlify Dashboard:
1. Go to your site settings
2. Click "Environment variables"
3. Add the following variables:

```
JWT_SECRET = your-super-secret-jwt-key-change-this-in-production
NODE_ENV = production
```

### Step 6: Setup Firebase Integration

Since the backend API won't be available on Netlify (it's a static host), you'll need to:

1. Set up Firebase for authentication and database
2. Update the frontend code to use Firebase instead of the Express API

#### Firebase Setup:

1. Go to https://console.firebase.google.com/
2. Create a new project called "AskEarn"
3. Enable Authentication (Google provider)
4. Enable Firestore Database
5. Register a web app and get your config

#### Update Environment Variables in Netlify:

Add these to your Netlify environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY = your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID = your_app_id
```

### Step 7: Update API Integration (Required Code Changes)

Since Netlify is a static host, you'll need to modify the application to use Firebase instead of the Express backend:

1. Replace all `api.js` calls with Firebase equivalents
2. Use Firebase Authentication instead of JWT cookies
3. Use Firestore instead of SQLite/PostgreSQL

### Step 8: Redeploy

After making the necessary code changes for Firebase integration:

1. Commit and push your changes
2. Netlify will automatically rebuild and deploy

## 🎯 Alternative: Hybrid Approach

If you want to keep the existing backend:

1. Deploy the frontend to Netlify (static files)
2. Deploy the backend to a service like Render, Railway, or Vercel Serverless Functions
3. Update the API URLs in the frontend to point to your backend

## 📝 Notes

- The current application uses server-side rendering which requires a Node.js environment
- For a fully static deployment, you'll need to refactor the application to use client-side data fetching
- Authentication will need to be handled via Firebase or another client-side solution

## 🆘 Troubleshooting

### Build Failures

If you encounter build issues:

1. Clear Netlify's build cache
2. Check that all dependencies are in package.json
3. Ensure environment variables are set correctly

### Runtime Errors

If the site builds but doesn't work:

1. Check the browser console for errors
2. Verify Firebase configuration
3. Ensure API endpoints are accessible (if using external backend)

## ✅ Success!

Once deployed, your AskEarn application will be available at a URL like:
`https://your-site-name.netlify.app`

The signup and login functionality will work once you've properly configured Firebase integration.