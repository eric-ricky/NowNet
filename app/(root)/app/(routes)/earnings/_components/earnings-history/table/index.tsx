import DataTable from "@/components/ui/data-table";
import { IEarningsData } from "@/lib/types";
import { columns } from "./columns";

interface IProps {
  loading: boolean;
  earnings: IEarningsData[];
}

const EarningsTable = ({ earnings, loading }: IProps) => {
  return (
    <div>
      <DataTable columns={columns} data={earnings} loading={loading} />
    </div>
  );
};

export default EarningsTable;
