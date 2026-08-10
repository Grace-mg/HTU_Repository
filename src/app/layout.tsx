import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "PROJECT-HUB | University Repository",
    template: "%s | PROJECT-HUB",
  },
  description: "Centralized Academic Project and Thesis Repository System",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PROJECT-HUB",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-background">
      <body className={`${lato.className} min-h-full bg-background text-foreground antialiased selection:bg-blue-500/20`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
