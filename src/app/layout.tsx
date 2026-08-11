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
  themeColor: "#f8fafc",
};

export const metadata: Metadata = {
  title: {
    default: "PROJECT-HUB | University Repository",
    template: "%s | PROJECT-HUB",
  },
  description: "Centralized Academic Project and Thesis Repository System",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
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
    <html lang="en" className="h-full bg-background" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var isDark = saved === 'dark' || ((!saved || saved === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var themeColor = isDark ? '#030712' : '#f8fafc';
                  var metas = document.querySelectorAll('meta[name="theme-color"]');
                  if (metas.length > 0) {
                    metas.forEach(function(m) {
                      m.setAttribute('content', themeColor);
                      m.removeAttribute('media');
                    });
                  }
                  var appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
                  if (appleMeta) {
                    appleMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${lato.className} min-h-full bg-background text-foreground antialiased selection:bg-blue-500/20`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
