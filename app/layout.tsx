// File: app/layout.tsx
import type { Metadata } from "next";
import { Providers } from "@/components/Providers"; // ✅ Add this import
import { ToasterProvider } from "@/components/UI/ToasterProvider"; // ✅ Toasts

export const metadata: Metadata = {
  title: "Video Uploader App",
  description: "Upload and manage your videos easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToasterProvider />
          {children}
        </Providers>
      </body>
    </html>
  );
}
