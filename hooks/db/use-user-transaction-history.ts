import { api } from "@/convex/_generated/api";
import { ITransactionHistory } from "@/lib/types";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "./use-active-user";

const useUserTransactionHistory = () => {
  const { activeUser } = useActiveUser();
  const usersTopupTransactions = useQuery(
    api.topuptransactions.getUserTopupTransactionHistory,
    {
      userId: activeUser?._id,
    }
  );
  const usersWidthrawalTransactions = useQuery(
    api.widthrawaltransactions.getUserWidthrawalTransactionHistory,
    {
      userId: activeUser?._id,
    }
  );
  const [transanctionHistory, setTransactionHistory] =
    useState<ITransactionHistory[]>();

  useEffect(() => {
    if (!usersTopupTransactions || !usersWidthrawalTransactions) return;

    const newTransactionHistoryPayload: ITransactionHistory[] = [];
    for (const transaction of usersTopupTransactions) {
      const payload: ITransactionHistory = {
        _creationTime: transaction._creationTime,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        payment_account: transaction.payment_account,
        payment_method: transaction.payment_method,
        payment_status_description: transaction.payment_status_description,
        user: transaction.user,
        _id: transaction._id as string,
        transaction_type: "topup",
      };
      newTransactionHistoryPayload.push(payload);
    }

    for (const transaction of usersWidthrawalTransactions) {
      const payload: ITransactionHistory = {
        _creationTime: transaction._creationTime,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        payment_account: transaction.payment_account,
        payment_method: transaction.payment_method,
        payment_status_description: transaction.payment_status_description,
        user: transaction.user,
        _id: transaction._id as string,
        transaction_type: "widthrawal",
      };
      newTransactionHistoryPayload.push(payload);
    }

    // Sort the transactions by _creationTime (ascending)
    newTransactionHistoryPayload.sort(
      (a, b) =>
        new Date(b._creationTime).getTime() -
        new Date(a._creationTime).getTime()
    );

    setTransactionHistory(newTransactionHistoryPayload);
  }, [usersTopupTransactions, usersWidthrawalTransactions]);

  return { transanctionHistory };
};

export default useUserTransactionHistory;
