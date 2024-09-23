import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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
    const { OrderTrackingId, OrderNotificationType, OrderMerchantReference } =
      await req.json();

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
    console.log("Access Token ===>", accessToken);

    // Get transaction Status
    const url = `${process.env.PESAPAL_MAIN_URL}/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const response = await axios.get(url, config);
    const data: IPayload = response.data;

    if (data.payment_status_code !== "1")
      throw new Error(data.payment_status_description);

    return NextResponse.json(
      {
        orderNotificationType: "IPNCHANGE",
        orderTrackingId: OrderTrackingId,
        orderMerchantReference: OrderMerchantReference,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("EMAIL ERROR ====>", error);
    return NextResponse.json(
      { error: "Internal Error", data: error },
      { status: 500 }
    );
  }
}
