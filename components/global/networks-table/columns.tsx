import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Doc } from "@/convex/_generated/dataModel";
import { INetworksData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { DataTableRowActions } from "./row-actions";

export const columns: ColumnDef<INetworksData>[] = [
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
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const label = row.getValue("name") as string;
      return (
        <div className="flex space-x-2 cursor-pointer">
          <span className="max-w-[200px] truncate font-medium">{label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "rate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rate" />
    ),
    cell: ({ row }) => {
      const rate = row.getValue("rate") as string;
      return <div>{rate} Kes per day</div>;
    },
  },
  {
    accessorKey: "speed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Speed" />
    ),
    cell: ({ row }) => <div>{row.getValue("speed") || "--"}Mbps</div>,
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
