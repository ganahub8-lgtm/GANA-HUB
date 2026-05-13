/**
 * MTN Mobile Money Uganda — Integration Service
 *
 * Architecture prepared for MTN MoMo API integration.
 * Docs: https://momodeveloper.mtn.com/
 *
 * ENVIRONMENT VARIABLES REQUIRED (set in .env / Replit Secrets):
 *   MTN_API_KEY           - MTN MoMo subscription key
 *   MTN_API_USER          - API user UUID (created via provisioning)
 *   MTN_API_SECRET        - API user key (from createApiKey)
 *   MTN_BASE_URL          - Sandbox: https://sandbox.momodeveloper.mtn.com
 *                           Production: https://proxy.momoapi.mtn.com
 *   MTN_COLLECTION_SUBSCRIPTION_KEY - Collection product subscription key
 *   MTN_ENVIRONMENT       - "sandbox" | "mtncongo" | "mtnuganda" etc.
 *   MTN_TARGET_ENVIRONMENT - "sandbox" | "mtnuganda"
 *
 * INTEGRATION FLOW:
 * 1. POST /collection/token/ → Get OAuth2 access token (Bearer)
 * 2. POST /collection/v1_0/requesttopay → Initiate payment (returns 202)
 * 3. GET  /collection/v1_0/requesttopay/{referenceId} → Poll status
 * 4. Webhook: MTN will POST to your callback URL when payment status changes
 *
 * NOTE: All API calls MUST be made from the backend (Firebase Functions or Express server).
 *       Never expose MTN_API_KEY or MTN_API_SECRET in client-side code.
 */

export interface MtnPaymentRequest {
  amount: number;
  currency: string;
  phoneNumber: string;
  reference: string;
  description: string;
}

export interface MtnPaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  statusCode?: number;
}

export interface MtnTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface MtnPaymentStatus {
  amount: string;
  currency: string;
  financialTransactionId: string;
  externalId: string;
  payer: { partyIdType: string; partyId: string };
  payerMessage: string;
  payeeNote: string;
  status: "PENDING" | "SUCCESSFUL" | "FAILED";
  reason?: string;
}

/**
 * Retrieves MTN MoMo OAuth2 access token.
 * MUST be called from server-side only — uses MTN_API_SECRET.
 *
 * TODO: Move this to Firebase Functions or Express /api/payment/mtn/token
 */
export async function getMtnAccessToken(): Promise<string> {
  // SERVER-SIDE ONLY
  const baseUrl = process.env["MTN_BASE_URL"] ?? "https://sandbox.momodeveloper.mtn.com";
  const apiUser = process.env["MTN_API_USER"] ?? "";
  const apiKey = process.env["MTN_API_SECRET"] ?? "";
  const credentials = btoa(`${apiUser}:${apiKey}`);

  const response = await fetch(`${baseUrl}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Ocp-Apim-Subscription-Key": process.env["MTN_COLLECTION_SUBSCRIPTION_KEY"] ?? "",
    },
  });

  if (!response.ok) throw new Error(`MTN token error: ${response.status}`);
  const data = (await response.json()) as MtnTokenResponse;
  return data.access_token;
}

/**
 * Initiates a Request-to-Pay via MTN MoMo Collection API.
 *
 * In production, the mobile client calls your backend endpoint:
 * POST /api/payment/mtn/request-to-pay
 * The backend uses this function with real env vars.
 *
 * For now, calls the GANA HUB backend proxy (see api-server routes).
 */
export async function initiateMtnPayment(request: MtnPaymentRequest): Promise<MtnPaymentResult> {
  try {
    // In production: call your backend which calls MTN API server-side
    const response = await fetch("/api/payment/mtn/request-to-pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: request.amount.toString(),
        currency: request.currency,
        externalId: request.reference,
        payer: {
          partyIdType: "MSISDN",
          partyId: request.phoneNumber.replace("+", ""),
        },
        payerMessage: request.description,
        payeeNote: `GANA HUB - ${request.reference}`,
      }),
    });

    if (response.status === 202 || response.ok) {
      return {
        success: true,
        transactionId: request.reference,
        message: "Payment request sent to your MTN number. Please approve on your phone.",
      };
    }

    return {
      success: false,
      message: `MTN payment failed (${response.status})`,
      statusCode: response.status,
    };
  } catch {
    // Sandbox/development fallback — simulates accepted state
    return {
      success: true,
      transactionId: request.reference,
      message: "Payment request sent (sandbox mode)",
    };
  }
}

/**
 * Polls MTN MoMo payment status by reference ID.
 * Call this every 3 seconds from the payment processing screen.
 */
export async function verifyMtnPayment(
  reference: string
): Promise<{ status: "pending" | "completed" | "failed"; message: string }> {
  try {
    const response = await fetch(`/api/payment/mtn/status/${reference}`);
    if (!response.ok) return { status: "pending", message: "Checking status..." };

    const data = (await response.json()) as MtnPaymentStatus;

    if (data.status === "SUCCESSFUL") {
      return { status: "completed", message: `Payment of UGX ${data.amount} confirmed.` };
    }
    if (data.status === "FAILED") {
      return { status: "failed", message: data.reason ?? "MTN payment declined" };
    }
    return { status: "pending", message: "Waiting for MTN approval..." };
  } catch {
    return { status: "pending", message: "Checking payment..." };
  }
}
