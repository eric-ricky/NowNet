import { NextRequest, NextResponse } from "next/server";

const authUrl = "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken";
const orderUrl =
  "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest";

// ipn url = http://localhost:3000/api/payment/v2/ipn // POST
const ipnId = "111139e7-a250-4295-815f-dcbd8c21b068";

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone, amount, paymentId, description } =
      await req.json();

    // authentication
    const responseAuth = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        //   Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }),
    });
    const dataAuth = await responseAuth.json();
    const accessToken = dataAuth.token;

    console.log("DATA AUTH ===>", dataAuth);

    const response = await fetch(orderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        id: paymentId,
        currency: "KES",
        amount,
        description,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/payment-response`,
        notification_id: process.env.NEXT_PUBLIC_PAYPAL_IPN_ID,
        billing_address: {
          email_address: email,
          phone_number: phone,
          country_code: "KE",
          first_name: name.split(" ")[0],
          middle_name: "",
          last_name: name.split(" ")[-1],
          line_1: "Pesapal Limited",
          line_2: "",
          city: "",
          state: "",
          postal_code: "",
          zip_code: "",
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
