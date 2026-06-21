import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wanderly — AI Travel Planner that designs the perfect trip",
  description: "Generate beautiful, personalised itineraries in seconds. Live weather, curated stays, and editable day-by-day plans.",
  authors: [{ name: "Wanderly" }],
  openGraph: {
    title: "Wanderly — AI Travel Planner",
    description: "Generate beautiful, personalised itineraries in seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrolling } from "@/components/smooth-scrolling";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <SmoothScrolling>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}
