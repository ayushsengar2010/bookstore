import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - BookStore",
  description: "Manage your digital library",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>{children}</>
  );
}
