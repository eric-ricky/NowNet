import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useTotalCommission = () => {
  const { activeUser } = useActiveUser();
  const pastEarnings = useQuery(api.earnings.getAllEarningsAdmin, {
    adminEmail: activeUser?.email,
    isUpcoming: false,
  });
  const [totalCommission, setTotalCommission] = useState<number>();

  useEffect(() => {
    if (!pastEarnings) return;

    const commission = pastEarnings.reduce(
      (prev, curr) => prev + curr.commission,
      0
    );
    setTotalCommission(commission);
  }, [pastEarnings]);

  return { totalCommission };
};

export default useTotalCommission;
