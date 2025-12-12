# GitHub Setup & Push Instructions

Your code is ready to push to GitHub! Follow these steps:

## Option 1: Using GitHub Desktop (Easiest)

1. **Download GitHub Desktop** (if not installed)
   - Go to: https://desktop.github.com/
   - Install and sign in with your GitHub account

2. **Add Repository**
   - Click "File" → "Add Local Repository"
   - Browse to: `C:\Users\91798\Downloads\NXT-assignments\Acorn Globus Assignment`
   - Click "Add Repository"

3. **Publish to GitHub**
   - Click "Publish repository" button
   - Repository name: `sports-facility-booking`
   - Description: "Full-stack sports facility booking platform with multi-resource scheduling"
   - Uncheck "Keep this code private" (or keep checked if you want it private)
   - Click "Publish Repository"

4. **Done!** Your code is now on GitHub 🎉

---

## Option 2: Using Command Line

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `sports-facility-booking`
3. Description: "Full-stack sports facility booking platform"
4. Choose Public or Private
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Push Your Code

Copy your repository URL from GitHub (looks like: `https://github.com/YOUR_USERNAME/sports-facility-booking.git`)

Then run these commands:

```bash
cd "C:\Users\91798\Downloads\NXT-assignments\Acorn Globus Assignment"

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/sports-facility-booking.git

# Push to GitHub
git branch -M main
git push -u origin main
```

If prompted for credentials:
- Username: Your GitHub username
- Password: Use a Personal Access Token (not your password)
  - Create token at: https://github.com/settings/tokens
  - Select: `repo` scope
  - Copy the token and use it as password

---

## Option 3: Using VS Code

1. Open the project folder in VS Code
2. Click the Source Control icon (left sidebar)
3. Click "Publish to GitHub"
4. Choose repository name and visibility
5. Select files to publish
6. Done!

---

## After Pushing to GitHub

Your repository URL will be:
```
https://github.com/YOUR_USERNAME/sports-facility-booking
```

### Next Steps for Deployment:

1. **Deploy Backend to Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository you just created
   - Follow instructions in DEPLOYMENT.md

2. **Deploy Frontend to Vercel**
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Follow instructions in DEPLOYMENT.md

---

## Troubleshooting

### "Permission denied" error
- You need to set up SSH keys or use HTTPS with a Personal Access Token
- Easiest: Use GitHub Desktop (Option 1)

### "Repository already exists"
- The repository name is taken
- Choose a different name like `sports-facility-booking-platform`

### "Failed to push"
- Make sure you're connected to the internet
- Check if you entered the correct repository URL
- Try using GitHub Desktop instead

---

## What's Been Committed

✅ All backend code (API, models, controllers, routes)
✅ All frontend code (React components, pages, services)
✅ Configuration files (package.json, tailwind.config.js, etc.)
✅ Documentation (README.md, DEPLOYMENT.md)
✅ Deployment configs (vercel.json, .env.example files)

❌ NOT committed (in .gitignore):
- node_modules/
- .env files (sensitive data)
- build/ folders

This is correct! Never commit sensitive data or dependencies.

---

**Ready to push? Choose your preferred method above! 🚀**
