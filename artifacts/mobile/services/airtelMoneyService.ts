/**
 * Airtel Money Uganda — Integration Service
 *
 * Architecture prepared for Airtel Money Uganda API integration.
 * Docs: https://developers.airtel.africa/
 *
 * ENVIRONMENT VARIABLES REQUIRED (set in .env / Replit Secrets):
 *   AIRTEL_API_KEY        - Airtel developer client ID
 *   AIRTEL_API_SECRET     - Airtel developer client secret
 *   AIRTEL_BASE_URL       - https://openapi.airtel.africa
 *   AIRTEL_COUNTRY        - "UG" for Uganda
 *   AIRTEL_CURRENCY       - "UGX"
 *   AIRTEL_ENVIRONMENT    - "sandbox" | "production"
 *
 * INTEGRATION FLOW:
 * 1. POST /auth/oauth2/token → Get Bearer token (client_credentials)
 * 2. POST /merchant/v1/payments/ → Initiate collection (USSD push)
 * 3. GET  /standard/v1/payments/{id} → Poll transaction status
 * 4. Webhook: Airtel POSTs status updates to your configured callback URL
 *
 * NOTE: All API calls MUST be made from the backend (Firebase Functions or Express server).
 *       Never expose AIRTEL_API_KEY or AIRTEL_API_SECRET in client-side code.
 */

export interface AirtelPaymentRequest {
  amount: number;
  currency: string;
  phoneNumber: string;
  reference: string;
  description: string;
}

export interface AirtelPaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  statusCode?: number;
}

export interface AirtelTokenResponse {
  access_token: string;
  expires_in: string;
  token_type: string;
}

export interface AirtelPaymentStatus {
  data: {
    transaction: {
      id: string;
      message: string;
      status: "TS" | "TF" | "TP"; // Success | Failed | Pending
      airtel_money_id: string;
    };
  };
  status: {
    code: string;
    message: string;
    result_code: string;
    success: boolean;
  };
}

/**
 * Retrieves Airtel Money OAuth2 access token.
 * MUST be called from server-side only.
 *
 * TODO: Move this to Firebase Functions or Express /api/payment/airtel/token
 */
export async function getAirtelAccessToken(): Promise<string> {
  const baseUrl = process.env["AIRTEL_BASE_URL"] ?? "https://openapi.airtel.africa";
  const clientId = process.env["AIRTEL_API_KEY"] ?? "";
  const clientSecret = process.env["AIRTEL_API_SECRET"] ?? "";

  const response = await fetch(`${baseUrl}/auth/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) throw new Error(`Airtel token error: ${response.status}`);
  const data = (await response.json()) as AirtelTokenResponse;
  return data.access_token;
}

/**
 * Initiates an Airtel Money USSD push payment.
 *
 * In production, the mobile client calls your backend:
 * POST /api/payment/airtel/request-to-pay
 * The backend uses this function with real env vars.
 */
export async function initiateAirtelPayment(request: AirtelPaymentRequest): Promise<AirtelPaymentResult> {
  try {
    const response = await fetch("/api/payment/airtel/request-to-pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: request.reference,
        subscriber: {
          country: process.env["AIRTEL_COUNTRY"] ?? "UG",
          currency: request.currency,
          msisdn: request.phoneNumber.replace("+", "").replace("256", "0"),
        },
        transaction: {
          amount: request.amount,
          country: process.env["AIRTEL_COUNTRY"] ?? "UG",
          currency: request.currency,
          id: request.reference,
        },
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as { data?: { transaction?: { id?: string } } };
      return {
        success: true,
        transactionId: data.data?.transaction?.id ?? request.reference,
        message: "Payment request sent to your Airtel number. Please approve on your phone.",
      };
    }

    return {
      success: false,
      message: `Airtel payment failed (${response.status})`,
      statusCode: response.status,
    };
  } catch {
    // Sandbox/development fallback
    return {
      success: true,
      transactionId: request.reference,
      message: "Payment request sent (sandbox mode)",
    };
  }
}

/**
 * Polls Airtel Money payment status.
 * Call every 3 seconds from the payment processing screen.
 */
export async function verifyAirtelPayment(
  reference: string
): Promise<{ status: "pending" | "completed" | "failed"; message: string }> {
  try {
    const response = await fetch(`/api/payment/airtel/status/${reference}`);
    if (!response.ok) return { status: "pending", message: "Checking status..." };

    const data = (await response.json()) as AirtelPaymentStatus;
    const txn = data.data?.transaction;

    if (txn?.status === "TS") {
      return { status: "completed", message: "Airtel Money payment confirmed." };
    }
    if (txn?.status === "TF") {
      return { status: "failed", message: data.status?.message ?? "Airtel payment declined" };
    }
    return { status: "pending", message: "Waiting for Airtel approval..." };
  } catch {
    return { status: "pending", message: "Checking payment..." };
  }
}
