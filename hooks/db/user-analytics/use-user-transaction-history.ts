import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import useActiveUser from "../use-active-user";

const useUserTransactionHistory = () => {
  const { activeUser } = useActiveUser();
  const transanctions = useQuery(api.transactions.getUserTransactionHistory, {
    userId: activeUser?._id,
  });

  return { transanctions };
};

export default useUserTransactionHistory;
