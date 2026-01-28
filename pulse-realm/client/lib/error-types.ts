export type ErrorStatus = "pending" | "processing" | "refund_success" | "refund_failed";
export type ErrorCategory =
  | "overpayment"
  | "underpayment"
  | "timeout"
  | "wrong_token"
  | "unmatched_order"
  | "unsupported_wallet_address";

export type RefundBlockReason = "insufficient_gas_fee" | "non_eoa_recipient";
export type RefundFailureReason = "insufficient_balance" | "transaction_reverted" | "network_error" | "invalid_recipient" | "insufficient_gas_fee";
export type ActionType = "automatic_refund" | "manual_refund";
export type ServiceFeePaidBy = "user" | "merchant";

export interface PaymentError {
  id: string;
  paymentOrderId: string;
  paymentOrderAmount: number;
  paymentOrderCurrency: string;
  transactionHash: string;
  timestamp: Date;
  amount: number;
  currency: string;
  fromAddress: string;
  toAddress: string;
  category: ErrorCategory;
  status: ErrorStatus;
  action: ActionType;
  errorMessage: string;
  blockchainNetwork: string;
  gasFee?: number; // Gas fee in actual token amount (not USD)
  gasFeeToken?: string; // Token used for gas (e.g., "ETH", "MATIC")
  refundAttempts: number;
  lastAttempt?: Date;
  refundBlockReason?: RefundBlockReason;
  refundFailureReason?: RefundFailureReason;
  serviceFeePaidBy: ServiceFeePaidBy;
}

export const FIXED_SERVICE_FEE = 2; // Fixed service fee in USD equivalent

export const ERROR_CATEGORIES: Record<ErrorCategory, { label: string; color: string; description: string }> = {
  overpayment: {
    label: "Overpayment",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    description: "Payment amount exceeds expected order amount",
  },
  underpayment: {
    label: "Underpayment",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    description: "Payment amount is less than expected order amount",
  },
  timeout: {
    label: "Payment Timeout",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    description: "Transaction processing timeout",
  },
  wrong_token: {
    label: "Wrong Token",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    description: "User sent incorrect token",
  },
  unmatched_order: {
    label: "Unmatched Order",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    description: "Transaction does not match expected order details",
  },
  unsupported_wallet_address: {
    label: "Unsupported Wallet Address",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    description: "Wallet address type is not supported for refund",
  },
};

export const ERROR_STATUSES: Record<ErrorStatus, { label: string; color: string }> = {
  pending: {
    label: "Cannot Initiate Refund",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  processing: {
    label: "Processing Refund",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  refund_success: {
    label: "Refund Success",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  refund_failed: {
    label: "Refund Failed",
    color: "bg-red-100 text-red-700 border-red-200",
  },
};

export const REFUND_BLOCK_REASONS: Record<RefundBlockReason, string> = {
  insufficient_gas_fee: "Cannot initiate refund: Refund amount is less than gas fee required",
  non_eoa_recipient: "Cannot initiate refund: Recipient wallet address is not EOA type",
};

export const REFUND_FAILURE_REASONS: Record<RefundFailureReason, string> = {
  insufficient_balance: "Refund failed: Insufficient balance in contract to complete refund",
  transaction_reverted: "Refund failed: Transaction was reverted on blockchain",
  network_error: "Refund failed: Network error during transaction processing",
  invalid_recipient: "Refund failed: Invalid recipient wallet address",
  insufficient_gas_fee: "Refund failed: Insufficient gas fee provided for transaction",
};

export const ACTION_TYPES: Record<ActionType, { label: string; color: string; description: string }> = {
  automatic_refund: {
    label: "Automatic Refund",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    description: "Automatically initiated refund process",
  },
  manual_refund: {
    label: "Manual Refund",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    description: "Human review and manual intervention required",
  },
};

export const SERVICE_FEE_PAID_BY: Record<ServiceFeePaidBy, string> = {
  user: "Paid by user",
  merchant: "Paid by merchant",
};
