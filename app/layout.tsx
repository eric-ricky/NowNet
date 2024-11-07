import ConvexClientProvider from "@/components/providers/convex-provider";
import ModalProvider from "@/components/providers/modal-provider";
import ServiceWorkerProvider from "@/components/providers/service-worker-provider";
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
  metadataBase: new URL("https://nownet.top/"),
  authors: {
    name: "ericricky",
  },
  openGraph: {
    title: "NowNet",
    description: "Connect to nearby Wi-Fi networks instantly",
    url: "https://nownet.top/",
    siteName: "NowNet",
    images: "/assets/icon128.jpeg",
    type: "website",
  },
  keywords: ["wifi networks", "eric ricky", "wifi", "now net"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${ibmPlexSerif.variable} !overflow-x-hidden`}
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
          <ServiceWorkerProvider>
            {/* . */}
            {/* <div>
            <section className="bg-gray-900 text-white">
              <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
                <div className="mx-auto max-w-3xl text-center">
                  <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
                    We&apos;re Under Development
                  </h1>

                  <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
                    We will be ready soon!
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <a
                      className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                      href="mailto:anownet@gmail.com"
                    >
                      Get in Touch
                    </a>
                  </div>
                </div>
              </div>
            </section>
            <div className="hidden">{children}</div>
          </div> */}

            {children}

            <Toaster />
            <ModalProvider />
          </ServiceWorkerProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
