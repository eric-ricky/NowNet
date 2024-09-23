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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTotalPaidOut from "@/hooks/db/use-total-paid-out";
import useUpcomingEarnings from "@/hooks/db/use-upcoming-earnings";
import { cn, formatToKES, getNextPaymentDate } from "@/lib/utils";
import {
  ArrowUp,
  Banknote,
  CreditCard,
  Loader2,
  Search,
  SquareChartGantt,
} from "lucide-react";

const PaymentsPage = () => {
  const { upcomingEarning } = useUpcomingEarnings();
  const { totalEarning } = useTotalPaidOut();

  return (
    <div className="flex flex-col">
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
        <Card className={cn("min-w-]")}>
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Paid Out</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{formatToKES(totalEarning)}</CardTitle>

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

        <Card className={cn("min-w-[0")}>
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Upcoming</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{formatToKES(upcomingEarning)}</CardTitle>

            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">upcoming on </p>
              <p className="text-green flex items-center text-sm text-green-500">
                {" "}
                {getNextPaymentDate(new Date()).toDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-2 grid gap-4 grid-cols-1">
          <Tabs defaultValue="upcoming">
            <div className="flex items-center px-4 py-2">
              <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
                <SquareChartGantt />
              </div>

              <TabsList className="ml-auto">
                <TabsTrigger
                  value="upcoming"
                  className="text-zinc-600 dark:text-zinc-200"
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

            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-8"
                    // value={queryTemp || ""}
                    // onChange={(e) => setQueryTemp(e.target.value)}
                  />
                </div>
              </form>
            </div>

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

          {/* <Card>
            <CardHeader>
              <CardTitle className="text-xl">Widthrawal Requests</CardTitle>
              <CardDescription className="text-xs">
                Manage all your active connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminWidthrawalRequestTable
                widthrawalRequests={[]}
                loading={false}
              />
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
