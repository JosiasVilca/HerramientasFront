// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1c30",
};

export const metadata: Metadata = {
  title: {
    default: "NEXORA STORE | Tecnología gamer en Perú",
    template: "%s · NEXORA STORE",
  },
  description:
    "Periféricos, audio y tecnología gamer originales con despacho express a todo el Perú y garantía oficial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
