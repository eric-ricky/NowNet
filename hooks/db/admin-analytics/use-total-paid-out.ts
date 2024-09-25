import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useTotalPaidOut = () => {
  const { activeUser } = useActiveUser();
  const ownerPastEarnings = useQuery(api.earnings.getAllEarningsAdmin, {
    adminEmail: activeUser?.email,
    isUpcoming: false,
  });
  const [totalPaidOut, setTotalEarning] = useState(0);

  useEffect(() => {
    if (!ownerPastEarnings) return;

    const totalPastEarnings = ownerPastEarnings.reduce(
      (total, curr) => total + curr.ownerEarnings,
      0
    );
    setTotalEarning(totalPastEarnings);
  }, [ownerPastEarnings]);

  return { totalPaidOut };
};

export default useTotalPaidOut;
