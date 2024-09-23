import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "./use-active-user";

const useTotalEarnings = () => {
  const { activeUser } = useActiveUser();
  const ownerPastEarnings = useQuery(api.earnings.getOwnersPastEarnings, {
    owner: activeUser?._id as Id<"users">,
  });
  const [totalEarning, setTotalEarning] = useState(0);

  useEffect(() => {
    if (!ownerPastEarnings) return;

    const totalPastEarnings = ownerPastEarnings.reduce(
      (total, curr) => total + curr.amountEarned,
      0
    );
    setTotalEarning(totalPastEarnings);
  }, [ownerPastEarnings]);

  return { totalEarning };
};

export default useTotalEarnings;
