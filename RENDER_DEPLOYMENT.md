# Zenith Restaurant - Frontend Deployment Guide for Render

## Prerequisites
- GitHub account
- Render account
- Backend deployed and running

## Step 1: Prepare Frontend Repository

1. Create a new GitHub repository for the frontend
2. Copy only the frontend folder contents to the new repository
3. Make sure these files are included:
   - All React components and files
   - `package.json` (updated version)
   - `vite.config.ts` (updated version)
   - `env.example`
   - `index.html`
   - `tsconfig.json` files

## Step 2: Deploy Frontend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub frontend repository
4. Configure the service:
   - **Name**: `zenith-frontend` (or your preferred name)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Choose Free plan

## Step 3: Environment Variables

In Render dashboard, go to your service → Environment tab and add:

```
VITE_API_URL=https://your-backend-app-name.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**Important**: Replace `your-backend-app-name` with your actual backend service name from Render.

## Step 4: Deploy

1. Click "Create Static Site"
2. Wait for deployment to complete
3. Note your frontend URL (e.g., `https://zenith-frontend.onrender.com`)

## Step 5: Update Backend CORS

After getting your frontend URL, update your backend environment variables in Render:

```
FRONTEND_URL=https://your-frontend-url.onrender.com
```

## Step 6: Test Full Application

1. Visit your frontend URL
2. Test user registration/login
3. Test menu browsing and ordering
4. Test admin functions

## Troubleshooting

- Check Render build logs if deployment fails
- Ensure VITE_API_URL points to your backend
- Verify backend CORS settings include your frontend URL
- Check browser console for API errors
- Ensure all environment variables are set correctly

## Performance Tips

- Enable gzip compression in Render
- Use CDN for static assets
- Optimize images before uploading
- Monitor bundle size
