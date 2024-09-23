"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useNetworkModal } from "@/hooks/modal-state/use-network-modal";
import { useQuery } from "convex/react";
import { Loader2, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const RightSidebar = ({ user }: { user: Doc<"users"> }) => {
  const wifiNetworks = useQuery(api.wifis.getOwnersWifis, {
    owner: user._id,
  });
  const { onOpen, setNetwork } = useNetworkModal();

  const onOpenNetworkModal = () => {
    setNetwork(undefined);
    onOpen();
  };

  return (
    <aside className="hidden xl:flex flex-col h-screen max-h-screen w-[355px] border-l border-gray-200 xl:overflow-y-scroll no-scrollbar">
      <section className="flex flex-col pb-8">
        <div className="h-[120px] w-full bg-gradient-mesh bg-cover bg-no-repeat" />
        <div className="relative flex flex-col px-4">
          <div className="absolute -top-8 flex items-center justify-center w-24 h-24 rounded-full border-8 border-white">
            <Avatar className="w-full h-full">
              <AvatarImage
                src={user.avatarUrl || "https://github.com/shadcn.png"}
                alt="@shadcn"
              />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col mt-20">
            <p className="text-[24px] leading-[30px] font-bold text-gray-900">
              {user.name}
            </p>
            <p className="font-normal text-gray-600">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My Networks</h2>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={onOpenNetworkModal}
            className="flex items-center"
          >
            <Plus size={20} className="mr-1" />
            New Wifi
          </Button>
        </div>

        <div className="flex flex-col py-5">
          <div className="hidden p-16 last:grid place-items-center">
            <span>No Network Found</span>
          </div>

          {!wifiNetworks && (
            <div className="hidden p-16 last:grid place-items-center">
              <Loader2 size={20} className="animate-spin" />
            </div>
          )}

          {wifiNetworks &&
            wifiNetworks.map((wifi, i) => (
              <Link
                key={i}
                href={`/app/networks/${wifi._id}`}
                className="flex items-center px-1 py-2 bg-slate-100/0 rounded-md text-sm border-b-2"
              >
                <span className="max-w-[200px] truncate">{wifi.name}</span>

                <MoreHorizontal className="h-4 w-4 ml-auto" />
              </Link>
            ))}
        </div>
      </section>
    </aside>
  );
};

export default RightSidebar;
