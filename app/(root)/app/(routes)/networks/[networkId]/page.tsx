"use client";

import NetworkSubscriptionsTable from "@/components/global/network-subscriptions-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import useActiveUser from "@/hooks/db/use-active-user";
import { containerDivStyles } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { ChevronLeft, CreditCard, Loader2, TriangleAlert } from "lucide-react";
import Link from "next/link";
import UpcomingPaymentCard from "../_components/upcoming-payment-card";

const NetworkDetailsPage = ({ params }: { params: { networkId: string } }) => {
  const { activeUser } = useActiveUser();
  const wifi = useQuery(api.wifis.getWifiById, {
    wifiId: params.networkId,
    userId: activeUser?._id,
  });
  const subscriptions = useQuery(api.subscriptions.getWifisSubscriptions, {
    wifi: wifi?._id,
  });

  return (
    <div className={cn("flex flex-col max-h-screen", containerDivStyles)}>
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-8">
          <Link
            href={"/app/networks"}
            className="border p-2 rounded-md text-muted-foreground flex items-center text-sm"
          >
            <ChevronLeft size={18} className="mr-1" /> Back
          </Link>
          <h2 className="hidden md:flex font-semibold tracking-tight ml-4">
            {wifi?.name || "--"}
          </h2>
        </div>
      </div>

      <div className="w-full h-[50vh] hidden last:grid place-items-center">
        <Loader2 size={40} className="animate-spin" />
      </div>

      {wifi === null && (
        <div className="p-10 flex items-center gap-2">
          <TriangleAlert size={20} />
          Nothing authorized to view this conent
        </div>
      )}

      {wifi && (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-x-hidden overflow-y-scroll">
          <UpcomingPaymentCard />

          <Card>
            <CardHeader className="w-full flex-row items-center justify-between">
              <CardTitle className="text-lg">Active Subscriptions</CardTitle>
              <CardDescription>
                <CreditCard size={15} />
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col">
              <NetworkSubscriptionsTable
                subscriptions={subscriptions || []}
                loading={!subscriptions}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NetworkDetailsPage;
