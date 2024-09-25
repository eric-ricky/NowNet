"use client";

import NetworksTable from "@/components/global/networks-table";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import useActiveUser from "@/hooks/db/use-active-user";
import { useNetworkModal } from "@/hooks/modal-state/use-network-modal";
import { containerDivStyles } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Plus, Wifi } from "lucide-react";

const NetworksPage = () => {
  const { onOpen: onOpenNetworkModal, setNetwork } = useNetworkModal();
  const { activeUser } = useActiveUser();
  const wifiNetworks = useQuery(api.wifis.getOwnersWifis, {
    owner: activeUser?._id,
  });

  // const devices = useQuery(api.devices.getUsersDevices, {
  //     user: activeUser?._id,
  //   });

  const onNewNetwork = () => {
    setNetwork(undefined);
    onOpenNetworkModal();
  };

  return (
    <div className={cn(containerDivStyles)}>
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-8">
          <div className="border p-2 rounded-md text-muted-foreground">
            <Wifi size={18} />
          </div>
          <h2 className="hidden md:flex font-semibold tracking-tight ml-2">
            My Networks
          </h2>

          <div className="ml-auto flex items-center space-x-4">
            <Button onClick={onNewNetwork} size={"sm"} variant={"secondary"}>
              <Plus size={15} />
              <span className="hidden md:flex ml-1">New</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-x-hidden">
        <NetworksTable networks={wifiNetworks || []} loading={!wifiNetworks} />
      </div>
    </div>
  );
};

export default NetworksPage;
