/**
 * GANA HUB Payment Service
 *
 * Central payment orchestration layer for the GANA HUB ecosystem.
 * This service abstracts over MTN Mobile Money and Airtel Money,
 * providing a unified API for payment initiation, verification, and history.
 *
 * ARCHITECTURE:
 * - All payment provider calls go through this service
 * - Transactions are recorded in Firestore (see firebaseSchema.ts)
 * - Webhook endpoints live in Firebase Functions / Express server
 * - API keys and secrets are injected via environment variables (never hardcoded)
 *
 * FUTURE PROVIDERS:
 * - Visa/Mastercard: Add VisaMastercardService and delegate here
 * - PayPal: Add PayPalService and delegate here
 * - Stripe: Add StripeService and delegate here
 * - International currencies: Amount conversion layer before initiation
 */

import { initiateMtnPayment, verifyMtnPayment, type MtnPaymentRequest, type MtnPaymentResult } from "./mtnMomoService";
import { initiateAirtelPayment, verifyAirtelPayment, type AirtelPaymentRequest, type AirtelPaymentResult } from "./airtelMoneyService";

export type PaymentNetwork = "mtn_momo" | "airtel_money";

export interface PaymentRequest {
  amount: number;
  currency: string;
  phoneNumber: string;
  network: PaymentNetwork;
  description: string;
  orderId: string;
  userId: string;
  artworkId?: string;
  eventId?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  reference: string;
  status: "pending" | "completed" | "failed";
  message: string;
  network: PaymentNetwork;
  timestamp: string;
}

export interface TransactionRecord {
  transactionId: string;
  userId: string;
  artworkId?: string;
  eventId?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentNetwork;
  network: string;
  status: "pending" | "completed" | "failed";
  phoneNumber: string;
  reference: string;
  createdAt: string;
  description: string;
}

/**
 * Initiates a mobile money payment.
 * Routes to the appropriate provider based on the network selection.
 *
 * @param request - Payment details including amount, phone, and network
 * @returns PaymentResult with transaction reference and status
 */
export async function initiatePayment(request: PaymentRequest): Promise<PaymentResult> {
  const reference = `GANA-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  try {
    if (request.network === "mtn_momo") {
      const mtnRequest: MtnPaymentRequest = {
        amount: request.amount,
        currency: request.currency,
        phoneNumber: request.phoneNumber,
        reference,
        description: request.description,
      };
      const result = await initiateMtnPayment(mtnRequest);
      return formatResult(result, reference, request.network);
    }

    if (request.network === "airtel_money") {
      const airtelRequest: AirtelPaymentRequest = {
        amount: request.amount,
        currency: request.currency,
        phoneNumber: request.phoneNumber,
        reference,
        description: request.description,
      };
      const result = await initiateAirtelPayment(airtelRequest);
      return formatResult(result, reference, request.network);
    }

    throw new Error(`Unsupported payment network: ${request.network}`);
  } catch (error) {
    return {
      success: false,
      transactionId: `txn_failed_${Date.now()}`,
      reference,
      status: "failed",
      message: error instanceof Error ? error.message : "Payment initiation failed",
      network: request.network,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Verifies payment status by transaction reference.
 * Used for polling on the payment processing screen.
 */
export async function verifyPayment(
  reference: string,
  network: PaymentNetwork
): Promise<{ status: "pending" | "completed" | "failed"; message: string }> {
  if (network === "mtn_momo") return verifyMtnPayment(reference);
  if (network === "airtel_money") return verifyAirtelPayment(reference);
  return { status: "failed", message: "Unknown network" };
}

/**
 * Records a transaction in Firestore.
 * TODO: Implement when Firebase is integrated.
 */
export async function recordTransaction(record: TransactionRecord): Promise<void> {
  // TODO: Firebase Firestore integration
  // import { db } from "@/services/firebaseSchema";
  // import { collection, addDoc } from "firebase/firestore";
  // await addDoc(collection(db, "transactions"), record);
  console.log("[PaymentService] Transaction recorded (mock):", record.reference);
}

/**
 * Retrieves transaction history for a user.
 * TODO: Implement when Firebase is integrated.
 */
export async function getUserTransactions(_userId: string): Promise<TransactionRecord[]> {
  // TODO: Firebase Firestore integration
  // const q = query(collection(db, "transactions"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map(d => d.data() as TransactionRecord);
  return [];
}

function formatResult(
  raw: MtnPaymentResult | AirtelPaymentResult,
  reference: string,
  network: PaymentNetwork
): PaymentResult {
  return {
    success: raw.success,
    transactionId: raw.transactionId ?? `txn_${Date.now()}`,
    reference,
    status: raw.success ? "pending" : "failed",
    message: raw.message,
    network,
    timestamp: new Date().toISOString(),
  };
}
