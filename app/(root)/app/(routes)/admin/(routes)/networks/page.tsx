"use client";

import NetworksTable from "@/components/global/networks-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import useActiveSubscriptions from "@/hooks/db/admin-analytics/use-active-subscriptions";
import useTotalNetworks from "@/hooks/db/admin-analytics/use-total-networks";
import useActiveUser from "@/hooks/db/use-active-user";
import { useQuery } from "convex/react";
import { Wifi } from "lucide-react";

const NetworksPage = () => {
  const { activeUser } = useActiveUser();
  const wifiNetworks = useQuery(api.wifis.getAllWifisAdmin, {
    adminEmail: activeUser?.email,
  });
  const { totalNetworks } = useTotalNetworks();
  const { activeSubscriptions } = useActiveSubscriptions();

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

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:p-8 pt-6 overflow-x-hidden">
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Networks</CardTitle>
            <CardDescription>
              <Wifi size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{totalNetworks}</CardTitle>

            <div className="flex items-center">
              <p className="text-sm text-muted-foreground">
                total active networks
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Active Subscription</CardTitle>
            <CardDescription>
              <Wifi size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{activeSubscriptions}</CardTitle>

            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">
                active subscriptions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-x-hidden">
        <NetworksTable networks={wifiNetworks || []} loading={!wifiNetworks} />
      </div>

      <div className="h-[20vh]"></div>
    </div>
  );
};

export default NetworksPage;
