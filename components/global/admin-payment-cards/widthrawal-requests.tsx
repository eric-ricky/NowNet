"use client";

import AdminWidthrawalRequestTable from "@/components/global/admin-widthrawal-requests-table";
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

const AdminWidthrawalRequestCard = () => {
  const { activeUser } = useActiveUser();
  const widthrawalRequests = useQuery(
    api.widthrawaltransactions.getAllWidthrawalTransactionRequests,
    {
      userId: activeUser?._id,
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Widthrawal Requests</CardTitle>
        <CardDescription className="text-xs">
          Manage all your active connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminWidthrawalRequestTable
          widthrawalRequests={widthrawalRequests || []}
          loading={!widthrawalRequests}
        />
      </CardContent>
    </Card>
  );
};

export default AdminWidthrawalRequestCard;
