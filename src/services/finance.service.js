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

