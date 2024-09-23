"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Building2, ChevronDown, Trash, UserPlus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

interface IDataTableBulkAction<TData> {
  table: Table<TData>;
}

function DataTableBulkAction<TData>({ table }: IDataTableBulkAction<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const params = useParams();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center space-x-2 px-2">
      <div className="text-sm font-medium text-orange-500">
        {selectedRows.length} Items
      </div>

      <Button
        disabled={loading}
        // onClick={handleEmbedFiles}
        variant="outline"
        size="sm"
        className="h-8 border-dashed text-sm text-red-500"
      >
        <Trash size={14} className="text-sm mr-2" />
        Delete
      </Button>

      <div className="hidden">
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed text-sm"
        >
          <UserPlus size={14} className="text-sm text-slate-500 mr-2" />
          Assign to <ChevronDown size={14} className="text-slate-400" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed text-sm"
        >
          <Building2 size={14} className="text-sm text-slate-500 mr-2" />
          Add to company
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed border-red-500/45 text-sm text-red-500 hover:text-red-500"
        >
          <Building2 size={14} className="text-sm text-red-500 mr-2" />
          Delete
        </Button>
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          selectedRows.forEach((row) => {
            row.toggleSelected(false);
          });
        }}
        className="flex items-center space-x-2 text-sm"
      >
        <X size={14} />
        <span>Cancel bulk selection</span>
      </Button>
    </div>
  );
}

export default DataTableBulkAction;
