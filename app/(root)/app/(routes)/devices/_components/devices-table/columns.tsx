import moment from "moment";
import CustomTooltip from "@/components/global/custom-tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { IUserDeviceData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { FileText, Network } from "lucide-react";
import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";
import { DataTableRowActions } from "./row-actions";

export const columns: ColumnDef<Doc<"devices">>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const label = row.getValue("name") as string;
      return (
        <div className="flex space-x-2 cursor-pointer">
          <Image
            src={"/images/img_holder.png"}
            alt=""
            width={20}
            height={20}
            className=""
          />
          <span className="max-w-[200px] truncate font-medium">{label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "macAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mac Address" />
    ),
    cell: ({ row }) => {
      const label = row.getValue("macAddress") as string;
      return (
        <div className="bg-green-500/0 pl-10">
          <CustomTooltip tip={label}>
            <div className="flex items-center space-x-2">
              <Network
                size={20}
                className="text-muted-foreground cursor-pointer"
              />
              <span className="max-w-[50px] truncate font-medium">{label}</span>
            </div>
          </CustomTooltip>
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
