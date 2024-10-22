import axios from "axios";
import https from "https";
import { NextRequest, NextResponse } from "next/server";

const tempToken =
  "eyJ4NXQiOiJNR1F6TmprelptVTFaV1k0T0dFNU5UZGpPRFU1T1RSak9ETmtaalZpWWpoaE4yRmtaamRoTURBNVpUWXdNamM0T0dWa1l6RXdaVE13WW1WbFlqZ3hZZyIsImtpZCI6Ik1HUXpOamt6Wm1VMVpXWTRPR0U1TlRkak9EVTVPVFJqT0ROa1pqVmlZamhoTjJGa1pqZGhNREE1WlRZd01qYzRPR1ZrWXpFd1pUTXdZbVZsWWpneFlnX1JTMjU2IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJlcmljX3JpY2t5QGNhcmJvbi5zdXBlciIsImF1dCI6IkFQUExJQ0FUSU9OIiwiYXVkIjoiQVRJZkFudUN3cWZOOTZTd1BiZDZVakk3SWdnYSIsIm5iZiI6MTcyOTMyMjAwNywiYXpwIjoiQVRJZkFudUN3cWZOOTZTd1BiZDZVakk3SWdnYSIsImlzcyI6Imh0dHBzOlwvXC9rY2Itd3NvMmlzLmFwcHMudGVzdC5hcm8ua2NiZ3JvdXAuY29tOjk0NDRcL29hdXRoMlwvdG9rZW4iLCJleHAiOjE3MjkzMjU2MDcsImlhdCI6MTcyOTMyMjAwNywianRpIjoiNjMzM2Y5OGEtZTZkMC00YTg3LThmOWQtNzhlYzQyZTgwMDU2In0.G8Fl4anjUJNCuhu-CLmGDOtoRjcB9kQK9fvLWQ9KIY4fpvO6hWCxh7cJrsvbIPHt4f6VVkUji7Csdjj060e8MF07XryefFsyE6Bo9BmyPVlA_jKF8f6SotfIDYNTtrdbP0ssJaVyhMh5PVpN0EbxCstRMqHOCutCIaesu65L4w2EBEkizRJuLqvDjYLaePAp9SYxBZsfIi2UmOe56DXxqJSYohzAn0Kl1csU9qLFTCMioue47UK62xBNNKQkfvg74dhyHg8QY28FLUXdTGRSawtzYPSiE03jSVhTCXrXJGe-PC4MPc5evBL1WIcDn7b6blfKIfcUwSwQYLTGLYqcuSx5D1N7OJnBjaG7MzRxzGoKz521IvBBV5Vs3RrvfS1mf710-_bw0MrSnJWqR1QE39zPGnqDV5TT9raA6wJrFtQZhAwcc6vuSnjbpuPRsnXSMCKXP1uj1pcpzF6BNbUXAW9KppabpomWGRxBcHFraXytrqNm9e91-lnQ_SntbAezqZmdaXCK9mqHAiyg0o-TMrnKTfhCSZiNamesJEwd9BxO8Bf4GfnibyMsgv2YwhImlJztwji1wfaKAySNoi13Sxqfu6AjRg3unBQVULIaROnhWxPR2RbPmo_ldtiizBI4AuevwgUMwqZyT27zMXsizbhgvJCXy4g-NhtTnLeUObU";

export async function GET(req: NextRequest) {
  try {
    // const { email, message, subject } = await req.json();

    let config = {
      method: "post",
      url: "https://wso2-api-gateway-direct-kcb-wso2-gateway.apps.test.aro.kcbgroup.com/token?grant_type=client_credentials",
      headers: {
        Authorization:
          "Basic QVRJZkFudUN3cWZOOTZTd1BiZDZVakk3SWdnYTp2dWZGZHdmTTZwcGYwTENKYVR2Y3VCVHVyRFVh",
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    const response = await axios.request(config);
    const token = response.data.access_token;

    return NextResponse.json({ data: token }, { status: 200 });
  } catch (error: any) {
    console.log("V3 ERROR ====>", error.message);
    return NextResponse.json(
      { error: "Internal Error", data: error },
      { status: 500 }
    );
  }
}
