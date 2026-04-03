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
