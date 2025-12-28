import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Background3D from "@/components/Background3D";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SnapLink | Premium URL Shortener",
  description: "Shorten your links with style. GPU-accelerated 3D interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen antialiased overflow-x-hidden")}>
        <Background3D />
        <main className="relative z-10 min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
