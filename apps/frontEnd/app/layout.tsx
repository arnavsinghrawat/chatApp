import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./Provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "chatApp",
  description: "real-time chat application built with Next.js",
  icons: {
    icon: [
      { url: 'favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: [
      { url: 'public/favicon.svg', type: 'image/svg+xml' },
    ],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="page bg-[url('/bgImage.svg')] bg-contain">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}