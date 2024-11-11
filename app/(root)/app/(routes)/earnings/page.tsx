"use client";

import PaymentWidthrawButton from "@/components/global/payment-button/widthraw";
import UserTransactionHistory from "@/components/global/user-transaction-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useTotalEarnings from "@/hooks/db/owner-analytics/use-total-earnings";
import useUpcomingEarnings from "@/hooks/db/owner-analytics/use-upcoming-earnings";
import useActiveUser from "@/hooks/db/use-active-user";
import { containerDivStyles } from "@/lib/data";
import { cn, formatToKES, getNextPaymentDate } from "@/lib/utils";
import { ArrowUp, Banknote, CreditCard } from "lucide-react";
import EarningsHistory from "./_components/earnings-history";

const EarningsPage = () => {
  const { activeUser } = useActiveUser();
  const { totalUpcomingEarning } = useUpcomingEarnings();
  const { totalEarning } = useTotalEarnings();

  return (
    <div className={cn(containerDivStyles)}>
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-8">
          <div className="border p-2 rounded-md text-muted-foreground">
            <Banknote size={18} />
          </div>
          <h2 className="hidden md:flex font-semibold text-16 ml-2">
            Earnings
          </h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:p-8 pt-6 overflow-x-hidden">
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Current Earnings</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex items-center justify-between">
            <div className="flex flex-col">
              <CardTitle>
                {activeUser?.earnings !== undefined
                  ? formatToKES(activeUser.earnings)
                  : "--"}
              </CardTitle>

              <div className="flex items-center">
                <p className="text-green flex items-center text-sm text-green-500">
                  <ArrowUp size={10} className="text-green-500" />
                </p>
                <p className="text-sm text-muted-foreground">
                  {" "}
                  from past earnings
                </p>
              </div>
            </div>

            {/* widthraw earnings button */}

            <PaymentWidthrawButton />
          </CardContent>
        </Card>

        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Upcoming</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{formatToKES(totalUpcomingEarning)}</CardTitle>

            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">upcoming on </p>
              <p className="text-green flex items-center text-sm text-green-500">
                {" "}
                {getNextPaymentDate(new Date()).toDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <UserTransactionHistory type="WITHDRAWAL" className="col-span-2" />

        <EarningsHistory />
      </div>

      <div className="h-[20vh]"></div>
    </div>
  );
};

export default EarningsPage;
