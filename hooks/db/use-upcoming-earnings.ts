import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "./use-active-user";

const useUpcomingEarnings = () => {
  const { activeUser } = useActiveUser();
  const ownerUpcomingEarnings = useQuery(
    api.earnings.getOwnersUpcomingEarnings,
    {
      owner: activeUser?._id as Id<"users">,
    }
  );
  const [upcomingEarning, setUpcomingEarning] = useState(0);

  useEffect(() => {
    if (!ownerUpcomingEarnings) return;

    const totalUpcomingEarnings = ownerUpcomingEarnings.reduce(
      (total, curr) => total + curr.amountEarned,
      0
    );
    setUpcomingEarning(totalUpcomingEarnings);
  }, [ownerUpcomingEarnings]);

  return { upcomingEarning };
};

export default useUpcomingEarnings;
