import { Doc, Id } from "@/convex/_generated/dataModel";
import { Infer, v } from "convex/values";

export interface IUserDeviceData {
  user: Doc<"users"> | null;
  _id: Id<"devices">;
  _creationTime: string;
  macAddress: string;
  name: string;
}

export const subscriptionStatus = v.union(
  v.literal("pending"),
  v.literal("connected"),
  v.literal("disconnected")
);

export interface ISubscriptionsData {
  user: Doc<"users"> | null;
  wifi: Doc<"wifis"> | null;
  device: Doc<"devices"> | null;
  _id: Id<"subscriptions">;
  _creationTime: number;
  endTime?: string | undefined;
  startTime: string;
  amountConsumed: number;
  isActive: boolean;
  status: Infer<typeof subscriptionStatus>;
}

export interface IEarningsData {
  owner: Doc<"users"> | null;
  wifi: Doc<"wifis"> | null;
  _id: Id<"earnings">;
  _creationTime: number;
  commission: number;
  ownerEarnings: number;
  totalEarnings: number;
  weekEnding: string;
  isArchived: boolean;
  isUpcoming: boolean;
}

export interface INetworksData {
  owner: Doc<"users"> | null;
  _id: Id<"wifis">;
  _creationTime: number;
  speed: string;
  name: string;
  rate: number;
}

export const transactionType = v.union(
  v.literal("DEPOSIT"),
  v.literal("WITHDRAWAL")
);
export const transactionStatus = v.union(
  v.literal("PENDING"),
  v.literal("COMPLETED")
);

export interface ITransactions {
  // _id: Id<"transactions">;
  // user: Doc<"users"> | null;
  // _creationTime: number;
  // amount: number;
  // phoneNumber: string;
  // reference: string;
  // type: Infer<typeof transactionType>;
  // status: Infer<typeof transactionStatus>;
  // timeStamp: string;
  // transanctionCost: number;

  _id: Id<"transactions">;
  _creationTime: number;
  transanctionCost?: number | undefined;
  type: Infer<typeof transactionType>;
  user: Doc<"users"> | null;
  status: Infer<typeof transactionStatus>;
  amount: number;
  phoneNumber: string;
  reference: string;
  timeStamp: string;
}
