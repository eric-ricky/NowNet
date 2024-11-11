import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="h-20 flex items-stretch justify-center py-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between flex-1 px-4 md:px-0">
        <Link
          href={"/"}
          className="font-ibm-plex-serif text-2xl font-bold tracking-[0.2em]"
        >
          NowneT.
        </Link>

        <div className="">
          <Link href={"/app"}>
            <Button className="uppercase bg-transparent md:bg-slate-100 hover:bg-slate-200 tracking-tight font-semibold px-0 md:px-8 text-black-1">
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
