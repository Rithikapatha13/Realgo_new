import React, { useState, useEffect } from "react";
import Button from "@/components/Common/Button";
import FormInput from "@/components/Common/FormInput";
import { toast } from "react-hot-toast";
import { useAddRole, useUpdateRole } from "@/hooks/useRoles";
import { getUser } from "@/services/auth.service";

const MODULES_LIST = [
    "HOME",
    "PROFILE",
    "MY TEAM",
    "REPORTS",
    "PROJECTS",
    "PLOTS",
    "ADMIN",
    "REQUESTS",
    "ROLES",
    "USERS",
    "GREETINGS",
    "NEWS",
    "VIDEOS",
    "SHOWCASES",
    "SITE VISITS",
];

const ASSOCIATE_MODULES = [
    "PROFILE",
    "GREETINGS",
    "PLOTS",
    "NEWS",
    "SITE VISITS",
    "VIDEOS",
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

    const handleModuleToggle = (module) => {
        if (action === "View") return;
        setFormData((prev) => {
            const isSelected = prev.modules.includes(module);
            const updatedModules = isSelected
                ? prev.modules.filter((m) => m !== module)
                : [...prev.modules, module];
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Role Name"
                    value={formData.roleName}
                    onChange={(val) => setFormData({ ...formData, roleName: val })}
                    required
                    disabled={isView}
                    placeholder="e.g. Sales Manager"
                />
                <FormInput
                    label="Role Number"
                    type="number"
                    value={formData.roleNo}
                    onChange={(val) => setFormData({ ...formData, roleNo: val })}
                    required
                    disabled={isView}
                    placeholder="e.g. 110"
                />
                <FormInput
                    label="Display Name"
                    value={formData.displayName}
                    onChange={(val) => setFormData({ ...formData, displayName: val })}
                    required
                    disabled={isView}
                    placeholder="e.g. Sales Manager"
                />
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        disabled={isView}
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
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

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
