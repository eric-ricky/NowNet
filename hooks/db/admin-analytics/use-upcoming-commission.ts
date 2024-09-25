import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useUpcomingCommission = () => {
  const { activeUser } = useActiveUser();
  const upcomingEarnings = useQuery(api.earnings.getAllEarningsAdmin, {
    adminEmail: activeUser?.email,
    isUpcoming: true,
  });
  const [upcomingCommission, setUpcomingCommission] = useState(0);

  useEffect(() => {
    if (!upcomingEarnings) return;

    const commission = upcomingEarnings.reduce(
      (prev, curr) => prev + curr.commission,
      0
    );
    setUpcomingCommission(commission);
  }, [upcomingEarnings]);

  return { upcomingCommission };
};

export default useUpcomingCommission;
