import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import NanaAssistant from "@/components/NanaAssistant";
import "./globals.css";

export const metadata: Metadata = {
  title: "FarmLink | Premium Marketplace",
  description: "Connect directly with local farmers for the freshest produce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar />
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingTop: "80px" }}>
          {children}
        </main>
        <NanaAssistant />
      </body>
    </html>
  );
}
