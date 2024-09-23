"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatToKES, getNextPaymentDate } from "@/lib/utils";
import { ArrowUp, CreditCard } from "lucide-react";

const AdminPage = () => {
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
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <PackageCheck size={15} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              20
            </div>
            <p className="text-xs text-muted-foreground">+% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package size={15} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              
              20
            </div>
            <p className="text-xs text-muted-foreground">stock in hand</p>
          </CardContent>
        </Card>
        <Card className="hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
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
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className="text-sm">KES</span>
              20,000.00
            </div>
            <p className="text-xs text-muted-foreground">% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock in Use</CardTitle>
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
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card> */}

        <Card className={cn("")}>
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Earnings</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{formatToKES(0)}</CardTitle>

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

        <Card className={cn("")}>
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="text-sm">Upcoming</CardTitle>
            <CardDescription>
              <CreditCard size={15} />
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col">
            <CardTitle>{formatToKES(0)}</CardTitle>

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
    </div>
  );
};

export default AdminPage;
