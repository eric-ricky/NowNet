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
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { adminSidebarLinks, sidebarLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { LogIn, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = ({ user }: { user: Doc<"users"> }) => {
  const pathname = usePathname();
  const admins = useQuery(api.admins.getAdmins);

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
                {pathname.includes("/admin") ? (
                  adminSidebarLinks.map((item) => (
                    <MobileNavLinkItem
                      key={item.label}
                      item={item}
                      pathname={pathname}
                      root="/app/admin"
                    />
                  ))
                ) : (
                  <>
                    {sidebarLinks.map((item) => (
                      <MobileNavLinkItem
                        key={item.label}
                        item={item}
                        pathname={pathname}
                        root="/app"
                      />
                    ))}

                    {admins?.find((admin) => admin.email === user.email) && (
                      <Link
                        href={"/app/admin"}
                        className={cn(
                          "flex items-center justify-center xl:justify-start gap-3 p-2 2xl:p-2.5 rounded-lg text-sm hover:bg-slate-100 text-black-2"
                        )}
                      >
                        <LogIn size={20} />

                        <p className="text-sm font-semibold">Admin Login</p>
                      </Link>
                    )}
                  </>
                )}

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

const MobileNavLinkItem = ({
  item,
  pathname,
  root,
}: {
  item: { icon: JSX.Element; route: string; label: string };
  pathname: string;
  root: string;
}) => {
  const isActive =
    pathname === item.route ||
    (item.route !== root && pathname.startsWith(`${item.route}`));

  return (
    <SheetClose asChild key={item.route}>
      <Link
        href={item.route}
        key={item.label}
        className={cn("flex items-center gap-3 p-2 rounded-lg w-full", {
          "bg-bank-gradient text-white": isActive,
          "hover:bg-slate-100 text-black-2": !isActive,
        })}
      >
        {item.icon}
        <p
          className={cn("text-14 font-semibold ", {
            "text-white": isActive,
          })}
        >
          {item.label}
        </p>
      </Link>
    </SheetClose>
  );
};
