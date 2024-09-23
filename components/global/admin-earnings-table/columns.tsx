import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Doc } from "@/convex/_generated/dataModel";
import { IEarningsData } from "@/lib/types";
import { formatToKES } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { DataTableRowActions } from "./row-actions";

// const d:IEarningsData = {
//   _creationTime,_id,amountEarned,isUpcoming,owner,weekEnding,wifi
// }

export const columns: ColumnDef<IEarningsData>[] = [
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
      <DataTableColumnHeader column={column} title="Wifi" />
    ),
    cell: ({ row }) => {
      const wifi = row.getValue("wifi") as Doc<"wifis">;

      return (
        <div className="flex space-x-2 cursor-pointer">
          <span className="max-w-[200px] truncate font-medium">
            {wifi.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => {
      const owner = row.getValue("owner") as Doc<"users">;

      return (
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar className="w-5 h-5">
            <AvatarImage src={owner.avatarUrl} />
            <AvatarFallback>{owner.name[0]}</AvatarFallback>
          </Avatar>
          <span className="max-w-[200px] truncate font-medium">
            {owner.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "weekEnding",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Date" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap px-4 py-2 text-gray-700">
        {moment(row.getValue("weekEnding")).format("ddd, MMM DD YYYY, h:mm a")}
      </div>
    ),
  },
  {
    accessorKey: "amountEarned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Earned" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amountEarned") as number;
      return <div className="font-medium">{formatToKES(amount)}</div>;
    },
  },
  {
    accessorKey: "isUpcoming",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Upcoming" />
    ),
    cell: ({ row }) => {
      const isUpcoming = row.getValue("isUpcoming") as boolean;
      return (
        <div className="flex space-x-2">
          <Badge variant={isUpcoming ? "default" : "secondary"}>
            {isUpcoming ? "Upcoming" : "Past"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
