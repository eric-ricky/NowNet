import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useTotalPaidOut = () => {
  const { activeUser } = useActiveUser();
  const pastEarnings = useQuery(api.earnings.getAllEarningsAdmin, {
    adminEmail: activeUser?.email,
    isUpcoming: false,
  });
  const [totalPaidOut, setTotalEarning] = useState<number>();

  useEffect(() => {
    if (!pastEarnings) return;

    const totalPastEarnings = pastEarnings.reduce(
      (total, curr) => total + curr.ownerEarnings,
      0
    );
    setTotalEarning(totalPastEarnings);
  }, [pastEarnings]);

  return { totalPaidOut };
};

export default useTotalPaidOut;
