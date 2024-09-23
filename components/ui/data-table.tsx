"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import DataTableBulkAction from "./data-table-bulk-action";
import DataTablePagination from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Skeleton } from "./skeleton";

interface IDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  searchColumn?: string;
  className?: string;
  showSearch?: boolean;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  loading,
  searchColumn,
  className,
  showSearch,
}: IDataTableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className={cn("space-y-4 pb-10", className)}>
      {!!table.getFilteredSelectedRowModel().rows.length && (
        <DataTableBulkAction table={table} />
      )}

      {showSearch && (
        <DataTableToolbar searchColumn={searchColumn} table={table} />
      )}

      <div className="rounded-md border">
        <Table className="bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                {loading &&
                  [1, 2, 3, 4, 5].map((n) => (
                    <TableRow key={n}>
                      <TableCell
                        colSpan={columns.length}
                        className="h-4 text-center"
                      >
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}

                {!loading && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      <div className="hidden flex-col space-y-2 items-center text-center last:flex pb-4">
                        {/* <Image
                          src={"/doc.png"}
                          alt=""
                          width={100}
                          height={100}
                          className=""
                        /> */}

                        <span className="max-w-sm text-sm text-muted-foreground mx-auto text-center">
                          No records found
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default DataTable;
