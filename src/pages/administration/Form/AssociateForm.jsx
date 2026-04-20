import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAddUser, useUpdateUser, useGetPotentialParents } from "@/hooks/useUser";
import { useGetAllRoles } from "@/hooks/useRoles";
import { getUser } from "@/services/auth.service";
import { resolveImageUrl } from "@/utils/common";
import toast from "react-hot-toast";
import { User, Mail, Phone, Shield, Calendar, MapPin, Save, X, Loader2, Maximize2, Users } from "lucide-react";
import FileUpload from "@/components/Common/FileUpload";
import CustomSelect from "@/components/Common/CustomSelect";

export default function AssociateForm({ item, action, onClose, onRefetch }) {
    const { register, handleSubmit, reset, control, formState: { errors }, watch } = useForm();
    const { mutateAsync: addUser, isPending: isAdding } = useAddUser();
    const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
    const { data: rolesResponse } = useGetAllRoles();
    const { data: parentsResponse } = useGetPotentialParents();
    const [zoomImage, setZoomImage] = useState(null);

    const loggedInUser = getUser();
    const roleName = (loggedInUser?.role || "").toUpperCase();
    const isAdmin = roleName === "COMPANY_ADMIN" || roleName === "ADMIN" || roleName === "SUPERADMIN";

    const rolesList = rolesResponse?.roles || [];
    const parentsList = parentsResponse?.data?.items || [];
    const watchedImage = watch("image");

    useEffect(() => {
        if (action === "Update" || action === "View") {
            reset({
                firstName: item?.firstName || "",
                lastName: item?.lastName || "",
                username: item?.username || "",
                email: item?.email || "",
                phone: item?.phone || "",
                alternativePhone: item?.alternativePhone || "",
                roleId: item?.roleId || item?.role?.id || "",
                referId: item?.referId || item?.teamHeadId || "",
                status: item?.status || "PENDING",
                gender: item?.gender || "",
                bloodGroup: item?.bloodGroup || "",
                dob: item?.dob ? new Date(item.dob).toISOString().split('T')[0] : "",
                address: item?.address || "",
                city: item?.city || "",
                state: item?.state || "",
                zipCode: item?.zipCode || "",
                country: item?.country || "",
                image: item?.image || "",
            });
        }
    }, [item, action, reset]);

    const isView = action === "View";
    const isPending = isAdding || isUpdating;

    const onSubmit = async (data) => {
        if (isView) return;

        try {
            const payload = {
                ...data,
                companyId: loggedInUser.companyId,
                // Default referId to current user if not provided (for non-admins)
                referId: data.referId || (isAdmin ? null : loggedInUser.id),
            };

            if (action === "Update") {
                payload.id = item.id;
                await updateUser(payload);
                toast.success("Associate updated successfully");
            } else {
                await addUser(payload);
                toast.success("Associate added successfully");
            }

            onRefetch?.();
            onClose?.();
        } catch (error) {
            console.error("Form submission failed", error);
            toast.error(error.response?.data?.message || "Failed to save associate");
        }
    };

    const inputClasses = "w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-slate-50 disabled:text-slate-400 font-medium bg-white";
    const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 bg-white px-0.5 sm:px-2 py-4">

            {/* SECTION: PROFILE PHOTO */}
            <div className="space-y-5">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
                    <User size={18} className="text-indigo-600" />
                    Profile Picture
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* ENLARGED VIEW / PREVIEW */}
                    <div 
                        className="relative group cursor-pointer w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex-shrink-0"
                        onClick={() => watchedImage && setZoomImage(watchedImage)}
                    >
                        {watchedImage ? (
                            <img 
                                src={resolveImageUrl(watchedImage)} 
                                alt="Profile" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-3xl uppercase italic">
                                {watch("username")?.charAt(0) || <User size={40} />}
                            </div>
                        )}
                        {watchedImage && (
                            <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="text-white" size={24} />
                            </div>
                        )}
                    </div>

                    {!isView && (
                        <div className="flex-1 w-full max-w-sm">
                            <Controller
                                name="image"
                                control={control}
                                render={({ field }) => (
                                    <FileUpload
                                        label=""
                                        existingFile={field.value}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        disabled={isView}
                                        showPreview={false} // Hidden as we use custom preview above
                                    />
                                )}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* SECTION: PERSONAL INFORMATION */}
            <div className="space-y-4 md:space-y-5">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
                    <User size={18} className="text-indigo-600" />
                    Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className={labelClasses}>First Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="John"
                            {...register("firstName", { required: "First Name is required" })}
                            disabled={isView}
                            className={inputClasses}
                        />
                        {errors.firstName && <span className="text-[10px] font-bold text-red-500 ml-1">{errors.firstName.message}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className={labelClasses}>Last Name</label>
                        <input
                            type="text"
                            placeholder="Doe"
                            {...register("lastName")}
                            disabled={isView}
                            className={inputClasses}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className={labelClasses}>Username <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="johndoe123"
                            {...register("username", { required: "Username is required" })}
                            disabled={isView}
                            className={inputClasses}
                        />
                        {errors.username && <span className="text-[10px] font-bold text-red-500 ml-1">{errors.username.message}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className={labelClasses}>Email Address</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            {...register("email")}
                            disabled={isView}
                            className={inputClasses}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className={labelClasses}>Phone Number <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            placeholder="+91 00000 00000"
                            {...register("phone", { required: "Phone is required" })}
                            disabled={isView}
                            className={inputClasses}
                        />
                        {errors.phone && <span className="text-[10px] font-bold text-red-500 ml-1">{errors.phone.message}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className={labelClasses}>Alternative Phone</label>
                        <input
                            type="tel"
                            placeholder="+91 00000 00000"
                            {...register("alternativePhone")}
                            disabled={isView}
                            className={inputClasses}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className={labelClasses}>Date of Birth</label>
                        <input
                            type="date"
                            {...register("dob")}
                            disabled={isView}
                            className={inputClasses}
                        />
                    </div>

                    <div className="space-y-1">
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    label="Gender"
                                    {...field}
                                    disabled={isView}
                                    options={[
                                        { label: "Male", value: "MALE" },
                                        { label: "Female", value: "FEMALE" },
                                        { label: "Other", value: "OTHER" }
                                    ]}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 md:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <Controller
                            name="bloodGroup"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    label="Blood Group"
                                    {...field}
                                    disabled={isView}
                                    options={[
                                        { label: "A+", value: "A_POS" },
                                        { label: "A-", value: "A_NEG" },
                                        { label: "B+", value: "B_POS" },
                                        { label: "B-", value: "B_NEG" },
                                        { label: "O+", value: "O_POS" },
                                        { label: "O-", value: "O_NEG" },
                                        { label: "AB+", value: "AB_POS" },
                                        { label: "AB-", value: "AB_NEG" }
                                    ]}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION: ACCESS & ROLE */}
            <div className="space-y-4 md:space-y-5">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
                    <Shield size={18} className="text-indigo-600" />
                    Access & Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <Controller
                            name="roleId"
                            control={control}
                            rules={{ required: "Role is required" }}
                            render={({ field }) => (
                                <CustomSelect
                                    label="Assigned Role"
                                    required
                                    {...field}
                                    error={errors.roleId?.message}
                                    disabled={isView}
                                    options={rolesList.map(role => ({
                                        label: role.displayName || role.roleName,
                                        value: role.id
                                    }))}
                                />
                            )}
                        />
                    </div>

                    {isAdmin && (
                        <div className="space-y-1">
                            <Controller
                                name="referId"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        label="Team Leader / Referrer"
                                        {...field}
                                        disabled={isView}
                                        options={[
                                            { label: "Direct (No Leader)", value: "" },
                                            ...parentsList.map(p => ({
                                                label: p.label,
                                                value: p.id
                                            }))
                                        ]}
                                    />
                                )}
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    label="Account Status"
                                    {...field}
                                    disabled={isView}
                                    options={["VERIFIED", "PENDING", "REJECT", "HOLD", "INACTIVE"]}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION: ADDRESS */}
            <div className="space-y-5">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
                    <MapPin size={18} className="text-indigo-600" />
                    Address & Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2 space-y-1">
                        <label className={labelClasses}>Complete Address</label>
                        <textarea
                            {...register("address")}
                            disabled={isView}
                            rows={3}
                            placeholder="Enter full address details here..."
                            className={`${inputClasses} resize-none`}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>City</label>
                        <input
                            type="text"
                            placeholder="Hyderabad"
                            {...register("city")}
                            disabled={isView}
                            className={inputClasses}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>State</label>
                        <input
                            type="text"
                            placeholder="Telangana"
                            {...register("state")}
                            disabled={isView}
                            className={inputClasses}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Zip Code</label>
                        <input
                            type="text"
                            placeholder="500001"
                            {...register("zipCode")}
                            disabled={isView}
                            className={inputClasses}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Country</label>
                        <input
                            type="text"
                            placeholder="India"
                            {...register("country")}
                            disabled={isView}
                            className={inputClasses}
                        />
                    </div>
                </div>
            </div>

            {/* FORM ACTIONS */}
            <div className="flex items-center justify-end gap-3 pt-8 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                    disabled={isPending}
                >
                    {isView ? "Close" : "Cancel"}
                </button>
                {!isView && (
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-10 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200/50 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : <Save size={18} />}
                        {isPending ? "Saving..." : action === "Create" ? "Add Associate" : "Update Profile"}
                    </button>
                )}
            </div>

            {/* LIGHTBOX OVERLAY */}
            {zoomImage && (
                <div 
                    className="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
                    onClick={() => setZoomImage(null)}
                >
                    <button className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-white transition-colors">
                        <X size={24} />
                    </button>
                    <div className="relative max-w-lg w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/20 animate-in zoom-in-95 duration-300">
                        <img 
                            src={resolveImageUrl(zoomImage)} 
                            alt="Zoomed" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}
        </form>
    );
}
