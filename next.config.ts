import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DETTE TECHNIQUE : Les types Supabase générés manuellement ne résolvent pas
  // les FK relations dans .insert()/.select() joints. Fix définitif :
  // npx supabase gen types typescript --project-id idtuoyvxtcwxibzjizug > lib/types/database.types.ts
  // puis supprimer ce flag.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
