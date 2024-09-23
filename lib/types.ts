import { Doc, Id } from "@/convex/_generated/dataModel";
import { Infer, v } from "convex/values";

export interface IUserDeviceData {
  user: Doc<"users"> | null;
  _id: Id<"devices">;
  _creationTime: string;
  macAddress: string;
  name: string;
}

// const d: Doc<"subscriptions"> = {
//   user,
//   wifi,
//   device,
//   _id,
//   _creationTime,
//   amountConsumed,
//   isActive,
//   startTime,
//   endTime,
// };

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
  amountEarned: number;
  isUpcoming: boolean;
  weekEnding: string;
}

export interface INetworksData {
  owner: Doc<"users"> | null;
  _id: Id<"wifis">;
  _creationTime: number;
  location?: string | undefined;
  name: string;
  rate: string;
}

export const payment_status_description = v.union(
  v.literal("Invalid"),
  v.literal("Completed"),
  v.literal("Failed"),
  v.literal("Reversed"),
  v.literal("Pending")
);

export interface IWidthrawalRequestsData {
  user: Doc<"users"> | null;
  _id: Id<"widthrawaltransactions">;
  _creationTime: number;
  amount: string;
  currency: string;
  description: string;
  payment_account: string;
  payment_method: string;
  payment_status_description: Infer<typeof payment_status_description>;
}

export interface ITransactionHistory {
  _id: string;
  _creationTime: number;
  amount: string;
  currency: string;
  description: string;
  payment_account: string;
  payment_method: string;
  payment_status_description: string;
  transaction_type: "topup" | "widthrawal";
  user: string;
}
