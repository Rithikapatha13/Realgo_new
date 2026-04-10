import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as financeService from "../services/finance.service";

export const useGetAccounts = () => {
  return useQuery({
    queryKey: ["finance", "accounts"],
    queryFn: financeService.getAccounts,
  });
};

export const useAddAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "accounts"] });
    },
  });
};

export const useGetLedgers = (accountTreeId) => {
  return useQuery({
    queryKey: ["finance", "ledgers", accountTreeId],
    queryFn: () => financeService.getLedgers(accountTreeId),
  });
};

export const useAddLedger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.addLedger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "ledgers"] });
    },
  });
};

export const useGetParties = (type) => {
  return useQuery({
    queryKey: ["finance", "parties", type],
    queryFn: () => financeService.getParties(type),
  });
};

export const useAddParty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.addParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "parties"] });
    },
  });
};

export const useGetTransactions = (params) => {
  return useQuery({
    queryKey: ["finance", "transactions", params],
    queryFn: () => financeService.getTransactions(params),
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "transactions"] });
    },
  });
};

// ================= SUBLEDGERS =================

export const useGetSubledgers = (ledgerId) => {
  return useQuery({
    queryKey: ["finance", "subledgers", ledgerId],
    queryFn: () => financeService.getSubledgers(ledgerId),
  });
};

export const useAddSubledger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.addSubledger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "subledgers"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "ledgers"] });
    },
  });
};

// ================= REPORTS =================

export const useGetLedgerStatement = (params) => {
  return useQuery({
    queryKey: ["finance", "reports", "ledger", params],
    queryFn: () => financeService.getLedgerStatement(params),
    enabled: !!params.ledgerId,
  });
};

export const useGetTrialBalance = () => {
  return useQuery({
    queryKey: ["finance", "reports", "trial-balance"],
    queryFn: financeService.getTrialBalance,
  });
};

export const useGetProfitLoss = (params) => {
  return useQuery({
    queryKey: ["finance", "reports", "profit-loss", params],
    queryFn: () => financeService.getProfitLoss(params),
  });
};

export const useGetBalanceSheet = () => {
  return useQuery({
    queryKey: ["finance", "reports", "balance-sheet"],
    queryFn: financeService.getBalanceSheet,
  });
};

// ================= BANKS =================

export const useGetBanks = () => {
    return useQuery({
        queryKey: ["finance", "banks"],
        queryFn: financeService.getBanks,
    });
};

export const useAddBank = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: financeService.addBank,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["finance", "banks"] });
        },
    });
};

// ================= CHEQUE SERIES =================

export const useGetChequeSeries = () => {
    return useQuery({
        queryKey: ["finance", "cheque-series"],
        queryFn: financeService.getChequeSeries,
    });
};

export const useAddChequeSeries = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: financeService.addChequeSeries,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["finance", "cheque-series"] });
        },
    });
};

// ================= SPECIALIZED TRANSACTIONS =================

export const useAddReceipt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: financeService.addReceipt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["finance", "transactions"] });
        },
    });
};

export const useAddPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: financeService.addPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["finance", "transactions"] });
        },
    });
};

export const useGetChequeDetails = () => {
    return useQuery({
        queryKey: ["finance", "cheque-details"],
        queryFn: financeService.getChequeDetails,
    });
};

// ================= ADVANCED REPORTS =================

export const useGetCashBook = (params) => {
    return useQuery({
        queryKey: ["finance", "reports", "cash-book", params],
        queryFn: () => financeService.getCashBook(params),
    });
};

export const useGetBankBook = (params) => {
    return useQuery({
        queryKey: ["finance", "reports", "bank-book", params],
        queryFn: () => financeService.getBankBook(params),
    });
};

export const useGetDayBook = (params) => {
    return useQuery({
        queryKey: ["finance", "reports", "day-book", params],
        queryFn: () => financeService.getDayBook(params),
    });
};

export const useGetBRS = () => {
    return useQuery({
        queryKey: ["finance", "reports", "brs"],
        queryFn: financeService.getBRS,
    });
};

