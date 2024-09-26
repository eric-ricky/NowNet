"use client";

import UserSubscriptionsTable from "@/components/global/user-subscriptions-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import useActiveUser from "@/hooks/db/use-active-user";
import { formatToKES } from "@/lib/utils";
import { useQuery } from "convex/react";
import { CreditCard, Wallet } from "lucide-react";

const HomeContent = () => {
  const { activeUser } = useActiveUser();
  const totalAmountSpent = useQuery(api.subscriptions.getTotalSpentByUser, {
    user: activeUser?._id,
  });

  // active subscriptions
  const subscriptions = useQuery(api.subscriptions.getUsersSubscriptions, {
    user: activeUser?._id,
  });

  return (
    <div className="flex-1 w-full space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] leading-[30px] font-semibold text-gray-900">
          Welcome,
          <span className="text-bankGradient">
            &nbsp;{activeUser?.name || "--"}
          </span>
        </h1>
        <div className="text-[14px] text-gray-600">{activeUser?.email}</div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <Wallet size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToKES(activeUser?.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              current amount in your wallet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToKES(totalAmountSpent)}
            </div>
            <p className="text-xs text-muted-foreground">total amount spent</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Active Connections</CardTitle>
            <CardDescription className="text-xs">
              Manage all your active connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserSubscriptionsTable
              subscriptions={subscriptions || []}
              loading={!subscriptions}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeContent;
