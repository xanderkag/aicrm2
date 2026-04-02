import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ProjectProvider } from "@/context/ProjectContext";
import AuthContext from "@/components/auth/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "AI-CRM 2.0",
  description: "Premium AI-powered CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthContext>
          <ProjectProvider>
            {children}
          </ProjectProvider>
        </AuthContext>
      </body>
    </html>
  );
}
