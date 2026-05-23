import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Hanken_Grotesk, Yellowtail } from "next/font/google";
import "./globals.css";

const yellowtail = Yellowtail({
  variable: "--font-yellowtail",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tradition XI — Colorado Springs 2026",
  description:
    "Tradition XI · Colorado Springs · 12 men · 4 courses · One tradition. The companion app — courses, roster, caddy poll, side bets, scoreboard, and the quote wall.",
  applicationName: "Tradition XI",
  appleWebApp: {
    capable: true,
    title: "Tradition XI",
    statusBarStyle: "black-translucent",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Tradition XI — Colorado Springs 2026",
    description: "12 men · 4 courses · One tradition.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c3b2a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${yellowtail.variable} ${dmSerif.variable} ${hanken.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
