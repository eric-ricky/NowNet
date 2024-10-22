import DataTable from "@/components/ui/data-table";
import { Doc } from "@/convex/_generated/dataModel";
import { columns } from "./columns";

interface IProps {
  loading: boolean;
  devices: Doc<"devices">[];
}

const DevicesTable = ({ devices, loading }: IProps) => {
  return (
    <div>
      <DataTable columns={columns} data={devices} loading={loading} />
    </div>
  );
};

export default DevicesTable;
