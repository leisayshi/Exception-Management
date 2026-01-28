import React, { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import {
  PaymentError,
  ErrorStatus,
  ErrorCategory,
  ERROR_CATEGORIES,
  ERROR_STATUSES,
  REFUND_BLOCK_REASONS,
  REFUND_FAILURE_REASONS,
  ACTION_TYPES,
  SERVICE_FEE_PAID_BY,
  FIXED_SERVICE_FEE,
} from "@/lib/error-types";
import {
  AlertCircle,
  ChevronDown,
  Clock,
  Filter,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Zap,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

// Mock data - in production, this would come from an API
const mockErrors: PaymentError[] = [
  {
    id: "err-001",
    paymentOrderId: "A1B2C3D4E5F6G7H8I9J0",
    paymentOrderAmount: 1000,
    paymentOrderCurrency: "USDC",
    transactionHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f...",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    amount: 1500.5,
    currency: "USDC",
    fromAddress: "0x8ba1f10...",
    toAddress: "0x742d35...",
    category: "overpayment",
    status: "processing",
    action: "automatic_refund",
    errorMessage: "User sent 500.5 USDC more than the order amount",
    blockchainNetwork: "Ethereum",
    gasFee: 0.0025,
    gasFeeToken: "ETH",
    refundAttempts: 1,
    lastAttempt: new Date(Date.now() - 1000 * 60),
    serviceFeePaidBy: "user",
  },
  {
    id: "err-002",
    paymentOrderId: "K2L3M4N5O6P7Q8R9S0T1",
    paymentOrderAmount: 2700,
    paymentOrderCurrency: "USDT",
    transactionHash: "0x823b4C8D8D2E8F9A2B3C4D5E6F7G8H...",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    amount: 2500,
    currency: "USDT",
    fromAddress: "0x1234ab...",
    toAddress: "0x5678cd...",
    category: "underpayment",
    status: "pending",
    action: "manual_refund",
    errorMessage: "User sent 200 USDT less than the order amount",
    blockchainNetwork: "Polygon",
    refundBlockReason: "insufficient_gas_fee",
    refundAttempts: 0,
    serviceFeePaidBy: "merchant",
  },
  {
    id: "err-003",
    paymentOrderId: "U2V3W4X5Y6Z7A8B9C0D1",
    paymentOrderAmount: 5000,
    paymentOrderCurrency: "USDC",
    transactionHash: "0x934c5D9E0F1G2H3I4J5K6L7M8N9O...",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    amount: 5000,
    currency: "USDC",
    fromAddress: "0x9abc12...",
    toAddress: "0x3def45...",
    category: "unmatched_order",
    status: "pending",
    action: "manual_refund",
    errorMessage: "Transaction details do not match the expected order",
    blockchainNetwork: "Arbitrum",
    refundBlockReason: "non_eoa_recipient",
    refundAttempts: 2,
    lastAttempt: new Date(Date.now() - 1000 * 60 * 10),
    serviceFeePaidBy: "merchant",
  },
  {
    id: "err-004",
    paymentOrderId: "E2F3G4H5I6J7K8L9M0N1",
    paymentOrderAmount: 700,
    paymentOrderCurrency: "USDC",
    transactionHash: "0xa45b6C7D8E9F0G1H2I3J4K5L6M7N...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    amount: 750.25,
    currency: "USDC",
    fromAddress: "0x4567ef...",
    toAddress: "0x8901gh...",
    category: "timeout",
    status: "refund_success",
    action: "automatic_refund",
    errorMessage: "Payment timeout detected, automatic refund process initiated and completed successfully",
    blockchainNetwork: "Ethereum",
    gasFee: 0.0032,
    gasFeeToken: "ETH",
    refundAttempts: 1,
    lastAttempt: new Date(Date.now() - 1000 * 60 * 20),
    serviceFeePaidBy: "user",
  },
  {
    id: "err-005",
    paymentOrderId: "O2P3Q4R5S6T7U8V9W0X1",
    paymentOrderAmount: 3200,
    paymentOrderCurrency: "USDC",
    transactionHash: "0xb56c7D8E9F0G1H2I3J4K5L6M7N8O...",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    amount: 3200.75,
    currency: "USDT",
    fromAddress: "0xabc123...",
    toAddress: "0xdef456...",
    category: "wrong_token",
    status: "pending",
    action: "manual_refund",
    errorMessage: "User sent USDT instead of USDC",
    blockchainNetwork: "Polygon",
    refundBlockReason: "insufficient_gas_fee",
    refundAttempts: 3,
    lastAttempt: new Date(Date.now() - 1000 * 60 * 25),
    serviceFeePaidBy: "merchant",
  },
  {
    id: "err-006",
    paymentOrderId: "Y2Z3A4B5C6D7E8F9G0H1",
    paymentOrderAmount: 900,
    paymentOrderCurrency: "USDC",
    transactionHash: "0xc67d8E9F0G1H2I3J4K5L6M7N8O9P...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    amount: 1200,
    currency: "USDC",
    fromAddress: "0x2345ij...",
    toAddress: "0x6789kl...",
    category: "overpayment",
    status: "refund_success",
    action: "automatic_refund",
    errorMessage: "User overpaid 300 USDC, refund successfully processed to wallet",
    blockchainNetwork: "Ethereum",
    gasFee: 0.0018,
    gasFeeToken: "ETH",
    refundAttempts: 0,
  },
  {
    id: "err-007",
    paymentOrderId: "I2J3K4L5M6N7O8P9Q0R1",
    paymentOrderAmount: 2000,
    paymentOrderCurrency: "USDC",
    transactionHash: "0xd78e9F0G1H2I3J4K5L6M7N8O9P0Q...",
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    amount: 1800.5,
    currency: "USDC",
    fromAddress: "0x5678mn...",
    toAddress: "0x9012op...",
    category: "underpayment",
    status: "refund_failed",
    action: "automatic_refund",
    errorMessage: "Refund transaction failed: insufficient balance in contract",
    blockchainNetwork: "Ethereum",
    refundAttempts: 2,
    lastAttempt: new Date(Date.now() - 1000 * 60 * 75),
    refundFailureReason: "insufficient_balance",
  },
  {
    id: "err-008",
    paymentOrderId: "S2T3U4V5W6X7Y8Z9A0B1",
    paymentOrderAmount: 2100,
    paymentOrderCurrency: "USDT",
    transactionHash: "0xe89f0G1H2I3J4K5L6M7N8O9P0Q1R...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    amount: 2100.75,
    currency: "USDT",
    fromAddress: "0xpqr789...",
    toAddress: "0xstu012...",
    category: "unsupported_wallet_address",
    status: "pending",
    action: "manual_refund",
    errorMessage: "Wallet address type is not supported for automatic refund, manual intervention required",
    blockchainNetwork: "Polygon",
    refundBlockReason: "non_eoa_recipient",
    refundAttempts: 0,
  },
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentOrderIdFilter, setPaymentOrderIdFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ErrorStatus | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<ErrorCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"recent" | "amount" | "status">("recent");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedErrorForRefund, setSelectedErrorForRefund] = useState<PaymentError | null>(null);
  const [refundWalletAddress, setRefundWalletAddress] = useState("");
  const [refundChain, setRefundChain] = useState("Ethereum");
  const [refundServiceFee, setRefundServiceFee] = useState(0);
  const [refundServiceFeeCurrency, setRefundServiceFeeCurrency] = useState("USDC");

  const filteredAndSortedErrors = useMemo(() => {
    let filtered = mockErrors.filter((error) => {
      const matchesSearch =
        error.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.fromAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.toAddress.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPaymentOrderId =
        paymentOrderIdFilter === "" ||
        error.paymentOrderId.toLowerCase().includes(paymentOrderIdFilter.toLowerCase());

      const matchesStatus = selectedStatus === "all" || error.status === selectedStatus;
      const matchesCategory = selectedCategory === "all" || error.category === selectedCategory;

      return matchesSearch && matchesPaymentOrderId && matchesStatus && matchesCategory;
    });

    filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else if (sortBy === "amount") {
        return b.amount - a.amount;
      } else if (sortBy === "status") {
        const statusOrder: Record<ErrorStatus, number> = {
          pending: 0,
          processing: 1,
          refund_failed: 2,
          refund_success: 3,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, paymentOrderIdFilter, selectedStatus, selectedCategory, sortBy]);

  const stats = useMemo(() => {
    const total = mockErrors.length;
    const cannotInitiate = mockErrors.filter((e) => e.status === "pending").length;
    const processing = mockErrors.filter((e) => e.status === "processing").length;
    const refundSuccess = mockErrors.filter((e) => e.status === "refund_success").length;
    const refundFailed = mockErrors.filter((e) => e.status === "refund_failed").length;

    return { total, cannotInitiate, processing, refundSuccess, refundFailed };
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const estimateRefundGasFee = (error: PaymentError): { fee: number; token: string } => {
    // Estimate refund transaction gas fees based on network
    // These are rough estimates in native tokens
    const networkEstimates: Record<string, { fee: number; token: string }> = {
      Ethereum: { fee: 0.008, token: "ETH" },
      Polygon: { fee: 0.5, token: "MATIC" },
      "Arbitrum One": { fee: 0.0001, token: "ETH" },
      Optimism: { fee: 0.0005, token: "ETH" },
      BSC: { fee: 0.002, token: "BNB" },
      default: { fee: 0.001, token: "TOKEN" },
    };

    if (!error || !error.blockchainNetwork) {
      return networkEstimates.default;
    }

    const estimate = networkEstimates[error.blockchainNetwork] || networkEstimates.default;
    return estimate;
  };

  const calculateNetRefund = (error: PaymentError): { netAmount: number; serviceFee: number; gasFeeWePayAmount: number; gasFeeWePayToken: string } => {
    if (!error || !error.currency || !error.amount) {
      return {
        netAmount: 0,
        serviceFee: 0,
        gasFeeWePayAmount: 0,
        gasFeeWePayToken: "TOKEN",
      };
    }

    const refundGasFee = estimateRefundGasFee(error);

    // Service fee is fixed in USD equivalent, convert to refund currency
    const tokenPrices: Record<string, number> = {
      ETH: 2500,
      MATIC: 0.8,
      BNB: 600,
      USDC: 1,
      USDT: 1,
      TOKEN: 1,
    };

    const refundTokenPrice = tokenPrices[error.currency] || 1;

    // Convert fixed service fee from USD to refund token amount
    const serviceFeeInRefundToken = FIXED_SERVICE_FEE / refundTokenPrice;

    // Calculate net refund amount (we deduct service fee, not gas fee)
    const netAmount = error.amount - serviceFeeInRefundToken;

    return {
      netAmount: Math.max(0, netAmount),
      serviceFee: serviceFeeInRefundToken,
      gasFeeWePayAmount: refundGasFee.fee,
      gasFeeWePayToken: refundGasFee.token,
    };
  };

  return (
    <Layout>
      <div className="space-y-8 bg-white min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Exception Management
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Monitor and manage stablecoin payment exceptions in real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Exceptions</span>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-gray-500 text-xs mt-2">Last 24 hours</p>
          </div>

          <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Cannot Initiate Refund</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-amber-600">{stats.cannotInitiate}</p>
            <p className="text-gray-500 text-xs mt-2">Pending refunds</p>
          </div>

          <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Processing Refund</span>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.processing}</p>
            <p className="text-gray-500 text-xs mt-2">In progress</p>
          </div>

          <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Refund Failed</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.refundFailed}</p>
            <p className="text-gray-500 text-xs mt-2">Failed refunds</p>
          </div>

          <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Refund Success</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.refundSuccess}</p>
            <p className="text-gray-500 text-xs mt-2">Completed</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filters & Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by hash, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Payment Order ID Filter */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Payment Order ID..."
                value={paymentOrderIdFilter}
                onChange={(e) => setPaymentOrderIdFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ErrorStatus | "all")}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Cannot Initiate Refund</option>
                <option value="processing">Processing Refund</option>
                <option value="refund_success">Refund Success</option>
                <option value="refund_failed">Refund Failed</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ErrorCategory | "all")}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {Object.entries(ERROR_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recent" | "amount" | "status")}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="amount">Highest Amount</option>
                <option value="status">By Status</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Errors Table */}
        <div className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-sm">
          {filteredAndSortedErrors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Payment Order ID
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Payment Order Amount
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Paid Amount
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User Wallet Address
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actual Refund
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Gas Fee
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Service Fee
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedErrors.map((error) => (
                    <tr
                      key={error.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === error.id ? null : error.id)
                      }
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <a
                          href={`#order/${error.paymentOrderId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:text-blue-700 font-mono font-medium hover:underline"
                        >
                          {error.paymentOrderId}
                        </a>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <p className="text-gray-900 font-semibold">
                          {error.paymentOrderAmount.toFixed(2)}
                        </p>
                        <p className="text-gray-500 text-xs">{error.paymentOrderCurrency}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <p className="text-gray-900 font-semibold">
                          {error.amount.toFixed(2)}
                        </p>
                        <p className="text-gray-500 text-xs">{error.currency}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900 font-mono font-medium">
                            {formatAddress(error.fromAddress)}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {error.blockchainNetwork}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {error.status === "refund_success" ? (
                          <>
                            <p className="text-gray-900 font-semibold">
                              {(calculateNetRefund(error).netAmount || 0).toFixed(2)}
                            </p>
                            <p className="text-gray-500 text-xs">{error.currency || "-"}</p>
                          </>
                        ) : (
                          <p className="text-gray-400 text-xs">-</p>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {error.status === "refund_success" ? (
                          <>
                            <p className="text-gray-900 font-semibold">
                              {(calculateNetRefund(error).gasFeeWePayAmount || 0).toFixed(6)} {calculateNetRefund(error).gasFeeWePayToken || "TOKEN"}
                            </p>
                            <p className="text-gray-500 text-xs">Paid by us</p>
                          </>
                        ) : (
                          <p className="text-gray-400 text-xs">-</p>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {error.status === "refund_success" ? (
                          <>
                            <p className="text-gray-900 font-semibold">
                              {(calculateNetRefund(error).serviceFee || 0).toFixed(2)}
                            </p>
                            <p className="text-gray-500 text-xs">{error.currency || "-"}</p>
                          </>
                        ) : (
                          <p className="text-gray-400 text-xs">-</p>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                            ERROR_CATEGORIES[error.category].color
                          }`}
                        >
                          {ERROR_CATEGORIES[error.category].label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                            ERROR_STATUSES[error.status].color
                          }`}
                        >
                          {ERROR_STATUSES[error.status].label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                            ACTION_TYPES[error.action].color
                          }`}
                        >
                          {ACTION_TYPES[error.action].label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(expandedId === error.id ? null : error.id);
                          }}
                          className="text-green-600 hover:text-emerald-300 transition-colors text-sm font-medium"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-4 sm:px-6 py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500">No exceptions found matching your criteria</p>
            </div>
          )}

          {/* Expanded Details */}
          {expandedId && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              {filteredAndSortedErrors
                .filter((e) => e.id === expandedId)
                .map((error) => (
                  <div key={error.id} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Original Order Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 text-sm">Payment Order ID</p>
                          <p className="text-gray-900 font-mono font-semibold mt-1">
                            {error.paymentOrderId}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Payment Order Amount</p>
                          <p className="text-gray-900 font-semibold mt-1">
                            {error.paymentOrderAmount.toFixed(2)} {error.paymentOrderCurrency}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">From Address</p>
                          <p className="text-gray-900 font-mono mt-1">
                            {error.fromAddress}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">To Address</p>
                          <p className="text-gray-900 font-mono mt-1">
                            {error.toAddress}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Paid Amount</p>
                          <p className="text-gray-900 font-semibold mt-1">
                            {error.amount.toFixed(2)} {error.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Exception Category</p>
                          <p className="text-gray-900 mt-1 text-sm font-medium">
                            {ERROR_CATEGORIES[error.category].label}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Blockchain Network</p>
                          <p className="text-gray-900 font-semibold mt-1">
                            {error.blockchainNetwork}
                          </p>
                        </div>
                        {error.refundBlockReason && (
                          <div>
                            <p className="text-gray-500 text-sm">Refund Block Reason</p>
                            <p className="text-amber-600 mt-1 text-sm font-medium">
                              {REFUND_BLOCK_REASONS[error.refundBlockReason]}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {error.status === "refund_success" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Refund Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500 text-sm">Gas Fee (Paid by us)</p>
                            <p className="text-gray-900 font-semibold mt-1">
                              {(calculateNetRefund(error).gasFeeWePayAmount || 0).toFixed(6)} {calculateNetRefund(error).gasFeeWePayToken || "TOKEN"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Service Fee</p>
                            <p className="text-gray-900 font-semibold mt-1">
                              {(calculateNetRefund(error).serviceFee || 0).toFixed(2)} {error.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Net Refund Amount</p>
                            <p className="text-green-600 font-bold mt-1 text-lg">
                              {(calculateNetRefund(error).netAmount || 0).toFixed(2)} {error.currency}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {error.status === "refund_failed" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Refund Failure Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <p className="text-gray-500 text-sm">Failure Reason</p>
                            <p className="text-red-600 font-semibold mt-1">
                              {error.refundFailureReason ? REFUND_FAILURE_REASONS[error.refundFailureReason] : "Unknown reason"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Refund Attempts</p>
                            <p className="text-gray-900 font-semibold mt-1">
                              {error.refundAttempts}
                            </p>
                          </div>
                          {error.lastAttempt && (
                            <div>
                              <p className="text-gray-500 text-sm">Last Attempt</p>
                              <p className="text-gray-900 font-semibold mt-1">
                                {formatTime(error.lastAttempt)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {error.status === "pending" && (
                      <div className="flex gap-3 pt-4 border-t border-blue-200">
                        <button
                          onClick={() => {
                            setSelectedErrorForRefund(error);
                            if (error.action === "manual_refund") {
                              setRefundWalletAddress(error.toAddress || "");
                              setRefundChain(error.blockchainNetwork || "Ethereum");
                              setRefundServiceFee(calculateNetRefund(error).serviceFee || FIXED_SERVICE_FEE);
                              setRefundServiceFeeCurrency(error.paymentOrderCurrency);
                            } else {
                              setRefundServiceFeeCurrency(error.currency);
                            }
                            setConfirmDialogOpen(true);
                          }}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Refund
                        </button>
                      </div>
                    )}
                    {error.status === "refund_failed" && (
                      <div className="flex gap-3 pt-4 border-t border-blue-200">
                        <button
                          onClick={() => {
                            setSelectedErrorForRefund(error);
                            if (error.action === "manual_refund") {
                              setRefundWalletAddress(error.toAddress || "");
                              setRefundChain(error.blockchainNetwork || "Ethereum");
                              setRefundServiceFee(calculateNetRefund(error).serviceFee || FIXED_SERVICE_FEE);
                              setRefundServiceFeeCurrency(error.paymentOrderCurrency);
                            } else {
                              setRefundServiceFeeCurrency(error.currency);
                            }
                            setConfirmDialogOpen(true);
                          }}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Refund
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Refund Confirmation Dialog */}
        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent className="bg-white border-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">Confirm Refund</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Please review the transaction details before confirming the refund.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {selectedErrorForRefund && (
              <div className="space-y-4 py-4">
                {selectedErrorForRefund.action === "manual_refund" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-500 text-sm mb-2 block">Wallet Address</label>
                      <input
                        type="text"
                        value={refundWalletAddress}
                        onChange={(e) => setRefundWalletAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm"
                      />
                      <p className="text-gray-500 text-xs mt-1">Recipient wallet address for refund</p>
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm mb-2 block">Network</label>
                      <select
                        value={refundChain}
                        onChange={(e) => setRefundChain(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="Ethereum">Ethereum</option>
                        <option value="Polygon">Polygon</option>
                        <option value="Arbitrum One">Arbitrum One</option>
                        <option value="Optimism">Optimism</option>
                        <option value="BSC">BSC</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-500 text-sm mb-2 block">Service Fee Amount</label>
                        <input
                          type="number"
                          value={refundServiceFee}
                          onChange={(e) => setRefundServiceFee(parseFloat(e.target.value) || 0)}
                          step="0.01"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-gray-500 text-sm mb-2 block">Currency</label>
                        <select
                          value={refundServiceFeeCurrency}
                          onChange={(e) => setRefundServiceFeeCurrency(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <option value="USDC">USDC</option>
                          <option value="USDT">USDT</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">To Address</p>
                      <p className="text-gray-900 font-mono text-sm break-all">{selectedErrorForRefund.toAddress}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Network</p>
                      <p className="text-gray-900 font-medium">{selectedErrorForRefund.blockchainNetwork}</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Payment Order Amount</p>
                    <p className="text-gray-900 font-semibold">{selectedErrorForRefund.paymentOrderAmount.toFixed(2)} {selectedErrorForRefund.paymentOrderCurrency}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Paid Amount</p>
                    <p className="text-gray-900 font-semibold">{selectedErrorForRefund.amount.toFixed(2)} {selectedErrorForRefund.currency}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedErrorForRefund.gasFee && (selectedErrorForRefund.status === "pending" || selectedErrorForRefund.status === "refund_failed") && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-gray-500 text-sm mb-2">Original Gas Fee Issue</p>
                      <p className="text-gray-900 font-semibold text-lg">
                        {selectedErrorForRefund.gasFee.toFixed(6)} {selectedErrorForRefund.gasFeeToken || "Token"}
                      </p>
                      <p className="text-gray-600 text-xs mt-2">(Reason for failed refund)</p>
                    </div>
                  )}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-500 text-sm mb-2">Gas Fee We'll Pay</p>
                    <p className="text-gray-900 font-semibold text-lg">
                      {(calculateNetRefund(selectedErrorForRefund).gasFeeWePayAmount || 0).toFixed(6)} {calculateNetRefund(selectedErrorForRefund).gasFeeWePayToken || "TOKEN"}
                    </p>
                    <p className="text-gray-600 text-xs mt-2">(Paid by us on our platform token)</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <p className="text-gray-600 text-sm font-medium">Refund Summary</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Gross Refund Amount:</span>
                      <span className="text-gray-900 font-semibold">
                        {selectedErrorForRefund.amount.toFixed(2)} {selectedErrorForRefund.currency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service Fee:</span>
                      <span className="text-red-600 font-semibold">
                        -{(selectedErrorForRefund.action === "manual_refund" ? refundServiceFee : (calculateNetRefund(selectedErrorForRefund).serviceFee || 0)).toFixed(2)} {refundServiceFeeCurrency || "-"}
                      </span>
                    </div>
                    <div className="border-t border-green-200 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">Net Refund Amount:</span>
                        <span className="text-green-700 font-bold text-lg">
                          {(selectedErrorForRefund.amount - (selectedErrorForRefund.action === "manual_refund" ? refundServiceFee : (calculateNetRefund(selectedErrorForRefund).serviceFee || 0))).toFixed(2)} {selectedErrorForRefund.currency || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-3">
                    Gas fee paid by us: {(calculateNetRefund(selectedErrorForRefund).gasFeeWePayAmount || 0).toFixed(6)} {calculateNetRefund(selectedErrorForRefund).gasFeeWePayToken || "TOKEN"}
                  </p>
                </div>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedErrorForRefund) {
                    console.log(`Refund for ${selectedErrorForRefund.id}`);
                    setConfirmDialogOpen(false);
                  }
                }}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm Refund
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
