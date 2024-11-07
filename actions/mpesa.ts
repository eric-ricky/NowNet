"use server";

import axios from "axios";
import { Buffer } from "buffer";

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortcode = process.env.MPESA_PARENT_SHORTCODE;
const tillNumber = process.env.MPESA_TILL_NUMBER;
const passkey = process.env.MPESA_PASSKEY;
const mpesaBaseUrl = process.env.MPESA_BASE_URL;
const baseURL = process.env.NEXT_PUBLIC_SITE_URL;

const mpesaApi = axios.create({
  baseURL: mpesaBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getAccessToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  console.log("AAUTH ======", auth);

  try {
    const response = await mpesaApi.get(
      `/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Failed to get access token");
  }
}

function generateTimestamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hour}${minute}${second}`;
}

function generatePassword() {
  const timestamp = generateTimestamp();
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
    "base64"
  );

  return password;
}

export async function initiateMpesaPayment(
  phoneNumber: string,
  amount: number
) {
  try {
    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword();

    // Format phone number (remove leading 0 or +254 and add 254)
    const formattedPhone = phoneNumber.replace(/^(?:\+254|254|0)/, "254");

    const requestBody = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: tillNumber,
      PhoneNumber: formattedPhone,
      CallBackURL: `${baseURL}/api/mpesa/callback`, // Replace with your callback URL
      AccountReference: "DigitalWallet",
      TransactionDesc: "Wallet Top Up",
    };

    const response = await mpesaApi.post(
      `/mpesa/stkpush/v1/processrequest`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("RESPONSE FOR INITIATION", response.data);

    const data = response.data;

    if (data.ResponseCode === "0") {
      return {
        success: true,
        reference: data.CheckoutRequestID,
        message: "Payment initiated successfully",
      };
    } else {
      return {
        success: false,
        message: data.ResponseDescription || "Payment initiation failed",
      };
    }
  } catch (error: any) {
    console.error(
      "🧧🧧 INITIATIATE_PAYMENT: Error initiating payment:",
      error?.response?.data
    );
    return {
      success: false,
      message: "Failed to process payment. Please try again.",
    };
  }
}

export async function checkTransactionStatus(checkoutRequestId: string) {
  try {
    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword();

    const requestBody = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    // const response = await fetch(
    //   `${mpesaBaseUrl}/mpesa/stkpushquery/v1/query`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(requestBody),
    //   }
    // );

    const response = await axios.post(
      `${mpesaBaseUrl}/mpesa/stkpushquery/v1/query`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅✅ CHECKSTATUSTRANSACTION DATA ===>", response.data);

    return {
      requestSuccess: response.data.ResponseCode === "0",
      success: response.data.ResultCode === "0",
      message: response.data.ResultDesc,
    };
  } catch (error: any) {
    console.error(
      "🧧🧧 STATUS: Error checking transaction status:",
      error?.message
    );
    return {
      requestSuccess: false,
      success: false,
      message: "Failed to check transaction status",
    };
  }
}
