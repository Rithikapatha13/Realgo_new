import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useGetAllRoles } from "@/hooks/useRoles";
import { useAddAdminUser, useUpdateAdminUser } from "@/hooks/useAdmin";
import { getUser } from "@/services/auth.service";
import { resolveImageUrl } from "@/utils/common";
import toast from "react-hot-toast";
import { 
    User, Mail, Phone, Shield, Calendar, MapPin, Save, 
    X, Loader2, Maximize2, Landmark, CreditCard, Heart, CheckSquare, Eye, EyeOff 
} from "lucide-react";
import FileUpload from "@/components/Common/FileUpload";

export default function AdminForm({ action, item, onClose, onRefetch }) {
    const { register, handleSubmit, reset, control, formState: { errors }, watch } = useForm();
    const addAdminMutation = useAddAdminUser();
    const updateAdminMutation = useUpdateAdminUser();
    const { data: rolesResponse, isLoading: rolesLoading } = useGetAllRoles();
    const [zoomImage, setZoomImage] = useState(null);

    const loggedInUser = getUser();
    const rolesList = rolesResponse?.roles || rolesResponse?.items || [];
    const watchedImage = watch("image");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (action === "Update" && item) {
            reset({
                id: item.id,
                username: item.username || "",
                firstName: item.firstName || "",
                lastName: item.lastName || "",
                email: item.email || "",
                phone: item.phone || "",
                alternativePhone: item.alternativePhone || "",
                address: item.address || "",
                roleId: item.roleId || "",
                image: item.image || "",
                status: item.status || "PENDING",
                fatherOrHusband: item.fatherOrHusband || "",
                gender: item.gender || "",
                bloodGroup: item.bloodGroup || "",
                dob: item.dob ? new Date(item.dob).toISOString().split('T')[0] : "",
                aadharNo: item.aadharNo || "",
                panNo: item.panNo || "",
                bankName: item.bankName || "",
                branch: item.branch || "",
                accountHolder: item.accountHolder || "",
                bankAccountNo: item.bankAccountNo || "",
                ifsc: item.ifsc || "",
                nomineeName: item.nomineeName || "",
                nomineePhone: item.nomineePhone || "",
                nomineeRelation: item.nomineeRelation || "",
                city: item.city || "",
                state: item.state || "",
                zipCode: item.zipCode || "",
                country: item.country || "",
                isModuleHead: item.isModuleHead || false,
            });
        }
    }, [item, action, reset]);

    const isLoading = addAdminMutation.isLoading || updateAdminMutation.isLoading;

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                companyId: loggedInUser.companyId,
            };

            if (action === "Update") {
                await updateAdminMutation.mutateAsync(payload);
                toast.success("Admin updated successfully");
            } else {
                await addAdminMutation.mutateAsync(payload);
                toast.success("Admin added successfully");
            }

            onRefetch?.();
            onClose?.();
        } catch (error) {
            console.error("Form submission failed", error);
            toast.error(error.response?.data?.message || "Failed to save admin");
        }
    };

    const inputClasses = "w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-slate-50 disabled:text-slate-400 font-medium bg-white";
    const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1";
    const sectionHeaderClasses = "text-sm font-black text-slate-800 flex items-center gap-2 border-l-4 border-indigo-600 pl-3 mb-6";

    if (rolesLoading && !rolesList.length) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 bg-white p-2 max-h-[80vh] overflow-y-auto no-scrollbar">

            {/* SECTION: PROFILE PHOTO */}
            <div className="space-y-5">
                <h3 className={sectionHeaderClasses}>
                    <User size={18} className="text-indigo-600" />
                    Profile Picture
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-8">
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
                    </div>

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
                                    showPreview={false}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION: PERSONAL INFORMATION */}
            <div className="space-y-5">
                <h3 className={sectionHeaderClasses}>
                    <User size={18} className="text-indigo-600" />
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                        <label className={labelClasses}>First Name <span className="text-red-500">*</span></label>
                        <input type="text" {...register("firstName", { required: "Required" })} className={inputClasses} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Last Name</label>
                        <input type="text" {...register("lastName")} className={inputClasses} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Father/Husband Name</label>
                        <input type="text" {...register("fatherOrHusband")} className={inputClasses} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Gender</label>
                        <select {...register("gender")} className={inputClasses}>
                            <option value="">Select</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Date of Birth</label>
                        <input type="date" {...register("dob")} className={inputClasses} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Blood Group</label>
                        <select {...register("bloodGroup")} className={inputClasses}>
                            <option value="">Select</option>
                            {["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"].map(bg => (
                                <option key={bg} value={bg}>{bg.replace("_", " ")}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* SECTION: ACCESS & ROLE */}
            <div className="space-y-5">
                <h3 className={sectionHeaderClasses}>
                    <Shield size={18} className="text-indigo-600" />
                    Access & Leadership
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className={labelClasses}>Username <span className="text-red-500">*</span></label>
                        <input type="text" {...register("username", { required: "Required" })} className={inputClasses} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Assigned Role <span className="text-red-500">*</span></label>
                        <select {...register("roleId", { required: "Required" })} className={inputClasses}>
                            <option value="">Choose a Role</option>
                            {rolesList.map(role => (
                                <option key={role.id} value={role.id}>{role.displayName || role.roleName}</option>
                            ))}
                        </select>
                    </div>
                    {action !== "Update" && (
                        <div className="space-y-1 relative">
                            <label className={labelClasses}>Initial Password <span className="text-red-500">*</span></label>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                {...register("password", { required: "Required" })} 
                                className={inputClasses} 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-4 p-4 border-2 border-indigo-50 bg-indigo-50/30 rounded-2xl md:col-span-2">
                        <div className="flex-1">
                            <h4 className="text-xs font-black text-indigo-900 uppercase">Designate as Module Head</h4>
                            <p className="text-[10px] text-indigo-600 font-medium">This admin will be recognized as a leader for their module.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" {...register("isModuleHead")} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* SECTION: CONTACT & LOCATION */}
            <div className="space-y-5">
                <h3 className={sectionHeaderClasses}>
                    <Phone size={18} className="text-indigo-600" />
                    Contact & Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className={labelClasses}>Phone Number <span className="text-red-500">*</span></label>
                        <input type="tel" {...register("phone", { required: "Required" })} className={inputClasses} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Alternative Phone</label>
                        <input type="tel" {...register("alternativePhone")} className={inputClasses} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label className={labelClasses}>Email Address</label>
                        <input type="email" {...register("email")} className={inputClasses} />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className={labelClasses}>Address</label>
                        <textarea {...register("address")} rows={2} className={`${inputClasses} resize-none`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <div className="space-y-1">
                            <label className={labelClasses}>City</label>
                            <input type="text" {...register("city")} className={inputClasses} />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>State</label>
                            <input type="text" {...register("state")} className={inputClasses} />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Zip Code</label>
                            <input type="text" {...register("zipCode")} className={inputClasses} />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Country</label>
                            <input type="text" {...register("country")} className={inputClasses} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION: DOCUMENTS */}
            <div className="space-y-5">
                <h3 className={sectionHeaderClasses}>
                    <CheckSquare size={18} className="text-indigo-600" />
                    Identity Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className={labelClasses}>Aadhar Number</label>
                        <input type="text" {...register("aadharNo")} className={inputClasses} placeholder="0000-0000-0000" />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>PAN Number</label>
                        <input type="text" {...register("panNo")} className={inputClasses} placeholder="ABCDE1234F" />
                    </div>
                </div>
            </div>

            {/* SECTION: BANKING */}
            <div className="space-y-5">
                <h3 className={sectionHeaderClasses}>
                    <Landmark size={18} className="text-indigo-600" />
                    Banking Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className={labelClasses}>Bank Name</label>
                        <input type="text" {...register("bankName")} className={inputClasses} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Account Number</label>
                        <input type="text" {...register("bankAccountNo")} className={inputClasses} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>IFSC Code</label>
                        <input type="text" {...register("ifsc")} className={inputClasses} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Branch</label>
                        <input type="text" {...register("branch")} className={inputClasses} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label className={labelClasses}>Account Holder Name</label>
                        <input type="text" {...register("accountHolder")} className={inputClasses} />
                    </div>
                </div>
            </div>

            {/* SECTION: NOMINEE */}
            <div className="space-y-5 pb-4">
                <h3 className={sectionHeaderClasses}>
                    <Heart size={18} className="text-indigo-600" />
                    Nominee Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                        <label className={labelClasses}>Nominee Name</label>
                        <input type="text" {...register("nomineeName")} className={inputClasses} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Relation</label>
                        <input type="text" {...register("nomineeRelation")} className={inputClasses} />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Contact Number</label>
                        <input type="tel" {...register("nomineePhone")} className={inputClasses} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 sticky bottom-0 bg-white z-10 py-4">
                <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-10 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2">
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {action === "Update" ? "Update Leader" : "Add Leader"}
                </button>
            </div>

            {/* LIGHTBOX OVERLAY */}
            {zoomImage && (
                <div className="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in" onClick={() => setZoomImage(null)}>
                    <div className="relative max-w-lg w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-white/20">
                        <img src={resolveImageUrl(zoomImage)} alt="Zoomed" className="w-full h-full object-cover" />
                    </div>
                </div>
            )}
        </form>
    );
}
