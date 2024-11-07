import DataTable from "@/components/ui/data-table";
import { ITransactions } from "@/lib/types";
import { columns } from "./columns";

interface IProps {
  loading: boolean;
  widthrawalRequests: ITransactions[];
}

const AdminWidthrawalRequestTable = ({
  widthrawalRequests,
  loading,
}: IProps) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={widthrawalRequests}
        loading={loading}
      />
    </div>
  );
};

export default AdminWidthrawalRequestTable;
