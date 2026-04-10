import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  FolderTree,
  MapPin as MapPinIcon,
  ShieldCheck,
  Edit3,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { useGetCompanyById } from "@/hooks/useCompany";
import { resolveImageUrl } from "@/utils/common";
import Button from "@/components/Common/Button";
import ModalWrapper from "@/components/Common/ModalWrapper";
import CompanyForm from "./CompanyForm";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: company, isLoading, isError } = useGetCompanyById(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-medium">Loading company profile...</div>;
  if (isError || !company) return <div className="p-8 text-center text-red-500 font-medium">Error loading company details.</div>;

  const companyData = company.data;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* BACK BUTTON & ACTIONS */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Back to Companies
        </button>

        <Button
          variant="primary"
          className="rounded-2xl px-6 py-2.5 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md transform hover:scale-[1.02] transition-all"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit3 size={18} />
          Edit Company
        </Button>
      </div>

      {/* HEADER CARD (Matching Profile Style) */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="h-32 bg-white border-b border-slate-100 relative">
          {/* Company Logo Overlay */}
          <div className="absolute -bottom-12 left-10">
            <div className="w-24 h-24 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden p-2">
              <img
                src={resolveImageUrl(companyData.img)}
                alt={companyData.company}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{companyData.company}</h1>
                <StatusBadge status={companyData.status} />
              </div>
              <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-xs flex items-center gap-2">
                <Globe size={14} />
                {companyData.domain || "no-domain.com"}
              </p>
            </div>

            {/* QUICK STATS */}
            <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-10">
              <QuickStat
                icon={Users}
                label="Total Users"
                value={(companyData._count?.users || 0) + (companyData._count?.admins || 0)}
                color="text-indigo-600 bg-indigo-50"
              />
              <QuickStat
                icon={FolderTree}
                label="Projects"
                value={companyData._count?.projects || 0}
                color="text-emerald-600 bg-emerald-50"
              />
              <QuickStat
                icon={MapPinIcon}
                label="Total Plots"
                value={companyData._count?.plots || 0}
                color="text-orange-600 bg-orange-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: PRIMARY DETAILS (Matching Image 3 Academic History/Personal Details style) */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Company Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
              <InfoField icon={Mail} label="Official Email" value={companyData.email} />
              <InfoField icon={Phone} label="Contact Number" value={companyData.phone} />
              <InfoField icon={MapPin} label="Office Address" value={companyData.address || "N/A"} className="sm:col-span-2" />
              <InfoField
                icon={Calendar}
                label="Registered Date"
                value={dayjs(companyData.createdAt).format("DD MMM YYYY")}
                subValue={dayjs(companyData.createdAt).fromNow()}
              />
              <InfoField icon={ShieldCheck} label="System Role" value="Subscribed Company" />
            </div>
          </section>

          {/* MODULES LIST */}
          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Enabled Modules</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(companyData.modules || []).map((mod, idx) => (
                <div key={idx} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-wider shadow-sm">
                  {mod}
                </div>
              ))}
              {(companyData.modules || []).length === 0 && <p className="text-slate-400 text-sm">No specific modules enabled.</p>}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: PRIMARY ADMINISTRATOR */}
        <div className="space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6 border-b border-indigo-500/20 pb-2">Primary Administrator</h3>
            
            {companyData.clientAdmins?.[0] ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {companyData.clientAdmins[0].firstName} {companyData.clientAdmins[0].lastName}
                    </p>
                    <p className="text-xs text-slate-400">Company Owner</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <AdminInfoField icon={Phone} label="Phone" value={companyData.clientAdmins[0].phone} />
                  <AdminInfoField icon={Mail} label="Email" value={companyData.clientAdmins[0].email} />
                  <AdminInfoField 
                    icon={ShieldCheck} 
                    label="Status" 
                    value={companyData.clientAdmins[0].status} 
                    color="text-emerald-400"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle size={32} className="text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No admin assigned yet.</p>
                <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">Click Edit Company to Add Owner</p>
              </div>
            )}
          </section>

          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <Calendar size={32} className="text-slate-400" />
            </div>
            <h4 className="text-slate-800 font-bold">Registration Reference</h4>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest break-all font-mono">{companyData.id}</p>
          </section>
        </div>
      </div>

      {/* EDIT MODAL */}
      <ModalWrapper
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Company"
        width="max-w-2xl"
      >
        <CompanyForm
          company={companyData}
          action="Update"
          onClose={() => setIsEditModalOpen(false)}
          onRefetch={() => {
            queryClient.invalidateQueries(["company", id]);
            setIsEditModalOpen(false);
          }}
        />
      </ModalWrapper>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 group-hover:text-slate-500 transition-colors">{label}</p>
      </div>
    </div>
  );
}

function InfoField({ icon: Icon, label, value, subValue, className = "" }) {
  return (
    <div className={`flex gap-4 group ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all duration-300">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-900 transition-colors">{value}</p>
        {subValue && <p className="text-[10px] text-slate-400 mt-0.5">{subValue}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const configs = {
    ACTIVE: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2, label: "Active Account" },
    INACTIVE: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: Clock, label: "On Hold" },
    DELETED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: AlertCircle, label: "Pending Removal" }
  };

  const config = configs[status] || configs.INACTIVE;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} text-[10px] font-bold uppercase tracking-wider`}>
      <Icon size={12} strokeWidth={3} />
      {config.label}
    </div>
  );
}

function BenefitItem({ label }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
      <div className="w-1 h-1 rounded-full bg-indigo-400" />
      {label}
    </div>
  );
}

function AdminInfoField({ icon: Icon, label, value, color = "text-slate-300" }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={14} className="text-indigo-400" />
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className={`text-xs font-medium ${color}`}>{value}</p>
      </div>
    </div>
  );
}
