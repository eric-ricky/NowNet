import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useUpcomingPayouts = () => {
  const { activeUser } = useActiveUser();
  const upcomingEarnings = useQuery(api.earnings.getAllEarningsAdmin, {
    adminEmail: activeUser?.email,
    isUpcoming: true,
  });
  const [upcomingPayouts, setUpcomingPayouts] = useState<number>();

  useEffect(() => {
    if (!upcomingEarnings) return;

    const totalUpcomingEarnings = upcomingEarnings.reduce(
      (total, curr) => total + curr.ownerEarnings,
      0
    );
    setUpcomingPayouts(totalUpcomingEarnings);
  }, [upcomingEarnings]);

  return { upcomingPayouts };
};

export default useUpcomingPayouts;
