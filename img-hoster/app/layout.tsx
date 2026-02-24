import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { BodyWrapper } from "@/components/body-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ImgHoster – Host Images Instantly & Securely",
  description: "A modern, fast, and secure image hosting platform. Upload, share, and manage your images with powerful tools and a beautiful UI.",
  keywords: "image hosting, file upload, image sharing, CDN, storage",
  openGraph: {
    title: "ImgHoster – Host Images Instantly & Securely",
    description: "Upload, share, and manage your images with powerful tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <BodyWrapper>{children}</BodyWrapper>
        </Providers>
      </body>
    </html>
  );
}
