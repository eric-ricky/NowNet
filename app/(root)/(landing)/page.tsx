import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Fira_Code } from "next/font/google";
import Link from "next/link";

const font = Fira_Code({ subsets: ["latin"] });

const LandingPage = () => {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className={cn(
              "text-3xl font-extrabold sm:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500 uppercase",
              font.className
            )}
          >
            Connect to Wi-Fi Anywhere,Anytime
          </h1>

          <p className="mt-8 sm:text-xl/relaxed text-slate-400">
            Stay connected wherever you are with fast, reliable Wi-Fi networks
            around you.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={"/app"}>
              <Button className="rounded-2xl text-xl uppercase py-4 bg-slate-100 text-black-1 hover:bg-slate-200 h-14 px-10">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
