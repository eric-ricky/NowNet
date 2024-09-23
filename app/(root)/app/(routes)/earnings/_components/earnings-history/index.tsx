"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useActiveUser from "@/hooks/db/use-active-user";
import { useQuery } from "convex/react";
import EarningsTable from "./table";

const EarningsHistory = () => {
  const { activeUser } = useActiveUser();
  const allOwnersEarnings = useQuery(api.earnings.getAllOwnersEarnings, {
    owner: activeUser?._id as Id<"users">,
  });

  return (
    <div className="col-span-2 grid gap-4 grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">My Earnings</CardTitle>
          <CardDescription className="text-xs">
            See all your earnings, upcoming and past earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EarningsTable
            earnings={allOwnersEarnings || []}
            loading={!allOwnersEarnings}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsHistory;
