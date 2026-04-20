import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, Activity, Users, Settings, FolderTree, MapPin, Eye, Pencil, Trash2, UserCheck, UserX, ArrowLeft } from "lucide-react";
import { getCompanyDashboard } from "../../services/company.service";
import { resolveImageUrl } from "@/utils/common";
import CompanyForm from "./CompanyForm";
import ModalWrapper from "@/components/Common/ModalWrapper";
import DeleteCompanyModal from "./DeleteCompanyModal";
import { useDeleteCompany } from "@/hooks/useCompany";
import { toast } from "react-hot-toast";

export default function SystemDashboard() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("Create");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteCompanyMutation = useDeleteCompany();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await getCompanyDashboard();
      if (data.success) {
        setCompanies(data.data.companies || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setModalAction("Update");
    setIsModalOpen(true);
  };

  const handleView = (company) => {
    setSelectedCompany(company);
    setModalAction("View");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (company) => {
    setSelectedCompany(company);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCompanyMutation.mutateAsync(selectedCompany.id);
      toast.success("Company deleted successfully");
      setIsDeleteModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      // toast.error handled by hook
    }
  };

  const activeCompanies = companies.filter((c) => c.status === "ACTIVE").length;

  // Global Stat Calculations
  const totalUsers = companies.reduce((acc, c) => acc + (c._count?.users || 0) + (c._count?.admins || 0), 0);
  const activeUsers = companies.filter(c => c.status === "ACTIVE").reduce((acc, c) => acc + (c._count?.users || 0) + (c._count?.admins || 0), 0);
  const inactiveUsers = companies.filter(c => c.status === "INACTIVE").reduce((acc, c) => acc + (c._count?.users || 0) + (c._count?.admins || 0), 0);
  const totalProjects = companies.reduce((acc, c) => acc + (c._count?.projects || 0), 0);
  const totalPlots = companies.reduce((acc, c) => acc + (c._count?.plots || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">
          Global overview of registered companies and system-wide activity.
        </p>
      </div>

      {/* KPI STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KpiCard
          title="Total Companies"
          value={companies.length}
          icon={Landmark}
        />
        <KpiCard
          title="Total Projects"
          value={totalProjects}
          icon={FolderTree}
        />
        <KpiCard
          title="Total Plots"
          value={totalPlots}
          icon={MapPin}
        />
        <KpiCard
          title="Active Users"
          value={activeUsers}
          icon={UserCheck}
          color="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          title="Inactive Users"
          value={inactiveUsers}
          icon={UserX}
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* COMPANiES GRID */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Company Overview
        </h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary-500 animate-spin" />
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center">
            <p className="text-slate-500">No companies found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary-600 font-bold overflow-hidden border border-slate-100 shadow-sm p-1">
                      {company.img ? (
                        <img 
                          src={resolveImageUrl(company.img)} 
                          alt="Logo" 
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        company.company.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 line-clamp-1">
                        {company.company}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {company.domain || company.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      company.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {company.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Engagement</div>
                    <div className="text-sm font-semibold text-slate-700">{(company._count?.users || 0) + (company._count?.admins || 0)} Users</div>
                  </div>
                  <div className="border-l border-slate-100 pl-4">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Inventory</div>
                    <div className="text-sm font-semibold text-slate-700">{company._count?.projects || 0} / {company._count?.plots || 0}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>{company.modules?.length || 0} Modules</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalWrapper
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalAction} Company`}
      >
        <CompanyForm
          company={selectedCompany}
          action={modalAction}
          onClose={() => setIsModalOpen(false)}
          onRefetch={fetchDashboardData}
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

function KpiCard({ title, value, icon: Icon, color = "bg-primary-50 text-primary-500" }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
      </div>
    </div>
  );
}
