"use client";

import AdminEarningsTable from "@/components/global/admin-earnings-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import useActiveUser from "@/hooks/db/use-active-user";
import { useQuery } from "convex/react";

const AdminWifisEarningsCard = ({ isUpcoming }: { isUpcoming: boolean }) => {
  const { activeUser } = useActiveUser();
  const upcomingEarnings = useQuery(api.earnings.getAllEarningsAdmin, {
    adminEmail: activeUser?.email,
    isUpcoming,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">
            {isUpcoming ? "Upcoming" : "Past"} Earnings
          </CardTitle>
          <CardDescription className="text-xs">
            {isUpcoming ? "Upcoming" : "Past"} earnings for wifi owners
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <AdminEarningsTable
          earnings={upcomingEarnings || []}
          loading={!upcomingEarnings}
        />
      </CardContent>
    </Card>
  );
};

export default AdminWifisEarningsCard;
