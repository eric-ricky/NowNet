import { api } from "@/convex/_generated/api";
import axios from "axios";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
// update the database record
interface IPayload {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description:
    | "Failed"
    | "Invalid"
    | "Completed"
    | "Reversed"
    | "Pending";
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number;
  merchant_reference: string;
  payment_status_code: string;
  currency: string;
  error: {
    error_type: any;
    code: any;
    message: any;
    call_back_url: any;
  };
  status: string;
}

export async function POST(req: NextRequest) {
  try {
    const { OrderTrackingId, OrderMerchantReference } = await req.json();

    // authentication
    const authUrl = `${process.env.PESAPAL_MAIN_URL}/Auth/RequestToken`;
    const responseAuth = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }),
    });
    const dataAuth = await responseAuth.json();
    const accessToken = dataAuth.token;

    // Get transaction Status
    const url = `${process.env.PESAPAL_MAIN_URL}/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const response = await axios.get(url, config);
    const data: IPayload = response.data;

    // update topuptrasaction
    const currentTransaction = await client.query(
      api.topuptransactions.getTopupTransaction,
      { id: OrderMerchantReference }
    );
    if (!currentTransaction) throw new Error("No transaction was found");
    await client.mutation(api.topuptransactions.updateTopupTransaction, {
      amount: `${data.amount}`,
      confirmation_code: data.confirmation_code,
      created_date: data.created_date,
      currency: data.currency,
      description: data.description || "Top up account",
      order_tracking_id: OrderTrackingId,
      payment_account: data.payment_account,
      payment_method: data.payment_method,
      payment_status_description: data.payment_status_description,
      id: OrderMerchantReference,
    });

    // is completed, deposit amount to their balance
    if (data.status_code === 1 && currentTransaction.user?._id) {
      // order has not been updated
      if (!currentTransaction.order_tracking_id) {
        await client.mutation(api.users.updateUser, {
          id: currentTransaction.user._id,
          balance: currentTransaction.user.balance + data.amount,
        });
      }
    }

    return NextResponse.json(
      {
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("GET PAYMENT STATUS ERROR ====>", error);
    return NextResponse.json(
      { error: "Internal Error", data: error },
      { status: 500 }
    );
  }
}
