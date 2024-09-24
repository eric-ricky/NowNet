import RightSidebar from "@/components/sections/right-sidebar";
import { api } from "@/convex/_generated/api";
import { containerDivStyles } from "@/lib/data";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import HomeContent from "./_components/sections/home-content";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const HomePage = async () => {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in");

  const userData = await client.query(api.users.getUser, {
    email: user.emailAddresses[0].emailAddress,
  });
  if (!userData)
    return (
      <div className="h-screen w-full grid place-items-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className={cn("w-full flex flex-row", containerDivStyles)}>
      <HomeContent />
      <RightSidebar user={userData} />
    </div>
  );
};

export default HomePage;
