"use client";

import useUserTransactionHistory from "@/hooks/db/user-analytics/use-user-transaction-history";
import { cn, formatToKES } from "@/lib/utils";
import { Dot, Store } from "lucide-react";
import moment from "moment";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const UserTransactionHistory = () => {
  const { transanctions: transanctionHistory } = useUserTransactionHistory();

  if (transanctionHistory && !transanctionHistory.length) return null;

  return (
    <Card className="w-full">
      <CardHeader className="p-2.5 md:p-4">
        <CardTitle className="text-base md:text-xl">
          Transaction History
        </CardTitle>
        <CardDescription className="text-xs">
          Manage all your active connections
        </CardDescription>
      </CardHeader>

      <CardContent className="gap-2 p-2 md:p-4">
        {!transanctionHistory &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 rounded-md border border-slate-100 p-2 md:p-4"
            >
              <Skeleton className="rounded-full w-10 h-10" />
              <div className="flex-1 space-y-1">
                <Skeleton className="w-44 h-2.5" />
                <Skeleton className="w-56 h-2" />
              </div>

              <div className="flex flex-col items-end gap-1">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-14 h-2" />
              </div>
            </div>
          ))}

        {transanctionHistory &&
          transanctionHistory.map((t) => (
            <div
              key={t._id}
              className="flex items-center space-x-4 rounded-md border p-2 md:p-4"
            >
              <div className="bg-blue-700 text-slate-50 w-10 h-10 rounded-full grid place-items-center">
                <Store size={20} />
              </div>
              <div className="flex-1 space-y-1">
                <p className={"text-sm  font-bold leading-none text-blue-900 "}>
                  {t.type}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground flex items-center">
                  {moment(t._creationTime).format("ddd, MMM DD")}
                  <Dot size={10} />

                  <span>MPESA</span>
                </p>
              </div>

              <div className="flex flex-col items-end">
                <div
                  className={cn(
                    "font-semibold text-sm ",
                    t.type === "DEPOSIT" ? "text-slate-800" : "text-red-500"
                  )}
                >
                  {t.type === "DEPOSIT" ? "+" : "-"}
                  {formatToKES(+t.amount)}
                </div>
                <Badge
                  variant={
                    t.status === "COMPLETED"
                      ? "connected"
                      : t.status === "PENDING"
                        ? "pending"
                        : "default"
                  }
                  className="text-xs w-fit px-2"
                >
                  {t.status}
                </Badge>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default UserTransactionHistory;
