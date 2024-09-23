import ConvexClientProvider from "@/components/providers/convex-provider";
import ModalProvider from "@/components/providers/modal-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});

export const metadata: Metadata = {
  title: "NowNet – Seamless Wi-Fi Access, Pay As You Go",
  description:
    "NowNet allows you to connect to nearby Wi-Fi networks instantly and only pay for the time you use. Flexible, pay-per-use internet with no long-term contracts. Wi-Fi owners can earn weekly with NowNet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${ibmPlexSerif.variable} overflow-hidden`}
      >
        <NextTopLoader
          color="rgb(46, 144, 250)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px rgb(46, 144, 250),0 0 5px rgb(46, 144, 250)"
        />

        <ConvexClientProvider>
          {children}

          <Toaster />
          <ModalProvider />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
