import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import TopProgressBar from "@/components/ui/TopProgressBar";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "ArtisanConnect — Trouvez le bon artisan près de chez vous",
    template: "%s | ArtisanConnect",
  },
  description:
    "Plateforme de mise en relation entre particuliers et artisans du bâtiment. Devis gratuits, artisans vérifiés, sans commission.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "ArtisanConnect",
    title: "ArtisanConnect — Trouvez le bon artisan près de chez vous",
    description:
      "Décrivez votre projet, recevez jusqu'à 3 devis d'artisans vérifiés. Gratuit pour les particuliers, sans commission.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtisanConnect — Trouvez le bon artisan près de chez vous",
    description:
      "Décrivez votre projet, recevez jusqu'à 3 devis d'artisans vérifiés. Gratuit pour les particuliers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full bg-ac-bg text-ac-text antialiased">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
