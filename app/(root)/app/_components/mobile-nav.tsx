"use client";

import Logo from "@/components/brand/logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>

        <SheetContent
          side={"left"}
          aria-describedby="mobile bar"
          className="border-none bg-white"
        >
          <SheetTitle className="p-0">
            <Logo isMobile className="opacity-" />
          </SheetTitle>

          <SheetDescription className="hidden">
            mobile nav description
          </SheetDescription>

          <div className="flex flex-col justify-between overflow-y-auto h-[calc(100vh-72px)] p-0">
            <SheetClose asChild>
              <nav className="flex flex-col gap-6 pt-8 h-full">
                {sidebarLinks.map((item) => {
                  const isActive =
                    pathname === item.route ||
                    (item.route !== "/app" &&
                      pathname.startsWith(`${item.route}`));

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg w-full",
                          {
                            "bg-bank-gradient text-white": isActive,
                            "hover:bg-slate-100 text-black-2": !isActive,
                          }
                        )}
                      >
                        {item.icon}
                        <p
                          className={cn("text-16 font-semibold ", {
                            "text-white": isActive,
                          })}
                        >
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}

                <SheetClose asChild>
                  <div
                    role="button"
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg max-w-60 w-full text-black-2 hover:bg-bank-gradient hover:text-white"
                    )}
                  >
                    <LogOut />
                    <span
                      className={cn("text-16 font-semibold ", {
                        // "text-white": isActive,
                      })}
                    >
                      Logout
                    </span>
                  </div>
                </SheetClose>
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
