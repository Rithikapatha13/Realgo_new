import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAddAdminUser, useUpdateAdminUser } from "@/hooks/useAdmin";
import { useGetAllRoles } from "@/hooks/useRoles";
import Button from "@/components/Common/Button";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, MapPin, Building2, CreditCard, Users, Shield, Lock } from "lucide-react";

const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6 last:mb-0">
        <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-white rounded-xl shadow-sm text-primary-500">
                <Icon size={18} />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
        </div>
    </div>
);

const InputField = ({ label, name, register, errors, type = "text", required = false, disabled = false }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label} {required && "*"}</label>
        <input
            {...register(name, { required })}
            type={type}
            disabled={disabled}
            className={`w-full h-11 px-4 bg-white border ${errors[name] ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500'} rounded-2xl text-sm font-medium transition-all outline-none disabled:opacity-50`}
        />
    </div>
);

const SelectField = ({ label, name, register, options, errors, required = false, disabled = false }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label} {required && "*"}</label>
        <select
            {...register(name, { required })}
            disabled={disabled}
            className={`w-full h-11 px-4 bg-white border ${errors[name] ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500'} rounded-2xl text-sm font-medium transition-all outline-none disabled:opacity-50 appearance-none`}
        >
            <option value="">Select {label}</option>
            {options.map(opt => <option key={opt.id || opt.value} value={opt.id || opt.value}>{opt.displayName || opt.label || opt.roleName}</option>)}
        </select>
    </div>
);

export default function AdminForm({ item, action, onClose, onRefetch }) {
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();
    const { data: rolesData } = useGetAllRoles();
    const addMutation = useAddAdminUser();
    const updateMutation = useUpdateAdminUser();

    const roles = rolesData?.roles || [];
    const isView = action === "View";

    useEffect(() => {
        if (item) {
            reset(item);
        }
    }, [item, reset]);

    const onSubmit = async (data) => {
        if (isView) return;
        try {
            if (action === "Create") {
                await addMutation.mutateAsync(data);
                toast.success("Administrator created successfully");
            } else {
                await updateMutation.mutateAsync({ ...data, id: item.id });
                toast.success("Administrator updated successfully");
            }
            onRefetch();
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Basic Information" icon={User}>
                <InputField label="Full Name" name="username" register={register} errors={errors} required disabled={isView} />
                {action === "Create" && (
                    <InputField label="Password" name="password" type="password" register={register} errors={errors} required />
                )}
                <InputField label="Phone Number" name="phone" register={register} errors={errors} required disabled={isView} />
                <InputField label="Email Address" name="email" type="email" register={register} errors={errors} required disabled={isView} />
                <InputField label="Alternative Phone" name="alternativePhone" register={register} errors={errors} disabled={isView} />
            </Section>

            <Section title="Role & Status" icon={Shield}>
                <SelectField 
                    label="Role" 
                    name="roleId" 
                    register={register} 
                    errors={errors} 
                    required 
                    disabled={isView}
                    options={roles}
                />
                <SelectField 
                    label="Status" 
                    name="status" 
                    register={register} 
                    errors={errors} 
                    disabled={isView}
                    options={[
                        { value: 'VERIFIED', label: 'Verified' },
                        { value: 'PENDING', label: 'Pending' },
                        { value: 'INACTIVE', label: 'Inactive' }
                    ]}
                />
            </Section>

            {!isView && (
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        loading={addMutation.isPending || updateMutation.isPending}
                    >
                        {action === "Create" ? "Create Administrator" : "Save Changes"}
                    </Button>
                </div>
            )}
        </form>
    );
}
