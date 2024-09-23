"use client";

import Logo from "@/components/brand/logo";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useAdminAuthModal } from "@/hooks/modal-state/use-admin-auth-modal";
import { adminSidebarLinks, sidebarLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = ({ user }: { user: Doc<"users"> }) => {
  const pathname = usePathname();
  const { isOpen: isAdminAuthModalOpen } = useAdminAuthModal();
  const admins = useQuery(api.admins.getAdmins);

  return (
    <section
      className={cn(
        "sticky left-0 top-0 h-screen w-fit flex flex-col justify-between border-r border-gray-200 bg-white pt-8 sm:p-4 xl:p-6 2xl:w-[355px] max-md:hidden",
        { "blur-sm": isAdminAuthModalOpen }
      )}
    >
      <nav className="h-full flex flex-col gap-4">
        <Logo />

        <div className="flex-1 border-t-2 flex flex-col gap-4 pt-10">
          {pathname.includes("/admin") ? (
            adminSidebarLinks.map((item) => (
              <LinkItem
                key={item.label}
                item={item}
                pathname={pathname}
                root="/app/admin"
              />
            ))
          ) : (
            <>
              {sidebarLinks.map((item) => (
                <LinkItem
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

                  <p className="text-sm font-semibold max-xl:hidden">
                    Admin Login
                  </p>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col 2xl:flex-row items-center gap-2">
          <UserButton />

          <div className={cn("max-xl:hidden flex-1")}>
            <p className="text-sm truncate text-gray-700 font-semibold">
              {user.name}
            </p>
            <p className="text-xs truncate font-normal text-gray-600 ">
              {user.email}
            </p>
          </div>

          <div role="button" className="p-2">
            <SignOutButton>
              <LogOut />
            </SignOutButton>
          </div>
        </div>
      </nav>
    </section>
  );
};

export default Sidebar;

const LinkItem = ({
  item,
  pathname,
  root,
}: {
  root: string;
  pathname: string;
  item: { icon: React.JSX.Element; route: string; label: string };
}) => {
  const isActive =
    pathname === item.route ||
    (item.route !== root && pathname.startsWith(`${item.route}`));

  return (
    <Link
      key={item.label}
      href={item.route}
      className={cn(
        "flex items-center justify-center xl:justify-start gap-3 p-2 2xl:p-2.5 rounded-lg text-sm",
        {
          "bg-bank-gradient text-white font-semibold": isActive,
          "hover:bg-slate-100 text-black": !isActive,
        }
      )}
    >
      <div className="text-sm">{item.icon}</div>

      <p className="max-xl:hidden">{item.label}</p>
    </Link>
  );
};
