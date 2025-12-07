import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google"; // Switched to Inter instead of Geist
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans", // Keeping variable name to avoid breaking CSS
  subsets: ["latin"],
});

// Mock Geist Mono with Space Grotesk or another mono font if needed, or just remove
const spaceMono = Space_Grotesk({
    variable: "--font-geist-mono", // Mocking variable
    subsets: ["latin"],
});

// Load Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "NullShot HUNT Dashboard",
  description: "Autonomous Security Agent Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} ${spaceGrotesk.variable} antialiased font-sans bg-midnight`}>
        {children}
      </body>
    </html>
  );
}
