import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "@/components/UI/sonner";

export const metadata = {
  title: "Budget Tracker",
  description: "Track your budget with our website",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="dark"
        style={{
          colorScheme: "dark",
        }}
      >
        <body>
          <Toaster richColors position="bottom-right" />
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
