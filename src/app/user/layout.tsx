import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Library - BookStore",
  description: "Browse and manage your personal library",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>{children}</>
  );
}
