"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useTotalCommission from "@/hooks/db/admin-analytics/use-total-commission";
import useTotalNetworks from "@/hooks/db/admin-analytics/use-total-networks";
import useTotalPaidOut from "@/hooks/db/admin-analytics/use-total-paid-out";
import useTotalUsers from "@/hooks/db/admin-analytics/use-total-users";
import useUpcomingCommission from "@/hooks/db/admin-analytics/use-upcoming-commission";
import useUpcomingPayouts from "@/hooks/db/admin-analytics/use-upcoming-payouts";
import { formatToKES, getNextPaymentDate } from "@/lib/utils";
import { ArrowUp, CreditCard, Users, Wifi } from "lucide-react";

/**
 * Analytics
 * total commission
 * upcoming commission
 *
 * total users
 * total networks
 * active subscriptions
 *
 * total paid
 * upcoming payments
 * @returns
 */
const AdminPage = () => {
  const { totalUsers } = useTotalUsers();
  const { totalNetworks } = useTotalNetworks();
  const { totalCommission } = useTotalCommission();
  const { upcomingCommission } = useUpcomingCommission();
  const { totalPaidOut } = useTotalPaidOut();
  const { upcomingPayouts } = useUpcomingPayouts();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] leading-[30px] font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-[14px] text-gray-600">
          Manage accounts, payments, networks and more in one place.
        </p>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* total users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users size={15} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total users</p>
          </CardContent>
        </Card>

        {/* total networks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Networks
            </CardTitle>
            <Wifi size={15} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNetworks}</div>
            <p className="text-xs text-muted-foreground">all wifi networks </p>
          </CardContent>
        </Card>

        {/* total commission */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Commission
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToKES(totalCommission)}
            </div>
            <p className="text-xs text-muted-foreground">
              total commission earned
            </p>
          </CardContent>
        </Card>

        {/* upcoming commission */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Commission
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToKES(upcomingCommission)}
            </div>
            <p className="text-xs text-muted-foreground">
              total commission earned
            </p>
          </CardContent>
        </Card>

        {/* total paidout */}
        <Card>
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Paid Out</CardTitle>
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

        {/* upcoming payout */}
        <Card>
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
      </div>

      <div className="h-[20vh]"></div>
    </div>
  );
};

export default AdminPage;
