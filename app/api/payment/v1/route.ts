import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, message, subject } = await req.json();

    // get access token
    const accessTokenResponse = await getAccessToken();
    const accessToken = accessTokenResponse.access_token;

    // create order
    const url = `${process.env.NEXT_PUBLIC_PAYPAL_ROOT_URL}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "100.00",
            },
            reference_id: "d9f80740-38f0-11e8-b467-0ed5f89f718b",
          },
        ],
        intent: "CAPTURE",
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              payment_method_selected: "PAYPAL",
              brand_name: "EXAMPLE INC",
              locale: "en-US",
              landing_page: "LOGIN",
              shipping_preference: "GET_FROM_FILE",
              user_action: "PAY_NOW",
              return_url: "https://example.com/returnUrl",
              cancel_url: "https://example.com/cancelUrl",
            },
          },
        },
      }),
    });
    const data = await response.json();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("EMAIL ERROR ====>", error);
    return NextResponse.json(
      { error: "Internal Error", data: error },
      { status: 500 }
    );
  }
}

// helper function
const getAccessToken = async () => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_SECRET_KEY!;
  const url = `${process.env.NEXT_PUBLIC_PAYPAL_ROOT_URL}/v1/oauth2/token`;

  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const body = new URLSearchParams();
  body.append("grant_type", "client_credentials");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: body.toString(),
    });

    if (!response.ok)
      throw new Error(`Error: ${response.status} ${response.statusText}`);

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
