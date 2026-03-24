import { useQuery } from "@tanstack/react-query";
import {
    fetchReportUsers,
    fetchReportCompanyLinkedUsers,
    fetchReportPlots,
    fetchReportSales,
} from "../services/reports.service";

export const useReportUsers = (filterOptions, queryOptions = {}) => {
    return useQuery({
        queryKey: ["report-users", filterOptions],
        queryFn: () => {
            const { active, userId, designation, startDate, endDate } = filterOptions || {};
            return fetchReportUsers(active, userId, designation, startDate, endDate);
        },
        ...queryOptions,
    });
};

export const useReportCompanyLinkedUsers = (filterOptions, queryOptions = {}) => {
    return useQuery({
        queryKey: ["report-company-linked-users", filterOptions],
        queryFn: () => {
            const { active, designation, startDate, endDate } = filterOptions || {};
            return fetchReportCompanyLinkedUsers(active, designation, startDate, endDate);
        },
        ...queryOptions,
    });
};

export const useReportPlots = (filterOptions, queryOptions = {}) => {
    return useQuery({
        queryKey: ["report-plots", filterOptions],
        queryFn: () => {
            const { project, status, startDate, endDate } = filterOptions || {};
            return fetchReportPlots(status, project, startDate, endDate);
        },
        ...queryOptions,
    });
};

export const useReportSales = (filterOptions, queryOptions = {}) => {
    return useQuery({
        queryKey: ["report-sales", filterOptions],
        queryFn: () => {
            const { id, status, project, startDate, endDate, teamHeadId } = filterOptions || {};
            return fetchReportSales(id, status, project, startDate, endDate, teamHeadId);
        },
        ...queryOptions,
    });
};
