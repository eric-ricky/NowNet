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
  const transancations = useQuery(api.transactions.getWidthrawalTransactions, {
    adminEmail: activeUser?.email!,
  });

  console.log("TRANSANCTIONS ====>", transancations);

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
          widthrawalRequests={transancations || []}
          loading={!transancations}
        />
      </CardContent>
    </Card>
  );
};

export default AdminWidthrawalRequestCard;
