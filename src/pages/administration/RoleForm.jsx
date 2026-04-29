
import React, { useState, useEffect } from "react";
import Button from "@/components/Common/Button";
import FormInput from "@/components/Common/FormInput";
import { toast } from "react-hot-toast";
import { useAddRole, useUpdateRole } from "@/hooks/useRoles";
import { getUser } from "@/services/auth.service";
import CustomSelect from "@/components/Common/CustomSelect";

const MODULES_LIST = [
    "ADMIN",
    "USER",
    "ROLES",
    "PROFILE",
    "GREETINGS",
    "PROJECT STATUS",
    "PROJECTS",
    "PHASES",
    "PLOTS",
    "FOLLOWUP",
    "LEADS",
    "NEWS",
    "NOTES",
    "REMINDERS",
    "SITEVISITS",
    "CUSTOMER SITEVISITS",
    "VIDEOS",
    "REQUESTS",
    "ACCOUNTS",
    "VEHICLE SITEVISITS",
    "SHOWCASE",
    "PROJECT INCENTIVES",
];

const ASSOCIATE_MODULES = [
    'PROFILE',
    'GREETINGS',
    'PLOTS',
    'FOLLOWUP',
    'LEADS',
    'NEWS',
    'NOTES',
    'REMINDERS',
    'SITEVISITS',
    'VIDEOS',
];

const RoleForm = ({ role, action, onClose, onRefetch }) => {
    const user = getUser();
    const [formData, setFormData] = useState({
        roleName: "",
        displayName: "",
        roleNo: "",
        modules: [],
        status: "ACTIVE",
    });

    const addRoleMutation = useAddRole();
    const updateRoleMutation = useUpdateRole();

    useEffect(() => {
        if (role && (action === "Update" || action === "View")) {
            setFormData({
                roleName: role.roleName || "",
                displayName: role.displayName || "",
                roleNo: role.roleNo || "",
                modules: Array.isArray(role.modules) ? role.modules : [],
                status: role.status || "ACTIVE",
            });
        }
    }, [role, action]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleModuleToggle = (module) => {
        if (action === "View") return;
        setFormData((prev) => {
            const isSelected = prev.modules.includes(module);
            let updatedModules = [...prev.modules];

            if (isSelected) {
                // Remove module
                updatedModules = updatedModules.filter((m) => m !== module);
                
                // If it was part of a group, maybe we don't automatically remove others?
                // Garuda doesn't seem to automatically remove others on uncheck, but it warns.
                // Let's keep it simple: just remove the clicked one.
            } else {
                // Add module
                if (["ADMIN", "USER", "ROLES"].includes(module)) {
                    // Group 1: Admin
                    updatedModules = [...new Set([...updatedModules, "ADMIN", "USER", "ROLES"])];
                } else if (["PROJECTS", "PHASES", "PROJECT STATUS"].includes(module)) {
                    // Group 2: Projects
                    updatedModules = [...new Set([...updatedModules, "PROJECTS", "PHASES", "PROJECT STATUS", "PLOTS"])];
                } else {
                    updatedModules.push(module);
                }
            }
            
            return { ...prev, modules: updatedModules };
        });
    };

    const handleAutoSelectAssociate = (e) => {
        if (action === "View") return;
        const checked = e.target.checked;
        setFormData((prev) => {
            let updatedModules = [...prev.modules];
            if (checked) {
                updatedModules = [...new Set([...updatedModules, ...ASSOCIATE_MODULES])];
            } else {
                updatedModules = updatedModules.filter((m) => !ASSOCIATE_MODULES.includes(m));
            }
            return { ...prev, modules: updatedModules };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (action === "View") return;

        if (!formData.roleName || !formData.displayName || !formData.roleNo) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const payload = {
                ...formData,
                companyId: user.companyId,
                companyName: user.companyName,
                roleNo: parseInt(formData.roleNo),
            };

            if (action === "Update") {
                await updateRoleMutation.mutateAsync({ id: role.id, ...payload });
                toast.success("Role updated successfully");
            } else {
                await addRoleMutation.mutateAsync(payload);
                toast.success("Role created successfully");
            }
            onRefetch();
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || `Failed to ${action.toLowerCase()} role`);
        }
    };

    const isView = action === "View";

    return (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 px-0.5 sm:px-2 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Role Name"
                    name="roleName"
                    value={formData.roleName}
                    onChange={handleChange}
                    required
                    disabled={isView}
                    placeholder="e.g. Sales Manager"
                />
                <FormInput
                    label="Role Number"
                    name="roleNo"
                    type="number"
                    value={formData.roleNo}
                    onChange={handleChange}
                    required
                    disabled={isView}
                    placeholder="e.g. 110"
                />
                <FormInput
                    label="Display Name"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                    disabled={isView}
                    placeholder="e.g. Sales Manager"
                />
                <div className="flex flex-col gap-1.5">
                    <CustomSelect
                        label="Status"
                        value={formData.status}
                        onChange={(val) => setFormData({ ...formData, status: val })}
                        disabled={isView}
                        options={[
                            { label: "Active", value: "ACTIVE" },
                            { label: "Inactive", value: "INACTIVE" }
                        ]}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-md font-semibold text-gray-800">Permissions (Modules)</h3>
                    {!isView && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="autoSelect"
                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                onChange={handleAutoSelectAssociate}
                            />
                            <label htmlFor="autoSelect" className="text-xs font-medium text-primary-600 cursor-pointer">
                                Auto-select Associate Modules
                            </label>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {MODULES_LIST.map((module) => (
                        <div
                            key={module}
                            onClick={() => handleModuleToggle(module)}
                            className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${formData.modules.includes(module)
                                ? "bg-primary-50 border-primary-200 text-primary-700 font-medium"
                                : "bg-white border-gray-200 text-gray-600 grayscale opacity-70"
                                } ${isView ? "cursor-default" : "hover:border-primary-300"}`}
                        >
                            <div
                                className={`w-3 h-3 rounded-full ${formData.modules.includes(module) ? "bg-primary-600" : "bg-gray-300"
                                    }`}
                            />
                            <span className="text-xs uppercase tracking-wider">{module}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={onClose} type="button">
                    {isView ? "Close" : "Cancel"}
                </Button>
                {!isView && (
                    <Button
                        variant="primary"
                        type="submit"
                        loading={addRoleMutation.isPending || updateRoleMutation.isPending}
                    >
                        {action} Role
                    </Button>
                )}
            </div>
        </form>
    );
};

export default RoleForm;
