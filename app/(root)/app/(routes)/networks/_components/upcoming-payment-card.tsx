"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import useUpcomingEarnings from "@/hooks/db/owner-analytics/use-upcoming-earnings";
import useActiveUser from "@/hooks/db/use-active-user";
import { formatToKES } from "@/lib/utils";
import { useQuery } from "convex/react";
import { CreditCard } from "lucide-react";
import Link from "next/link";

const UpcomingPaymentCard = () => {
  const { activeUser } = useActiveUser();
  const { totalUpcomingEarning } = useUpcomingEarnings();
  const admins = useQuery(api.admins.getAdmins);

  return (
    <Card>
      <CardHeader className="w-full flex-row items-center justify-between">
        <CardTitle className="text-sm">Upcoming</CardTitle>
        <CardDescription>
          <CreditCard size={15} />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col">
        <CardTitle>{formatToKES(totalUpcomingEarning)}</CardTitle>

        {admins &&
          admins.some((admin) => admin.email !== activeUser?.email) && (
            <Link href={"/app/earnings"} className="mt-8 w-fit">
              <Button size={"sm"} variant={"outline"}>
                Check Earnings
              </Button>
            </Link>
          )}
      </CardContent>
    </Card>
  );
};

export default UpcomingPaymentCard;
