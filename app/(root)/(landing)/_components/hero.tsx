import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-[75vh] md:h-[75vh] bg-transparent p-0">
      <div className="h-full flex flex-col items-center justify-center gap-8 py-10 px-4 md:px-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

        <Image src={"/images/background.png"} alt="." fill className="-z-10" />

        <h1 className="md:max-w-4xl text-2xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
          Internet Access, Anytime, Anywhere - Only Pay for What You Use.
        </h1>
        <p className="md:max-w-4xl text-lg md:text-2xl text-slate-500">
          Join a network of local Wi-Fi providers and enjoy flexible, on-demand
          internet access - no long-term contracts, no hidden fees.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 md:pt-10">
          <Link href={"/app"}>
            <Button className="rounded-2xl md:text-xl font-medium uppercase py-4 bg-blue-700 text-white hover:bg-blue-900 md:h-14 px-10">
              Get Started Today
            </Button>
          </Link>

          <Link href={"/app"}>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl md:text-xl !font-medium uppercase py-4 md:h-14 px-10 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Become a Provider
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
