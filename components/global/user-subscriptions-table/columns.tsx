import CustomTooltip from "@/components/global/custom-tooltip";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Doc } from "@/convex/_generated/dataModel";
import { ISubscriptionsData, subscriptionStatus } from "@/lib/types";
import { cn, formatToKES } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Infer } from "convex/values";
import { Wifi } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { DataTableRowActions } from "./row-actions";

export const columns: ColumnDef<ISubscriptionsData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "wifi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wifi Network" />
    ),
    cell: ({ row }) => {
      const wifi = row.getValue("wifi") as Doc<"wifis">;
      return (
        <div className="flex space-x-2 cursor-pointer">
          <Wifi size={20} className="" />
          <CustomTooltip tip={wifi.name}>
            <span className="max-w-[200px] truncate font-medium">
              {wifi.name}
            </span>
          </CustomTooltip>
        </div>
      );
    },
  },
  {
    accessorKey: "device",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Device" />
    ),
    cell: ({ row }) => {
      const device = row.getValue("device") as Doc<"devices">;
      return (
        <div className="flex space-x-2 cursor-pointer">
          <Image
            src={"/images/img_holder.png"}
            alt=""
            width={20}
            height={20}
            className=""
          />
          <CustomTooltip tip={device.name}>
            <span className="max-w-[200px] truncate font-medium">
              {device.name}
            </span>
          </CustomTooltip>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as Infer<typeof subscriptionStatus>;
      return (
        <div className="flex space-x-2">
          <Badge variant={status}>{status}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => {
      const startTime = new Date(row.getValue("startTime")) as Date;

      return (
        <div className="whitespace-nowrap px-4 py-2 text-gray-700">
          <span className="ml-2">
            {moment(startTime).format("MMM DD YYYY, h:mm a")}
            {" ~ "}
            {moment(startTime).fromNow()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Time" />
    ),
    cell: ({ row }) => {
      const rowEndTime = row.getValue("endTime") as string;

      return (
        <div className="whitespace-nowrap px-4 py-2 text-gray-700">
          {rowEndTime ? (
            <>
              {moment(row.getValue("createdAt")).format("DD MMM YY, hh:mm a")}
            </>
          ) : (
            "--"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap px-4 py-2 text-gray-700">
        {moment(row.getValue("createdAt")).format("DD MMM YYYY")}
      </div>
    ),
  },
  {
    accessorKey: "amountConsumed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amountConsumed = row.getValue("amountConsumed") as number;
      return (
        <div className="flex space-x-2 cursor-pointer">
          <span className="max-w-[200px] truncate font-medium">
            {formatToKES(amountConsumed)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <div className="flex space-x-2">
          <div
            className={cn("w-4 h-4 rounded-full bg-slate-400", {
              "bg-green-500": isActive,
            })}
          ></div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
