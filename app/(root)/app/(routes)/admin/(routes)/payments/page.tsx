"use client";

import AdminWidthrawalRequestCard from "@/components/global/admin-payment-cards/widthrawal-requests";
import AdminWifisEarningsCard from "@/components/global/admin-payment-cards/wifi-earnings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTotalPaidOut from "@/hooks/db/admin-analytics/use-total-paid-out";
import useUpcomingPayouts from "@/hooks/db/admin-analytics/use-upcoming-payouts";
import useWidthrawalRequestsStats from "@/hooks/db/admin-analytics/use-widthrawal-requests-stats";
import { containerDivStyles } from "@/lib/data";
import { cn, formatToKES, getNextPaymentDate } from "@/lib/utils";
import {
  ArrowUp,
  Banknote,
  CreditCard,
  Loader2,
  SquareChartGantt,
} from "lucide-react";

const PaymentsPage = () => {
  const { upcomingPayouts } = useUpcomingPayouts();
  const { totalPaidOut } = useTotalPaidOut();
  const { totalWidthrawn, totalUpcomingWidthrawal, totalWidthrawalTC } =
    useWidthrawalRequestsStats();

  return (
    <div className={cn(containerDivStyles)}>
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-8">
          <div className="border p-2 rounded-md text-muted-foreground">
            <Banknote size={18} />
          </div>
          <h2 className="hidden md:flex font-semibold text-16 ml-2">
            Payments
          </h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:p-8 pt-6 overflow-x-hidden">
        {/* total paid out */}
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Payouts</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{formatToKES(totalPaidOut)}</CardTitle>

            <div className="flex items-center">
              <p className="text-green flex items-center text-sm text-green-500">
                <ArrowUp size={10} className="text-green-500" />
              </p>
              <p className="text-sm text-muted-foreground">
                {" "}
                from past earnings
              </p>
            </div>
          </CardContent>
        </Card>

        {/* upcoming payouts */}
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Upcoming Payouts</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{formatToKES(upcomingPayouts)}</CardTitle>

            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">upcoming on </p>
              <p className="text-green flex items-center text-sm text-green-500">
                {" "}
                {getNextPaymentDate(new Date()).toDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* total widthrawn */}
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Widthrawn</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{formatToKES(totalWidthrawn)}</CardTitle>

            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">
                total real amount sent to users{" "}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* pending widthrawal */}
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Upcoming Widthrawal</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{formatToKES(totalUpcomingWidthrawal)}</CardTitle>

            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">
                total amount to be sent to users
              </p>
            </div>
          </CardContent>
        </Card>

        {/* transaction cost */}
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Widthrawal TC</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{formatToKES(totalWidthrawalTC)}</CardTitle>

            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">
                Widthrawal transaction cost
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-2 grid gap-4 grid-cols-1">
          <Tabs defaultValue="upcoming">
            <div className="flex items-center flex-col sm:flex-row px-4 py-2 h-28">
              <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
                <SquareChartGantt />
              </div>

              <TabsList className="ml-auto flex-wrap">
                <TabsTrigger
                  value="upcoming"
                  className="text-zinc-600 dark:text-zinc-200 p-2"
                >
                  Upcoming Earnings
                </TabsTrigger>

                <TabsTrigger
                  value="past"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Past Earnings
                </TabsTrigger>

                <TabsTrigger
                  value="widthrawal"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Widthrawal Requests
                </TabsTrigger>
              </TabsList>
            </div>

            <Separator />

            <TabsContent
              value="widthrawal"
              className="m-0 px-4 h-screen overflow-y-scroll scrollbar-thin"
            >
              <Loader2 className="animate-spin hidden last:flex" />

              <AdminWidthrawalRequestCard />
            </TabsContent>

            <TabsContent
              value="upcoming"
              className="m-0 px-4 h-screen overflow-y-scroll scrollbar-thin"
            >
              <AdminWifisEarningsCard isUpcoming={true} />
            </TabsContent>

            <TabsContent
              value="past"
              className="m-0 px-4 h-screen overflow-y-scroll scrollbar-thin"
            >
              <AdminWifisEarningsCard isUpcoming={false} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="h-[20vh]"></div>
    </div>
  );
};

export default PaymentsPage;
