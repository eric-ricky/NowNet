import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import useActiveUser from "../use-active-user";

const useUserTotalSpent = () => {
  const { activeUser } = useActiveUser();
  const totalAmountSpent = useQuery(api.subscriptions.getTotalSpentByUser, {
    user: activeUser?._id,
  });
  return { totalAmountSpent, userBalance: activeUser?.balance };
};

export default useUserTotalSpent;
