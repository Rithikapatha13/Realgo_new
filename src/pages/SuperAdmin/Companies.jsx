import React, { useState } from "react";
import { Plus, Search, Eye, Trash2, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Common/Button";
import ModalWrapper from "@/components/Common/ModalWrapper";
import CompanyForm from "./CompanyForm";
import { useGetCompaniesData, useDeleteCompany } from "@/hooks/useCompany";
import { toast } from "react-hot-toast";
import { resolveImageUrl } from "@/utils/common";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import DeleteCompanyModal from "./DeleteCompanyModal";

dayjs.extend(relativeTime);

export default function Companies() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  
  const { data: companiesResponse, isLoading, refetch } = useGetCompaniesData(page, limit, searchTerm);
  const deleteCompanyMutation = useDeleteCompany();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const companies = companiesResponse?.items || [];
  const total = companiesResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleView = (company) => {
    navigate(`/companies/${company.id}`);
  };

  const handleDelete = (company) => {
    setSelectedCompany(company);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCompanyMutation.mutateAsync(selectedCompany.id);
      toast.success("Company deleted successfully");
      setIsDeleteModalOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="text-primary-500" /> System Companies
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage all companies registered on the platform
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-9 pr-4 py-2 border rounded-full text-sm outline-none w-64 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2 rounded-full px-5 py-2">
            <Plus size={16} /> New Company
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex justify-center items-center">
            <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Company</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Email</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Phone</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Registered</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-center">Modules</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((company) => (
                    <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                      {/* COMPANY CELL - with status dot */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center font-bold text-slate-400">
                              {company.img ? (
                                <img
                                  src={resolveImageUrl(company.img)}
                                  alt=""
                                  className="w-full h-full object-contain p-1"
                                />
                              ) : (
                                company.company.charAt(0).toUpperCase()
                              )}
                            </div>
                            {/* Status dot on logo */}
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                              company.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                            }`} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate max-w-[140px]">{company.company}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[140px]">{company.domain || "—"}</p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="py-3 px-4">
                        <p className="text-xs text-slate-600 max-w-[150px] break-all leading-snug">{company.email}</p>
                      </td>

                      {/* PHONE */}
                      <td className="py-3 px-4">
                        <p className="text-sm text-slate-700 font-medium">{company.phone || "—"}</p>
                      </td>

                      {/* REGISTERED */}
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-700 font-medium">{dayjs(company.createdAt).format("DD MMM YYYY")}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{dayjs(company.createdAt).fromNow()}</div>
                      </td>

                      {/* MODULES COUNT */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
                          {company.modules?.length || 0}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleView(company)}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(company)}
                            className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
                            title="Delete Company"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
                {companies.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      No companies found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} companies
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ModalWrapper
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Company"
      >
        <CompanyForm
          company={null}
          action="Create"
          onClose={() => setIsModalOpen(false)}
          onRefetch={refetch}
        />
      </ModalWrapper>

      <DeleteCompanyModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        companyName={selectedCompany?.company}
        isLoading={deleteCompanyMutation.isPending}
      />
    </div>
  );
}
