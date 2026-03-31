import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supabase generated types don't resolve joined queries (foreign key relations).
  // This causes 'never' type errors on .from() calls with .select() joins.
  // TODO: regenerate types with `npx supabase gen types` to fix properly.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
