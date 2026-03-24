import {
    useQuery,
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getGreetings,
    getGreetingsData,
    getInactiveGreetingsData,
    addGreetings,
    deleteGreetings,
} from "@/services/greetings.service";

export const useGetGreetings = (file_category) => {
    return useQuery({
        queryKey: ["GET_GREETINGS", file_category],
        queryFn: () => getGreetings(file_category).then(res => res.data),
        enabled: !!file_category,
    });
};

export const useGetGreetingsData = (pageSize, file_category) => {
    return useInfiniteQuery({
        queryKey: ["GET_GREETINGS_DATA", file_category],
        queryFn: ({ pageParam = 0 }) =>
            getGreetingsData({
                pageIndex: pageParam,
                pageSize,
                file_category,
            }).then(res => res.data),
        getNextPageParam: (lastPage) => {
            const next = lastPage.pageNumber + 1;
            return next * pageSize >= lastPage.total ? null : next;
        },
    });
};

export const useGetInactiveGreetingsData = (month, year) => {
    return useQuery({
        queryKey: ["GET_INACTIVE_GREETINGS", month, year],
        queryFn: () =>
            getInactiveGreetingsData({ month, year }).then(res => res.data),
        enabled: !!month && !!year,
    });
};

export const useAddGreetings = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (data) => addGreetings(data).then(res => res.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["GET_GREETINGS"] });
            qc.invalidateQueries({ queryKey: ["GET_GREETINGS_DATA"] });
        },
    });
};

export const useDeleteGreetings = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (data) => deleteGreetings(data).then(res => res.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["GET_GREETINGS"] });
        },
    });
};
  