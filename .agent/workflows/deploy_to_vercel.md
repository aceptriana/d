---
description: Deploy the application to Vercel
---

1. Initialize Vercel project and deploy (Preview)
   - Runs the Vercel CLI. You will need to log in if it's your first time.
   - Accept the defaults for most questions.
   - For "Output Directory", ensure it is set to `dist` (Vite default).
```bash
npx vercel
```

2. Deploy to Production
   - Once tested, deploy to the main domain.
```bash
npx vercel --prod
```
