import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Logo = ({
  className,
  isMobile,
}: {
  className?: string;
  isMobile?: boolean;
}) => {
  return (
    <Link href="/app" className={cn("flex items-center gap-2", className)}>
      {/* <CloudCog size={28} className="text-black-1 mt-1.5" /> */}

      <Image
        src={"/images/logo.jpg"}
        alt="."
        width={32}
        height={32}
        className=""
      />

      <span
        className={cn(
          "2xl:text-2xl font-bold font-ibm-plex-serif text-black-1 max-xl:hidden",
          { "max-xl:flex": isMobile }
        )}
      >
        NowneT.
      </span>
    </Link>
  );
};

export default Logo;
