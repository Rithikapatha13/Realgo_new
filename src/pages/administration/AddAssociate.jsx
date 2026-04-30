import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAddUser, useGetPotentialParents } from "@/hooks/useUser";
import { useGetAllRoles } from "@/hooks/useRoles";
import { getUser } from "@/services/auth.service";
import toast from "react-hot-toast";
import { User, Mail, Phone, Shield, Calendar, MapPin, Save, X, Loader2, ChevronRight, ChevronLeft, Check, Award, Landmark, Briefcase, Heart, Fingerprint, ArrowLeft } from "lucide-react";
import FileUpload from "@/components/Common/FileUpload";
import CustomSelect from "@/components/Common/CustomSelect";

const STEPS = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Nominee & Address", icon: MapPin },
  { id: 3, title: "KYC & Bank", icon: Landmark },
  { id: 4, title: "Role & Assign", icon: Briefcase },
];

export default function AddAssociate() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const loggedInUser = getUser();
  const userType = (loggedInUser?.userType || "").toLowerCase();
  const isAssociateUser = userType === "user";

  const { register, handleSubmit, control, formState: { errors }, watch, trigger, setValue } = useForm({
    defaultValues: {
      status: "PENDING",
      gender: "MALE",
      bloodGroup: "O_POS",
      referId: isAssociateUser ? loggedInUser.id : "",
    }
  });

  const { mutateAsync: addUser, isPending: isAdding } = useAddUser();
  const { data: rolesResponse } = useGetAllRoles();
  const { data: parentsResponse } = useGetPotentialParents();

  const allRoles = rolesResponse?.roles || [];
  const rolesList = isAssociateUser 
    ? allRoles.filter(r => r.roleName.toLowerCase() === "associate" || r.roleName.toLowerCase() === "user")
    : allRoles;
    
  const parentsList = parentsResponse?.data?.items || [];

  // Auto-select associate role if only one is available
  useEffect(() => {
    if (isAssociateUser && rolesList.length > 0) {
      setValue("roleId", rolesList[0].id);
    }
  }, [isAssociateUser, rolesList, setValue]);

    const nextStep = async () => {
        // Validate current step before moving
        let fieldsToValidate = [];
        if (currentStep === 1) fieldsToValidate = ["firstName", "username", "phone", "email", "dob"];
        if (currentStep === 4) fieldsToValidate = ["roleId"];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        } else {
            toast.error("Please fill all required fields correctly before proceeding");
        }
    };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        companyId: loggedInUser.companyId,
        // Ensure numbers are handled correctly if needed
        income: data.income ? parseFloat(data.income) : 0,
      };

      await addUser(payload);
      toast.success("Associate created successfully!");
      navigate("/users");
    } catch (error) {
      console.error("Submission failed", error);
      toast.error(error.response?.data?.message || "Failed to create associate");
    }
  };

  const inputClasses = "w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium bg-white";
  const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-0 sm:px-4 py-4 sm:py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add New Associate</h1>
            <p className="text-slate-500 text-sm mt-1">Onboard a new member to your network hierarchy</p>
          </div>
          <button 
            onClick={() => navigate("/users")}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* STEPPER INDICATOR */}
        <div className="flex items-center justify-between mb-8 md:mb-12 relative px-2 sm:px-4">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
            {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                    <div key={step.id} className="flex flex-col items-center gap-3">
                        <div className={`
                            w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                            ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110 ring-4 ring-white" : ""}
                            ${isCompleted ? "bg-emerald-500 text-white" : ""}
                            ${!isActive && !isCompleted ? "bg-white text-slate-400 border-2 border-slate-200" : ""}
                        `}>
                            {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                            {step.title}
                        </span>
                    </div>
                )
            })}
        </div>

        {/* FORM CONTENT */}
        <div className="bg-white border-y sm:border border-slate-200 rounded-none sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* STEP 1: PERSONAL INFO */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className={labelClasses}>First Name *</label>
                    <input {...register("firstName", { required: "Required" })} className={inputClasses} placeholder="Enter first name" />
                    {errors.firstName && <span className="text-red-500 text-[10px] font-bold ml-1">{errors.firstName.message}</span>}
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Last Name</label>
                    <input {...register("lastName")} className={inputClasses} placeholder="Enter last name" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Username *</label>
                    <input {...register("username", { required: "Required" })} className={inputClasses} placeholder="unique_username" />
                  </div>
                  <div className="space-y-1">
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          label="Gender"
                          {...field}
                          options={[
                            { label: "Male", value: "MALE" },
                            { label: "Female", value: "FEMALE" },
                            { label: "Other", value: "OTHER" }
                          ]}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Phone Number *</label>
                    <input {...register("phone", { required: "Required" })} className={inputClasses} placeholder="+91 ..." />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Email Address</label>
                    <input {...register("email", { required: "Required" })} className={inputClasses} placeholder="example@mail.com" />
                    {errors.email && <span className="text-red-500 text-[10px] font-bold ml-1">{errors.email.message}</span>}
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Date of Birth *</label>
                    <input type="date" {...register("dob", { required: "Required" })} className={inputClasses} />
                  </div>
                  <div className="space-y-1">
                    <Controller
                      name="bloodGroup"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          label="Blood Group"
                          {...field}
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
            )}

            {/* STEP 2: NOMINEE & ADDRESS */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-1">
                    <label className={labelClasses}>Address Line</label>
                    <input {...register("addressLine")} className={inputClasses} placeholder="House / Street" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>City</label>
                    <input {...register("city")} className={inputClasses} placeholder="City Name" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>State</label>
                    <input {...register("state")} className={inputClasses} placeholder="State" />
                  </div>
                  <div className="space-y-1 border-t border-slate-100 pt-6 md:col-span-2 mt-2">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Heart size={14} className="text-rose-500" /> Nominee Information
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Nominee Name</label>
                    <input {...register("nomineeName")} className={inputClasses} placeholder="Full Name" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Relation</label>
                    <input {...register("nomineeRelation")} className={inputClasses} placeholder="Relationship" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Nominee Phone</label>
                    <input {...register("nomineePhone")} className={inputClasses} placeholder="Phone" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: KYC & BANK */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className={labelClasses}>Aadhaar Number</label>
                    <input {...register("aadharNo")} className={inputClasses} placeholder="12 Digit No" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>PAN Number</label>
                    <input {...register("panNo")} className={inputClasses} placeholder="ABCDE1234F" />
                  </div>
                  <div className="space-y-1 border-t border-slate-100 pt-6 md:col-span-2 mt-2">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Award size={14} className="text-amber-500" /> Bank Account Details
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Bank Name</label>
                    <input {...register("bankName")} className={inputClasses} placeholder="e.g. HDFC" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Branch</label>
                    <input {...register("branch")} className={inputClasses} placeholder="Branch Name" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Account Number</label>
                    <input {...register("bankAccountNo")} className={inputClasses} placeholder="0000000000" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>IFSC Code</label>
                    <input {...register("ifsc")} className={inputClasses} placeholder="IFSC0000000" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: ROLE & ASSIGN */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          options={rolesList.map(role => ({
                            label: role.displayName || role.roleName,
                            value: role.id
                          }))}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <Controller
                      name="referId"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          label="Immediate Leader / Upliner"
                          {...field}
                          disabled={isAssociateUser}
                          options={isAssociateUser ? [
                            { label: `${loggedInUser.firstName} ${loggedInUser.lastName} (You)`, value: loggedInUser.id }
                          ] : [
                            { label: "Direct (No Leader)", value: "" },
                            ...parentsList.map(parent => ({
                              label: parent.label,
                              value: parent.id
                            }))
                          ]}
                        />
                      )}
                    />
                  </div>
                  
                  <div className="md:col-span-2 pt-6">
                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                            <Fingerprint size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-indigo-900">Verification Pending</h4>
                            <p className="text-xs text-indigo-600/70 mt-1 leading-relaxed">
                                By default, new associates are created with a <b>PENDING</b> status. 
                                They will need to login and verify their details, or be manually verified by an administrator.
                            </p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NAV BUTTONS */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all border-2 border-transparent hover:border-slate-200"
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
              )}
              <div className="ml-auto flex gap-3">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                  >
                    Next Step
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="flex items-center gap-2 px-10 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50"
                  >
                    {isAdding ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Create Associate
                  </button>
                )}
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
