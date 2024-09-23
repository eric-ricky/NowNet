import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="py-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href={"/"}
          className="text-white font-ibm-plex-serif text-2xl font-bold tracking-[0.2em]"
        >
          NowneT.
        </Link>

        <div className="">
          <Link href={"/app"}>
            <Button className="uppercase bg-transparent md:bg-slate-100 hover:bg-slate-200 tracking-tight font-semibold px-0 md:px-8 text-slate-100 md:text-black-1">
              <span className="hidden md:flex">Sign In</span>
              <LogIn className="flex md:hidden" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
