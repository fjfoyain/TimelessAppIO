import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import PWARegister from "@/components/PWARegister";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

export const viewport: Viewport = {
  themeColor: "#7F13EC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Timeless - Connect the Frequency",
  description:
    "Timeless bridges the gap between creation and performance. The ultimate ecosystem connecting artists, venues, and industry talent in one seamless rhythm.",
  keywords: ["music", "artists", "venues", "talent", "events", "booking", "studio"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Timeless",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "Timeless - Connect the Frequency",
    description:
      "The ultimate ecosystem connecting artists, venues, and industry talent in one seamless rhythm.",
    images: [{ url: "/images/hero-concert.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Timeless - Connect the Frequency",
    description:
      "The ultimate ecosystem connecting artists, venues, and industry talent in one seamless rhythm.",
    images: ["/images/hero-concert.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${beVietnamPro.variable}`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* iOS home screen icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-background-dark font-display text-white min-h-screen antialiased">
        <AuthProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </AuthProvider>
        <PWARegister />
      </body>
    </html>
  );
}
