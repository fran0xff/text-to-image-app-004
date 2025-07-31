import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Image Generator",
  description: "Generate stunning AI images with Stable Diffusion",
  keywords: ["AI", "image generation", "stable diffusion", "art"],
  authors: [{ name: "AI Image Generator" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
