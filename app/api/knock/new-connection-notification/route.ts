import { NextRequest, NextResponse } from "next/server";

import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const { userId, name, email, macaddress, wifiname, username, actionUrl } =
      await req.json();

    const workflowRun = await knockClient.workflows.trigger(
      "new-connection-request",
      {
        recipients: [
          {
            id: userId,
            name,
            email,
            primary_action_url: actionUrl,
          },
        ],
        data: {
          macaddress,
          primary_action_url: actionUrl,
          username,
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
