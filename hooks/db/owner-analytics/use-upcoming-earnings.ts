import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useUpcomingEarnings = () => {
  const { activeUser } = useActiveUser();
  const ownerUpcomingEarnings = useQuery(
    api.earnings.getOwnersUpcomingEarnings,
    {
      owner: activeUser?._id as Id<"users">,
    }
  );
  const [totalUpcomingEarning, setTotalUpcomingEarning] = useState(0);

  useEffect(() => {
    if (!ownerUpcomingEarnings) return;

    const totalPastEarnings = ownerUpcomingEarnings.reduce(
      (total, curr) => total + curr.ownerEarnings,
      0
    );
    setTotalUpcomingEarning(totalPastEarnings);
  }, [ownerUpcomingEarnings]);

  return { totalUpcomingEarning };
};

export default useUpcomingEarnings;
