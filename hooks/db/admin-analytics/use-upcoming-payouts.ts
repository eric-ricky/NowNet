import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useUpcomingPayouts = () => {
  const { activeUser } = useActiveUser();
  const ownerUpcomingEarnings = useQuery(
    api.earnings.getOwnersUpcomingEarnings,
    {
      owner: activeUser?._id as Id<"users">,
    }
  );
  const [upcomingPayouts, setUpcomingPayouts] = useState(0);

  useEffect(() => {
    if (!ownerUpcomingEarnings) return;

    const totalUpcomingEarnings = ownerUpcomingEarnings.reduce(
      (total, curr) => total + curr.ownerEarnings,
      0
    );
    setUpcomingPayouts(totalUpcomingEarnings);
  }, [ownerUpcomingEarnings]);

  return { upcomingPayouts };
};

export default useUpcomingPayouts;
