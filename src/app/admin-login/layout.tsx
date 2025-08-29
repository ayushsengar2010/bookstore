import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - BookStore",
  description: "Sign in to access admin features",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

export default function AdminLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>{children}</>
  );
}
