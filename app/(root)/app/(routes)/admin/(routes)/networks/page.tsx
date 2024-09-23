"use client";

import NetworksTable from "@/components/global/networks-table";
import { api } from "@/convex/_generated/api";
import useActiveUser from "@/hooks/db/use-active-user";
import { useQuery } from "convex/react";
import { Wifi } from "lucide-react";

const NetworksPage = () => {
  const { activeUser } = useActiveUser();
  const wifiNetworks = useQuery(api.wifis.getAdminWifis, {
    adminEmail: activeUser?.email,
  });

  return (
    <div className="flex flex-col">
      <div className="border-b border-t">
        <div className="flex h-16 items-center px-4 md:px-8">
          <div className="border p-2 rounded-md text-muted-foreground">
            <Wifi size={18} />
          </div>
          <h2 className="hidden md:flex font-semibold tracking-tight ml-2">
            Wifi Networks
          </h2>

          <div className="ml-auto flex items-center space-x-4"></div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-x-hidden">
        <NetworksTable networks={wifiNetworks || []} loading={!wifiNetworks} />
      </div>
    </div>
  );
};

export default NetworksPage;
