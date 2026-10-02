import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyOwnMaterials",
  description:
    "Create printable classroom materials from reusable teacher content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
