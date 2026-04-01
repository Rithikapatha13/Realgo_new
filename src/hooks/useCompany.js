import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getCompanies,
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "@/services/company.service";
import { toast } from "react-hot-toast";

// ======================== Queries ========================

export const useGetCompaniesData = (page = 1, limit = 10, name = "") => {
  return useQuery({
    queryKey: ["companies", page, limit, name],
    queryFn: async () => {
      const { data } = await getCompanies({ page, size: limit, name });
      return data;
    },
    keepPreviousData: true,
  });
};

export const useGetCompanyById = (id) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await getCompanyById(id);
      return data;
    },
    enabled: !!id,
  });
};

// ======================== Mutations ========================

export const useCreateCompany = () => {
  return useMutation({
    mutationFn: async (companyData) => {
      const { data } = await createCompany(companyData);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Company created successfully");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create company");
    },
  });
};

export const useUpdateCompany = () => {
  return useMutation({
    mutationFn: async ({ id, ...companyData }) => {
      const { data } = await updateCompany(id, companyData);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Company updated successfully");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update company");
    },
  });
};

export const useDeleteCompany = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await deleteCompany(id);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Company deleted successfully");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete company");
    },
  });
};
