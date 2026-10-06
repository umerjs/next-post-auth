import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/components/Authguard";

export const metadata: Metadata = {
  title: "Next Post Auth",
  description: "Posts application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
