import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-20 text-center px-4 md:px-0">
      <div className="max-w-screen-md mx-auto rounded-xl h-full flex flex-col items-center justify-center gap-8 py-20 px-4 md:px-20 text-center relative overflow-hidden text-slate-200">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

        <h2 className="text-xl md:text-3xl font-bold">
          Ready to Join the Nownet Community?
        </h2>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={"/app"}>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Connected Now
            </Button>
          </Link>

          <Link href={"/app"}>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Start Earning Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
