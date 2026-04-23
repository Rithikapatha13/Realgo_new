import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
    getNotesData,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
} from "../services/notes.service";

export const useGetNotesData = (pageSize, search) => {
    return useInfiniteQuery({
        queryKey: ["notes", { pageSize, search }],
        queryFn: ({ pageParam = 1 }) => getNotesData({ page: pageParam, size: pageSize, search }),
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

export const useGetNoteById = (id) => {
    return useQuery({
        queryKey: ["note", id],
        queryFn: () => getNoteById(id),
        enabled: !!id,
    });
};

export const useCreateNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
};

export const useUpdateNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }) => updateNote(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
};

export const useDeleteNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
};
