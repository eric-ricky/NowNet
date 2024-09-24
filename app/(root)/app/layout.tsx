import Logo from "@/components/brand/logo";
import NewUserComponent from "@/components/global/new-user";
import NotificationFeed from "@/components/global/notification-feed";
import { api } from "@/convex/_generated/api";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import MobileNav from "./_components/mobile-nav";
import Sidebar from "./_components/sidebar";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const MainLayout = async ({ children }: PropsWithChildren) => {
  const user = await currentUser();
  if (!user?.id) redirect("/auth/sign-in");

  // is user in db
  const userData = await client.query(api.users.getUser, {
    email: user.emailAddresses[0].emailAddress,
  });
  if (!userData)
    return (
      <NewUserComponent
        user={{
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName!,
          lastName: user.lastName!,
          imageUrl: user.imageUrl,
          uid: user.id,
        }}
      />
    );

  return (
    <div className="flex h-screen w-full font-inter !overflow-hidden">
      <Sidebar user={userData} />

      <div className="flex flex-col size-full overflow-hidden max-h-screen">
        <div className="border-b border-t px-5 py-5 h-16 flex items-center">
          <div className="flex md:hidden">
            <Logo />
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <NotificationFeed />

            <UserButton />

            <div className="flex md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default MainLayout;
