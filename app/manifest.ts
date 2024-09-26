import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NowNet",
    short_name: "NowNet",
    description:
      "Connect to nearby Wi-Fi networks instantly and pay only for the time you're connected. Wi-Fi owners can earn with NowNet.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    screenshots: [
      {
        src: "/big.png",
        sizes: "1208x761",
        type: "image/png",
      },
      {
        src: "/small.png",
        sizes: "381x708",
        type: "image/png",
      },
    ],
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
