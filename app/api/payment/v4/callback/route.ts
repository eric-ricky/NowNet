import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const paymentData = await req.json(); // Parse the incoming JSON data

    console.log("Payment callback received:", paymentData);

    // Extract the result code from payment data to check if payment was successful
    const resultCode = paymentData?.Body?.stkCallback?.ResultCode;

    if (resultCode === 0) {
      // Payment was successful
      return NextResponse.json(
        { message: "Payment successful" },
        { status: 200 }
      );
    } else {
      // Payment failed or canceled
      return NextResponse.json({ message: "Payment failed" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error handling payment callback:", error);
    return NextResponse.json(
      { error: "Internal Error", details: error.message },
      { status: 500 }
    );
  }
}
