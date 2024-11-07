import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    console.log("✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅");
    const paymentData = await req.json(); // Parse the incoming JSON data

    console.log("Payment callback received:", paymentData);

    // Extract the result code from payment data to check if payment was successful
    const resultCode = paymentData?.Body?.stkCallback?.ResultCode;

    const transaction = await client.query(
      api.transactions.getTransactionByReference,
      {
        reference: paymentData?.Body?.stkCallback?.CheckoutRequestID!,
      }
    );

    if (resultCode === 0) {
      // Payment was successful
      if (transaction) {
        console.log("✅📅📅📅TRANSACTION...", transaction);
        console.log("✅✅UPDATING TRANSACTION...");
        await client.mutation(api.transactions.updateTransaction, {
          id: transaction._id,
          amount: transaction.amount,
          reference: transaction.reference,
          status: "COMPLETED",
          timeStamp: transaction.timeStamp,
          type: transaction.type,
          user: transaction.user?._id as Id<"users">,
        });

        // update user balance
        console.log("✅✅UPDATING USER BALANCE...");
        await client.mutation(api.users.updateUser, {
          id: transaction.user?._id as Id<"users">,
          balance: transaction.user?.balance! + transaction.amount!,
        });
      }

      return NextResponse.json(
        { message: "Payment successful" },
        { status: 200 }
      );
    } else {
      // Payment failed or canceled
      // delete transaction
      if (transaction) {
        console.log("✅✅DELETING TRANSACTION...");
        await client.mutation(api.transactions.deleteTransaction, {
          id: transaction._id,
        });
      }
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
