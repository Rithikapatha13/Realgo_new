import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as service from "../services/associateFinance.service";

export const useContributions = (params) => {
    return useQuery({
        queryKey: ["contributions", params],
        queryFn: () => service.getContributions(params),
    });
};

export const useCreateContribution = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: service.createContribution,
        onSuccess: () => queryClient.invalidateQueries(["contributions"]),
    });
};

export const useExpenses = (params) => {
    return useQuery({
        queryKey: ["expenses", params],
        queryFn: () => service.getExpenses(params),
    });
};

export const useCreateExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: service.createExpense,
        onSuccess: () => queryClient.invalidateQueries(["expenses"]),
    });
};

export const usePayouts = (params) => {
    return useQuery({
        queryKey: ["payouts", params],
        queryFn: () => service.getPayouts(params),
    });
};

export const useCreatePayout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: service.createPayout,
        onSuccess: () => {
            queryClient.invalidateQueries(["payouts"]);
            queryClient.invalidateQueries(["contributions"]);
        },
    });
};
