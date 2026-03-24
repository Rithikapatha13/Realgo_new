import { useState, useEffect } from "react";
import FormInput from "@/components/Common/FormInput";
import FileUpload from "@/components/Common/FileUpload";
import Button from "@/components/Common/Button";
import { useGetAllRoles } from "@/hooks/useRoles";
import { useAddAdminUser, useUpdateAdminUser } from "@/hooks/useAdmin";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function AdminForm({ action, item, onClose, onRefetch }) {
    const isUpdate = action === "Update";
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        alternativePhone: "",
        address: "",
        password: "",
        roleId: "",
        image: "",
        status: "PENDING",
    });

    const { data: rolesResponse, isLoading: rolesLoading } = useGetAllRoles();
    const roles = rolesResponse?.data?.items || [];

    const addAdminMutation = useAddAdminUser();
    const updateAdminMutation = useUpdateAdminUser();

    const isLoading = addAdminMutation.isLoading || updateAdminMutation.isLoading;

    useEffect(() => {
        if (isUpdate && item) {
            setFormData({
                id: item.id,
                username: item.username || "",
                firstName: item.firstName || "",
                lastName: item.lastName || "",
                email: item.email || "",
                phone: item.phone || "",
                alternativePhone: item.alternativePhone || "",
                address: item.address || "",
                password: item.password || "",
                roleId: item.roleId || "",
                image: item.image || "",
                status: item.status || "PENDING",
            });
        }
    }, [isUpdate, item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.roleId) {
            toast.error("Please select a role");
            return;
        }

        try {
            if (isUpdate) {
                await updateAdminMutation.mutateAsync(formData);
                toast.success("Admin updated successfully");
            } else {
                await addAdminMutation.mutateAsync(formData);
                toast.success("Admin added successfully");
            }
            onRefetch();
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    if (rolesLoading && !roles.length) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter username"
                />
                <FormInput
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter first name"
                />
                <FormInput
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                />
                <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                />
                <FormInput
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                />
                <FormInput
                    label="Alternative Phone"
                    name="alternativePhone"
                    type="tel"
                    value={formData.alternativePhone}
                    onChange={handleChange}
                    placeholder="Enter alternative phone"
                />

                <div className="sm:my-1 my-2">
                    <label className="text-sm font-medium text-slate-700">
                        Role <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="roleId"
                        className="w-full px-3 py-2 rounded-lg border-2 border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        value={formData.roleId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.roleName}
                            </option>
                        ))}
                    </select>
                </div>

                {!isUpdate && (
                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter password"
                    />
                )}

                <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Address</label>
                    <textarea
                        name="address"
                        className="w-full px-3 py-2 rounded-lg border-2 border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                    ></textarea>
                </div>

                <div className="md:col-span-2">
                    <FileUpload
                        label="Profile Image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        existingFile={formData.image}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={onClose} type="button">
                    Cancel
                </Button>
                <Button variant="primary" type="submit" loading={isLoading}>
                    {isUpdate ? "Update Admin" : "Add Admin"}
                </Button>
            </div>
        </form>
    );
}
