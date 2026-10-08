import React, { useState } from 'react';
import { 
  PageView, 
  SupportedLanguage, 
  CommunityTransaction, 
  TransactionStatus 
} from '../types';
import { 
  getStoredTransactions, 
  reportTransactionDispute, 
  getStoredCommunity 
} from '../utils/communityStorage';
import { 
  TrendingUp, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Filter, 
  Search, 
  Calendar, 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  X, 
  Send,
  Eye,
  FileText
} from 'lucide-react';

interface CommunityTransactionsPageProps {
  language: SupportedLanguage;
  onNavigate: (page: PageView) => void;
  selectedTransactionId?: string;
}

const ALL_STATUSES: TransactionStatus[] = [
  'Created',
  'Accepted',
  'Paid',
  'In Progress',
  'Completed',
  'Cancelled',
  'Refunded',
  'Disputed'
];

export const CommunityTransactionsPage: React.FC<CommunityTransactionsPageProps> = ({
  language,
  onNavigate,
  selectedTransactionId,
}) => {
  const community = getStoredCommunity();
  const [transactions, setTransactions] = useState<CommunityTransaction[]>(() => getStoredTransactions());

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [providerFilter, setProviderFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('All');

  // Detail Modal
  const [activeTransaction, setActiveTransaction] = useState<CommunityTransaction | null>(() => {
    if (selectedTransactionId) {
      return transactions.find((t) => t.id === selectedTransactionId) || null;
    }
    return null;
  });

  // Report Issue / Dispute Modal Form State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Quality issue');
  const [disputeExplanation, setDisputeExplanation] = useState('');
  const [disputeSuccessMsg, setDisputeSuccessMsg] = useState(false);

  // Distinct providers list for filter
  const uniqueProviders = Array.from(new Set(transactions.map((t) => t.providerAbbr))).sort();

  // Summary Row Calculations
  const totalTransactionsCount = transactions.length;
  const totalValue = transactions.reduce((acc, t) => acc + t.amount, 0);

  const completedTransactions = transactions.filter((t) => t.status === 'Completed');
  const completedCount = completedTransactions.length;
  const completedValue = completedTransactions.reduce((acc, t) => acc + t.amount, 0);

  const pendingTransactions = transactions.filter((t) => 
    ['Created', 'Accepted', 'Paid', 'In Progress'].includes(t.status)
  );
  const pendingCount = pendingTransactions.length;
  const pendingValue = pendingTransactions.reduce((acc, t) => acc + t.amount, 0);

  const cancelledTransactions = transactions.filter((t) => 
    ['Cancelled', 'Refunded'].includes(t.status)
  );
  const cancelledCount = cancelledTransactions.length;

  const disputedCount = transactions.filter((t) => t.status === 'Disputed').length;

  // Monthly Bar Chart Data
  // Group transactions by YYYY-MM
  const monthlyData: Record<string, { label: string; count: number; value: number }> = {
    '2024-11': { label: 'Nov 24', count: 1, value: 3200 },
    '2024-12': { label: 'Dec 24', count: 2, value: 2450 },
    '2025-01': { label: 'Jan 25', count: 3, value: 4100 },
    '2025-02': { label: 'Feb 25', count: 4, value: 5800 },
    '2025-03': { label: 'Mar 25', count: 0, value: 0 },
  };

  transactions.forEach((t) => {
    const ym = t.date.slice(0, 7);
    if (!monthlyData[ym]) {
      const monthName = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[ym] = { label: monthName, count: 0, value: 0 };
    }
    monthlyData[ym].count += 1;
    monthlyData[ym].value += t.amount;
  });

  const monthlyList = Object.entries(monthlyData).map(([key, val]) => ({
    key,
    ...val,
  })).sort((a, b) => a.key.localeCompare(b.key));

  const maxMonthValue = Math.max(...monthlyList.map((m) => m.value), 1000);

  // Status Badge Helper
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]">
            <Clock className="w-3 h-3 animate-spin" />
            <span>In Progress</span>
          </span>
        );
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EEF6F2] text-[#1E4D38] border border-[#C7E4D3]">
            <span>Paid</span>
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            <span>Accepted</span>
          </span>
        );
      case 'Created':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
            <span>Created</span>
          </span>
        );
      case 'Disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]">
            <AlertTriangle className="w-3 h-3" />
            <span>Dispute raised</span>
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]">
            <span>Refunded</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]">
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesProvider = providerFilter === 'All' || t.providerAbbr === providerFilter;
    const matchesDate = dateFilter === 'All' || t.date.startsWith(dateFilter);
    const matchesSearch = 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.serviceOrProduct.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.buyerAbbr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.providerAbbr.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesProvider && matchesDate && matchesSearch;
  });

  // Handle dispute submission
  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTransaction) return;

    reportTransactionDispute(activeTransaction.id, disputeReason, disputeExplanation);
    
    // Refresh transactions
    const refreshed = getStoredTransactions();
    setTransactions(refreshed);
    const updatedActive = refreshed.find((t) => t.id === activeTransaction.id) || null;
    setActiveTransaction(updatedActive);

    setDisputeSuccessMsg(true);
    setTimeout(() => {
      setDisputeSuccessMsg(false);
      setIsReportModalOpen(false);
      setDisputeExplanation('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <button
            id="txn-back-dash-btn"
            onClick={() => onNavigate('community-dashboard')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6B5749] hover:text-[#3D2B1F] mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Community Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF6F2] text-[#1E4D38] border border-[#C7E4D3] flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-heritage text-[#3D2B1F]">
                Community Transactions
              </h1>
              <p className="text-xs sm:text-sm text-[#6B5749]">
                Verifiable demo orders & delivery records for {community.name}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF5EB] border border-[#EADBCE] text-xs font-semibold text-[#5C4533] self-start md:self-auto">
          <Lock className="w-4 h-4 text-[#C2542D] shrink-0" />
          <span>Names abbreviated for buyer & provider privacy</span>
        </div>
      </div>

      {/* PRIVACY GUARANTEE BANNER */}
      <div className="mb-6 p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs flex items-center gap-3 text-xs text-[#5C4533]">
        <ShieldCheck className="w-5 h-5 text-[#1E4D38] shrink-0" />
        <p className="leading-relaxed">
          <strong>Privacy Protected:</strong> All transactions display anonymized names (e.g. <em>Anita S.</em> and <em>Lakshmi R.</em>). Phone numbers, addresses, and payment details are never revealed in accordance with data safety guidelines.
        </p>
      </div>

      {/* SUMMARY ROW (Total transactions, total value, completed, pending, cancelled) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
        {/* Total Transactions */}
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5749] block mb-1">
            Total Transactions
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F]">
            {totalTransactionsCount}
          </span>
          <span className="block text-[11px] text-[#8C7E74] mt-0.5">Recorded orders</span>
        </div>

        {/* Total Value */}
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5749] block mb-1">
            Total Volume
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#C2542D]">
            ₹{totalValue.toLocaleString('en-IN')}
          </span>
          <span className="block text-[11px] text-[#8C7E74] mt-0.5">All exchange volume</span>
        </div>

        {/* Completed */}
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E4D38] block mb-1">
            Completed Orders
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#1E4D38]">
            {completedCount}
          </span>
          <span className="block text-[11px] text-[#4E6759] mt-0.5">
            ₹{completedValue.toLocaleString('en-IN')} fulfilled
          </span>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9822B] block mb-1">
            Pending / Active
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#D9822B]">
            {pendingCount}
          </span>
          <span className="block text-[11px] text-[#8C7E74] mt-0.5">
            ₹{pendingValue.toLocaleString('en-IN')} in transit
          </span>
        </div>

        {/* Cancelled / Disputed */}
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7E74] block mb-1">
            Cancelled / Disputed
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#5C4533]">
              {cancelledCount}
            </span>
            {disputedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                {disputedCount} dispute
              </span>
            )}
          </div>
          <span className="block text-[11px] text-[#8C7E74] mt-0.5">
            Voided or mediated
          </span>
        </div>
      </div>

      {/* ONE SIMPLE MONTHLY BAR CHART */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-[#EADBCE]">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heritage text-[#3D2B1F]">
              Monthly Transaction Volume (₹)
            </h2>
            <p className="text-xs text-[#6B5749]">
              Distribution of member income across recent months
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF5EB] text-[#5C4533] border border-[#EADBCE] self-start sm:self-auto">
            5-Month Overview
          </span>
        </div>

        {/* Bar Chart Display */}
        <div className="grid grid-cols-5 gap-3 sm:gap-6 items-end h-44 pt-4 px-2">
          {monthlyList.map((m) => {
            const heightPercent = Math.max(12, Math.round((m.value / maxMonthValue) * 100));
            return (
              <div key={m.key} className="flex flex-col items-center gap-2 h-full justify-end group">
                {/* Tooltip value */}
                <div className="text-[10px] sm:text-xs font-bold text-[#C2542D] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all text-center">
                  ₹{m.value.toLocaleString('en-IN')}
                </div>

                {/* Bar */}
                <div 
                  className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#1E4D38] to-[#2E7254] group-hover:from-[#C2542D] group-hover:to-[#D9822B] transition-all duration-300 shadow-xs relative"
                  style={{ height: `${heightPercent}%` }}
                >
                  <span className="sr-only">{m.label}: ₹{m.value}</span>
                </div>

                {/* Month label & count */}
                <div className="text-center">
                  <span className="block text-xs font-bold text-[#3D2B1F]">{m.label}</span>
                  <span className="block text-[10px] text-[#8C7E74]">{m.count} txns</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-4 sm:p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C7E74] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by ID, product, buyer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8C7E74] shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs font-semibold text-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
            >
              <option value="All">All Statuses</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#6B5749] shrink-0">Provider:</span>
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs font-semibold text-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
            >
              <option value="All">All Providers</option>
              {uniqueProviders.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8C7E74] shrink-0" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs font-semibold text-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
            >
              <option value="All">All Dates</option>
              <option value="2025-03">March 2025</option>
              <option value="2025-02">February 2025</option>
              <option value="2025-01">January 2025</option>
              <option value="2024">Year 2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF5EB] text-[#6B5749] font-bold uppercase tracking-wider border-b border-[#EADBCE]">
              <tr>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Buyer</th>
                <th className="py-3.5 px-4">Provider</th>
                <th className="py-3.5 px-4">Service / Product</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADBCE]/70">
              {filteredTransactions.map((txn) => (
                <tr 
                  key={txn.id}
                  onClick={() => setActiveTransaction(txn)}
                  className="hover:bg-[#FAF5EB]/60 cursor-pointer transition-colors"
                >
                  {/* Transaction ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1E4D38]">
                    {txn.id}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-[#6B5749] whitespace-nowrap">
                    {txn.date}
                  </td>

                  {/* Buyer (abbreviated) */}
                  <td className="py-3.5 px-4 font-bold text-[#3D2B1F]">
                    {txn.buyerAbbr}
                  </td>

                  {/* Provider (abbreviated) */}
                  <td className="py-3.5 px-4 font-bold text-[#1E4D38]">
                    {txn.providerAbbr}
                  </td>

                  {/* Service / Product */}
                  <td className="py-3.5 px-4 text-[#3D2B1F] max-w-xs font-medium">
                    {txn.serviceOrProduct}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right font-extrabold text-[#C2542D] whitespace-nowrap">
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(txn.status)}
                  </td>

                  {/* Action icon */}
                  <td className="py-3.5 px-4 text-center text-[#8C7E74]">
                    <span className="inline-flex items-center gap-1 text-xs text-[#C2542D] hover:underline font-bold">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Timeline</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center text-[#6B5749]">
            <p className="text-sm font-semibold">No transactions match your current filters.</p>
          </div>
        )}
      </div>

      {/* DETAIL PAGE / MODAL WITH TIMELINE */}
      {activeTransaction && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE] mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1E4D38] px-2.5 py-1 rounded bg-[#EEF6F2] border border-[#C7E4D3]">
                    {activeTransaction.id}
                  </span>
                  {getStatusBadge(activeTransaction.status)}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#3D2B1F] mt-1.5">
                  {activeTransaction.serviceOrProduct}
                </h2>
              </div>
              <button
                onClick={() => setActiveTransaction(null)}
                className="p-1.5 rounded-xl text-[#8C7E74] hover:text-[#3D2B1F] bg-[#FAF5EB]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Abbreviated Parties & Amount Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF5EB] border border-[#EADBCE] mb-6 text-center">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5749]">Buyer</span>
                <span className="text-sm font-bold text-[#3D2B1F]">{activeTransaction.buyerAbbr}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5749]">Provider</span>
                <span className="text-sm font-bold text-[#1E4D38]">{activeTransaction.providerAbbr}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5749]">Total Amount</span>
                <span className="text-base font-extrabold text-[#C2542D]">₹{activeTransaction.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* TIMELINE: Order created -> Provider accepted -> Payment confirmed -> Delivered -> Completed */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-4">
                Order Execution Timeline
              </h3>

              <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EADBCE]">
                {activeTransaction.timeline.map((event, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-2">
                    {/* Circle icon */}
                    <div 
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        event.done 
                          ? 'bg-[#1E4D38] text-white ring-4 ring-[#EEF6F2]' 
                          : 'bg-[#FAF5EB] border-2 border-[#D8C7B4] text-[#8C7E74]'
                      }`}
                    >
                      {event.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3 h-3" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-bold ${event.done ? 'text-[#1E4D38]' : 'text-[#8C7E74]'}`}>
                          {event.stage}
                        </span>
                        <span className="text-[11px] text-[#8C7E74]">{event.timestamp}</span>
                      </div>
                      {event.note && (
                        <p className="text-[11px] text-[#5C4533] mt-0.5 italic">
                          Note: {event.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispute Details if already reported */}
            {activeTransaction.disputeReason && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 mb-6 text-xs">
                <div className="flex items-center gap-2 font-bold text-red-800 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Dispute Raised: {activeTransaction.disputeReason}</span>
                </div>
                <p className="text-red-700 leading-relaxed mb-1">
                  {activeTransaction.disputeExplanation}
                </p>
                <span className="text-[10px] text-red-600 block">
                  Reported at: {activeTransaction.disputeRaisedAt || 'Recent'}
                </span>
              </div>
            )}

            {/* Bottom Actions: "Report issue" button */}
            <div className="pt-4 border-t border-[#EADBCE] flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs text-[#8C7E74]">
                Order verified by {community.name}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="report-issue-btn"
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report issue</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTransaction(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#FAF5EB] hover:bg-[#EFE4D3] text-[#5C4533] font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT ISSUE MODAL FORM */}
      {isReportModalOpen && activeTransaction && (
        <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl border-2 border-red-300 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE] mb-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold font-heritage">
                  Report Issue on {activeTransaction.id}
                </h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-[#8C7E74] hover:text-[#3D2B1F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {disputeSuccessMsg ? (
              <div className="py-8 text-center text-green-700">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2" />
                <p className="font-bold text-sm">Dispute raised successfully!</p>
                <p className="text-xs mt-1">Status updated to "Dispute raised". Community mediator will reach out.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDispute} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                    Reason for Issue *
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs font-semibold text-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Quality issue">Quality issue</option>
                    <option value="Delay in delivery">Delay in delivery</option>
                    <option value="Measurement or design mismatch">Measurement or design mismatch</option>
                    <option value="Payment token discrepancy">Payment token discrepancy</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                    Explanation / Details *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide a clear description of the issue for peer mediation..."
                    value={disputeExplanation}
                    onChange={(e) => setDisputeExplanation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#FAF5EB] border border-[#EADBCE] text-[11px] text-[#7A6455]">
                  Submitting will mark the transaction status as <strong>"Dispute raised"</strong> and alert the community representative for peaceful resolution.
                </div>

                <div className="pt-3 border-t border-[#EADBCE] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#FAF5EB] text-[#6B5749] font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-dispute-btn"
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Report</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
