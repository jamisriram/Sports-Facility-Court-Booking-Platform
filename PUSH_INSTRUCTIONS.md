# How to Push Frontend Files to GitHub

## Problem
The frontend folder appeared empty on GitHub because it had a nested `.git` repository inside it.

## Solution Applied
✅ Removed the nested `.git` folder from frontend
✅ Added all frontend files to the main repository
✅ Created a commit with all frontend source code

## Next Step: Push to GitHub

The files are ready locally, but you need to authenticate to push to GitHub.

### Option 1: GitHub Desktop (Recommended - Easiest)

1. **Download GitHub Desktop** (if not installed)
   - https://desktop.github.com/

2. **Add Repository**
   - Open GitHub Desktop
   - File → Add Local Repository
   - Browse to: `C:\Users\91798\Downloads\NXT-assignments\Acorn Globus Assignment`
   - Click "Add Repository"

3. **Push**
   - Click the "Push origin" button at the top
   - Done! Your frontend files will be on GitHub ✅

### Option 2: Command Line

```bash
cd "C:\Users\91798\Downloads\NXT-assignments\Acorn Globus Assignment"
git push origin main
```

**Authentication:**
- Username: `jamisriram`
- Password: **Personal Access Token** (not your GitHub password)

**Create a Personal Access Token:**
1. Go to: https://github.com/settings/tokens/new
2. Note: "Sports Facility Booking Platform"
3. Expiration: 90 days (or your preference)
4. Select scope: ✅ `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

### Option 3: VS Code

1. Open folder in VS Code
2. Click Source Control icon (Ctrl+Shift+G)
3. Click "..." menu → Push
4. Sign in with GitHub when prompted
5. Done!

---

## Verify Success

After pushing, go to:
https://github.com/jamisriram/Sports-Facility-Court-Booking-Platform

You should see:
- ✅ `backend/` folder with all files
- ✅ `frontend/` folder with `src/`, `public/`, `package.json`, etc.
- ✅ `README.md`, `DEPLOYMENT.md`, `.gitignore`

---

## What's in the Commit

The commit "Fix: Add all frontend source files" includes:
- `frontend/src/` - All React components and pages
- `frontend/public/` - Public assets
- `frontend/package.json` - Dependencies
- `frontend/tailwind.config.js` - Tailwind configuration
- `frontend/vercel.json` - Vercel deployment config
- All other frontend configuration files

**Total: ~40 frontend files ready to push!**
