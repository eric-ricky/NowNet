"use client";

import SubscriptionsTable from "@/components/global/user-subscriptions-table";
import { Button } from "@/components/ui/button";
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
import { useSubscriptionModal } from "@/hooks/modal-state/use-subscription-modal";
import { containerDivStyles } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { CreditCard, ListChecks, Loader2, Plus } from "lucide-react";

const SubscriptionsPage = () => {
  const { onOpen: onOpenSubscriptionModal, setSubscription } =
    useSubscriptionModal();
  const { activeUser } = useActiveUser();
  const subscriptions = useQuery(api.subscriptions.getUsersSubscriptions, {
    user: activeUser?._id,
  });
  const inActiveSubscriptions = useQuery(
    api.subscriptions.getUsersSubscriptions,
    {
      user: activeUser?._id,
      inActive: true,
    }
  );

  const onNewSubscription = () => {
    setSubscription(undefined);
    onOpenSubscriptionModal();
  };

  return (
    <div className={cn("flex flex-col ", containerDivStyles)}>
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-8">
          <div className="border p-2 rounded-md text-muted-foreground">
            <ListChecks size={18} />
          </div>
          <h2 className="hidden md:flex font-semibold tracking-tight ml-2">
            Subscriptions
          </h2>

          <div className="ml-auto flex items-center space-x-4">
            <Button
              onClick={onNewSubscription}
              size={"sm"}
              variant={"secondary"}
            >
              <Plus size={15} />
              <span className="hidden md:flex ml-1">New</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-x-hidden">
        <Card>
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-lg">Active Subscriptions</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <SubscriptionsTable
              subscriptions={subscriptions || []}
              loading={!subscriptions}
            />
          </CardContent>
        </Card>

        <Separator className="my-2" />

        <Card className="opacity-55">
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-lg">Past Subscriptions</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            {!inActiveSubscriptions ? (
              <Loader2 size={20} className="animate-spin" />
            ) : !!inActiveSubscriptions.length ? (
              <SubscriptionsTable
                subscriptions={inActiveSubscriptions || []}
                loading={!inActiveSubscriptions}
                className="opacity-55"
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                No past subscriptions found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
