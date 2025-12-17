# Deployment Guide - ASHVI Website

Congratulations! Your code is now live on GitHub. The next step is to deploy it so the world can see it.

We recommend **Vercel** because it is free, fast, and optimized for React/Vite apps.

## Option 1: Deploy using Vercel (Recommended)

1.  **Create a Vercel Account**:
    *   Go to [vercel.com](https://vercel.com/signup).
    *   Sign up using **Continue with GitHub**.

2.  **Import Project**:
    *   Once logged in, click **"Add New..."** -> **"Project"**.
    *   You will see a list of your GitHub repositories.
    *   Find `ashvi` and click **"Import"**.

3.  **Configure Project**:
    *   **Framework Preset**: It should automatically detect `Vite`.
    *   **Root Directory**: Leave as `./`
    *   **Build Command**: `npm run build` (detected automatically)
    *   **Output Directory**: `dist` (detected automatically)
    *   **Environment Variables**: You don't need any for this project.

4.  **Deploy**:
    *   Click **"Deploy"**.
    *   Wait for about 1 minute.
    *   Once done, you will get a live URL (e.g., `ashvi.vercel.app`).

---

## Option 2: Deploy using Netlify

1.  Go to [netlify.com](https://www.netlify.com/) and sign up with GitHub.
2.  Click **"Add new site"** -> **"Import an existing project"**.
3.  Select **GitHub**.
4.  Choose the `ashvi` repository.
5.  **Build settings**:
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
6.  Click **"Deploy site"**.

---

## Post-Deployment Checklist

*   Open your new website URL on your mobile phone.
*   Click the "Order on WhatsApp" button to ensure it opens WhatsApp correctly.
*   Share the link on your Instagram bio!
