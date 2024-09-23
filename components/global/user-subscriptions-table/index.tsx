import DataTable from "@/components/ui/data-table";
import { ISubscriptionsData } from "@/lib/types";
import { columns } from "./columns";

interface IProps {
  loading: boolean;
  subscriptions: ISubscriptionsData[];
  className?: string;
}

const UserSubscriptionsTable = ({
  subscriptions,
  loading,
  className,
}: IProps) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={subscriptions}
        loading={loading}
        searchColumn="status"
        className={className}
        showSearch
      />
    </div>
  );
};

export default UserSubscriptionsTable;
