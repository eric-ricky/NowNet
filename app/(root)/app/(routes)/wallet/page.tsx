"use client";

import PaymentTopupButton from "@/components/global/payment-button/topup";
import UserTransactionHistory from "@/components/global/user-transaction-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useUserTotalSpent from "@/hooks/db/user-analytics/use-user-total-spent";
import { containerDivStyles } from "@/lib/data";
import { cn, formatToKES } from "@/lib/utils";
import { ArrowUp, CreditCard, Wallet } from "lucide-react";

const WalletPage = () => {
  const { totalAmountSpent, userBalance } = useUserTotalSpent();

  return (
    <div className={cn(containerDivStyles)}>
      <div className="border-b border-t">
        <div className="flex h-16 items-center px-4 md:px-8">
          <div className="border p-2 rounded-md text-muted-foreground">
            <Wallet size={18} />
          </div>
          <h2 className="hidden md:flex font-semibold tracking-tight ml-2">
            My Account Balance
          </h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 p-4 md:p-8 md:max-w-[1000px] pb-72">
        <div className="flex flex-col md:flex-row md:items-center  w-full gap-4">
          <Card className="sm:h-[240px] h-fit md:w-[500px] w-full bg-slate-100">
            <CardHeader className="text-center w-full">
              <CardTitle>{formatToKES(userBalance)}</CardTitle>
              <CardDescription>Your current balance</CardDescription>
            </CardHeader>

            <CardFooter className="max-w-[380px] mx-auto flex flex-col gap-4 md:p-0">
              <PaymentTopupButton />
            </CardFooter>
          </Card>

          <Card className="sm:h-[240px] h-fit md:w-[500px] w-full flex flex-col">
            <CardHeader className="w-full flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Spent</CardTitle>
              <CardDescription>
                <CreditCard size={15} />
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4 justify-end ">
              <CardTitle>{formatToKES(totalAmountSpent)}</CardTitle>
              <div className="flex items-center gap-1">
                <p className="text-green flex items-center text-sm text-green-500">
                  <ArrowUp size={10} className="text-green-500" /> Total
                </p>
                <p className="text-sm text-muted-foreground">amount spent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <UserTransactionHistory type="DEPOSIT" />
      </div>
    </div>
  );
};

export default WalletPage;
