import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const baseURL = `https://33b5-102-216-86-51.ngrok-free.app`;

const getToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
};

export async function POST(req: NextRequest) {
  try {
    const { phone, amount } = await req.json();
    const token = await getToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:]/g, "")
      .slice(0, 14); // YYMMDDHHMMSS format
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString(
      "base64"
    );

    const data = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone, // Customer phone number in format 2547XXXXXXXX
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: `${baseURL}/api/payment/v4/callback`,
      AccountReference: "Order123",
      TransactionDesc: "Payment for order",
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error) {
    console.log("MPESA STK PUSH ERROR ====>", error);
    return NextResponse.json(
      { error: "Internal Error", data: error },
      { status: 500 }
    );
  }
}
