import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Doc } from "@/convex/_generated/dataModel";
import {
  IWidthrawalRequestsData,
  payment_status_description,
} from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Infer } from "convex/values";
import moment from "moment";
import { DataTableRowActions } from "./row-actions";

// user: Doc<"users"> | null;
//   _id: Id<"widthrawaltransactions">;
//   _creationTime: number;
//   amount: string;
//   currency: string;
//   description: string;
//   payment_account: string;
//   payment_method: string;
//   payment_status_description: string;

export const columns: ColumnDef<IWidthrawalRequestsData>[] = [
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
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const user = row.getValue("user") as Doc<"users">;

      return (
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar className="w-5 h-5">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <span className="max-w-[200px] truncate font-medium">
            {user.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap px-4 py-2 text-gray-700">
        {row.getValue("currency")}
      </div>
    ),
  },
  {
    accessorKey: "payment_account",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pay To" />
    ),
    cell: ({ row }) => {
      const phone = row.getValue("payment_account") as boolean;
      return <div className="flex space-x-2">{phone}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return <div className="font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: "payment_status_description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("payment_status_description") as Infer<
        typeof payment_status_description
      >;
      return (
        <div className="flex space-x-2">
          <Badge
            variant={
              status === "Completed"
                ? "connected"
                : status === "Pending"
                  ? "pending"
                  : "default"
            }
            className="text-xs w-fit px-2"
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "_creationTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Request Date" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap px-4 py-2 text-gray-700">
        {moment(row.getValue("_creationTime")).format(
          "ddd, MMM DD YYYY, h:mm a"
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
