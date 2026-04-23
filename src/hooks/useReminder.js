import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
    getRemindersData,
    getTodaysReminders,
    getReminderById,
    createReminder,
    updateReminder,
    updateReminderTime,
    deleteReminder
} from "../services/reminder.service";

export const useGetRemindersData = (pageSize, name, type) => {
    return useInfiniteQuery({
        queryKey: ["reminders", { pageSize, name, type }],
        queryFn: ({ pageParam = 1 }) => getRemindersData({ page: pageParam, size: pageSize, name, type }),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || !lastPage.items) return undefined;
            const nextPage = Number(lastPage.pageNumber) + 1;
            const currentTotalItemsFetched = allPages.reduce((total, page) => total + (page.items ? page.items.length : 0), 0);
            if (currentTotalItemsFetched >= lastPage.total || lastPage.items.length < pageSize) {
                return undefined;
            }
            return nextPage;
        },
        initialPageParam: 1,
    });
};

export const useGetTodaysReminders = () => {
    return useQuery({
        queryKey: ["todays-reminders"],
        queryFn: getTodaysReminders,
    });
};

export const useGetReminderById = (id) => {
    return useQuery({
        queryKey: ["reminder", id],
        queryFn: () => getReminderById(id),
        enabled: !!id,
    });
};

export const useCreateReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createReminder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
            queryClient.invalidateQueries({ queryKey: ["todays-reminders"] });
        },
    });
};

export const useUpdateReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateReminder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
            queryClient.invalidateQueries({ queryKey: ["todays-reminders"] });
        },
    });
};

export const useUpdateReminderTime = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateReminderTime,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
            queryClient.invalidateQueries({ queryKey: ["todays-reminders"] });
        },
    });
};

export const useDeleteReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteReminder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
            queryClient.invalidateQueries({ queryKey: ["todays-reminders"] });
        },
    });
};
