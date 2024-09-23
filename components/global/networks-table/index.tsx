import DataTable from "@/components/ui/data-table";
import { INetworksData } from "@/lib/types";
import { columns } from "./columns";

interface IProps {
  loading: boolean;
  networks: INetworksData[];
}

const NetworksTable = ({ networks, loading }: IProps) => {
  return (
    <div>
      <DataTable columns={columns} data={networks} loading={loading} />
    </div>
  );
};

export default NetworksTable;
