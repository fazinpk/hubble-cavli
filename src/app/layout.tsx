import type { Metadata } from "next";
import { Quicksand } from "next/font/google";

import MainLayout from "@layouts/main";

import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hubble by Cavli Wireless",
  description:
    "Cellular IoT modules and the Hubble connectivity platform by Cavli Wireless.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${quicksand.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
