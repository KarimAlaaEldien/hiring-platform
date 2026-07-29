import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "HIRE/ - Hiring Platform",
    template: "%s | HIRE/",
  },
  description: "A hiring platform where companies post jobs and developers apply, save opportunities, and track applications.",
  applicationName: "HIRE/",
  keywords: ["hiring platform", "developer jobs", "job applications", "companies hiring"],
  authors: [{ name: "HIRE/" }],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: "HIRE/ - Hiring Platform",
    description: "Connect companies with developers through job posts, applications, and real-time updates.",
    type: "website",
    siteName: "HIRE/",
  },
  twitter: {
    card: "summary",
    title: "HIRE/ - Hiring Platform",
    description: "Discover developer jobs and manage applications in one place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-text-primary bg-bg-primary">
        <Providers>
          {children}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
