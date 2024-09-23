import { NextRequest, NextResponse } from "next/server";

import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const { userId, message } = await req.json();
    // The key of the workflow (from Knock dashboard)
    const workflowRun = await knockClient.workflows.trigger("dinosaurs-loose", {
      // user id of who performed the action
      actor: userId,
      // list of user ids for who should receive the notification
      // recipients: ["jhammond", "agrant", "imalcolm", "esattler"],
      recipients: [
        {
          id: "",
          name: "",
          email: "",
        },
      ],
      // data payload to send through
      data: {
        type: "trex",
        priority: 1,
      },
      // an optional identifier for the tenant that the notifications belong to
      tenant: "jurassic-park",
      // an optional key to provide to cancel a workflow
      // cancellationKey: triggerAlert.id,
    });

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
