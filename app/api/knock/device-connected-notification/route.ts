import { NextRequest, NextResponse } from "next/server";

import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const {
      recipient_userId,
      recipient_email,
      recipient_username,
      devicename,
      macaddress,
      primary_action_url,
      wifiname,
    } = await req.json();

    const workflowRun = await knockClient.workflows.trigger(
      "device-connected-to-network",
      {
        recipients: [
          {
            id: recipient_userId,
            name: recipient_username,
            email: recipient_email,
          },
        ],
        data: {
          devicename,
          macaddress,
          primary_action_url,
          wifiname,
        },
      }
    );

    return NextResponse.json(
      { data: workflowRun.workflow_run_id },
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
