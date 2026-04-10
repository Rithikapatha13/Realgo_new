import apiClient from "../config/apiClient";

export const getAccounts = async () => {
  const res = await apiClient.get("/finance/accounts");
  return res.data;
};

export const addAccount = async (data) => {
  const res = await apiClient.post("/finance/add-account", data);
  return res.data;
};

export const getLedgers = async (accountTreeId) => {
  const url = accountTreeId ? `/finance/ledgers?accountTreeId=${accountTreeId}` : "/finance/ledgers";
  const res = await apiClient.get(url);
  return res.data;
};

export const addLedger = async (data) => {
  const res = await apiClient.post("/finance/add-ledger", data);
  return res.data;
};

export const getParties = async (type) => {
  const url = type ? `/finance/parties?type=${type}` : "/finance/parties";
  const res = await apiClient.get(url);
  return res.data;
};

export const addParty = async (data) => {
  const res = await apiClient.post("/finance/add-party", data);
  return res.data;
};

export const getTransactions = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await apiClient.get(`/finance/transactions?${queryString}`);
  return res.data;
};

export const addTransaction = async (data) => {
  const res = await apiClient.post("/finance/add-transaction", data);
  return res.data;
};

// ================= SUBLEDGERS =================

export const getSubledgers = async (ledgerId) => {
  const url = ledgerId ? `/finance/subledgers?ledgerId=${ledgerId}` : "/finance/subledgers";
  const res = await apiClient.get(url);
  return res.data;
};

export const addSubledger = async (data) => {
  const res = await apiClient.post("/finance/add-subledger", data);
  return res.data;
};

// ================= REPORTS =================

export const getLedgerStatement = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await apiClient.get(`/finance/reports/ledger-statement?${queryString}`);
  return res.data;
};

export const getTrialBalance = async () => {
  const res = await apiClient.get("/finance/reports/trial-balance");
  return res.data;
};

export const getProfitLoss = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await apiClient.get(`/finance/reports/profit-loss?${queryString}`);
  return res.data;
};

export const getBalanceSheet = async () => {
  const res = await apiClient.get("/finance/reports/balance-sheet");
  return res.data;
};

// ================= BANKS =================

export const getBanks = async () => {
    const res = await apiClient.get("/finance/banks");
    return res.data;
};

export const addBank = async (data) => {
    const res = await apiClient.post("/finance/add-bank", data);
    return res.data;
};

// ================= CHEQUE SERIES =================

export const getChequeSeries = async () => {
    const res = await apiClient.get("/finance/cheque-series");
    return res.data;
};

export const addChequeSeries = async (data) => {
    const res = await apiClient.post("/finance/add-cheque-series", data);
    return res.data;
};

// ================= SPECIALIZED TRANSACTIONS =================

export const addReceipt = async (data) => {
    const res = await apiClient.post("/finance/receipt", data);
    return res.data;
};

export const addPayment = async (data) => {
    const res = await apiClient.post("/finance/payment", data);
    return res.data;
};

export const getChequeDetails = async () => {
    const res = await apiClient.get("/finance/cheque-details");
    return res.data;
};

// ================= ADVANCED REPORTS =================

export const getCashBook = async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await apiClient.get(`/finance/reports/cash-book?${queryString}`);
    return res.data;
};

export const getBankBook = async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await apiClient.get(`/finance/reports/bank-book?${queryString}`);
    return res.data;
};

export const getDayBook = async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await apiClient.get(`/finance/reports/day-book?${queryString}`);
    return res.data;
};

export const getBRS = async () => {
    const res = await apiClient.get("/finance/reports/brs");
    return res.data;
};

