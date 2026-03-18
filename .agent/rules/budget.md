# Budget Constraints

**CRITICAL: ZERO-COST REQUIREMENT**

As the agent assisting with this project, you must strictly adhere to the following rules to ensure the project remains entirely free to host and operate:

1.  **Never suggest or implement paid third-party APIs or libraries.**
2.  **Always verify 'Free Tier' compatibility** before installing any new package or suggesting a new service.
3.  **Supabase:** We are using the Supabase Free Tier. Ensure all database operations, Auth, and Storage usage stay well within the generous free limits. Optimize queries and rely on Row Level Security (RLS) for privacy at no extra compute cost.
4.  **Vercel:** We are deploying to the Vercel Free/Hobby Tier.
    *   Ensure the project is highly optimized.
    *   Rely on Next.js automatic image optimization and tree-shaking.
    *   Monitor bundle size to prevent slow build times that exceed free tier limits.
5.  **Auto-Patching:** Automatically patch bugs using agentic prompts and verify via the built-in browser before pushing to the `main` branch for auto-deployment. Ensure fixes do not introduce performance regressions or new dependencies that violate the budget rules.
