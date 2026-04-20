import { useState, useEffect } from "react";
import {
  User,
  Lock,
  LogOut,
  Edit,
  Images,
  Pencil,
  Key,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  UserCheck,
  Building2,
  MapPin,
  RefreshCcw,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import FormInput from "../../components/Common/FormInput";
import ModalWrapper from "../../components/Common/ModalWrapper";
import FileInput from "../../components/Common/FileUpload";
import {
  changepassword,
  getUser,
  updateLocalUser,
} from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { resolveImageUrl } from "../../utils/common";
import toast from "react-hot-toast";
import { updateProfile } from "../../services/common.service";

export default function Profile() {
  const navigate = useNavigate();
  const user = getUser();

  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Template Selection State
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [tempTemplate, setTempTemplate] = useState(1);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("selectedTemplate");
    if (stored) {
      setSelectedTemplate(parseInt(stored));
      setTempTemplate(parseInt(stored));
    }
  }, []);

  const handleConfirmTemplate = () => {
    setSelectedTemplate(tempTemplate);
    localStorage.setItem("selectedTemplate", tempTemplate.toString());
    setIsTemplateModalOpen(false);
    toast.success("Template style updated!");
  };

  // Edit State
  const [editData, setEditData] = useState({
    username: user?.userName || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
    gender: user?.gender || "",
    image: user?.image || "",
  });

  const [profileImagePreview, setProfileImagePreview] = useState(
    user?.image ? resolveImageUrl(user.image) : null
  );

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const path = e.target.value;
    setEditData(prev => ({ ...prev, image: path }));
    setProfileImagePreview(resolveImageUrl(path));
  };

  const confirmChangePassword = async () => {
    if (!newPassword) return toast.error("Please enter a new password");
    try {
      setUpdating(true);
      const res = await changepassword(user.phone, user.companyId, newPassword);
      toast.success(res.message);
      setIsPasswordModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setUpdating(true);
      const payload = {
        id: user.id,
        userType: user.userType || user.role,
        ...editData
      };

      await updateProfile(payload);

      const updatedUser = {
        ...user,
        userName: editData.username,
        email: editData.email,
        image: editData.image,
        firstName: editData.firstName,
        lastName: editData.lastName,
        phone: editData.phone,
        dob: editData.dob,
        gender: editData.gender
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      updateLocalUser(editData.username, editData.email, editData.image);

      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32 p-4">
      
      {/* HEADER SECTION with Gradient Banner - Matched to realgo old */}
      <div className="relative w-full flex flex-col items-center">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r opacity-50 from-[#160a70] to-[#fec200] rounded-b-lg shadow-lg"></div>
        <div className="flex justify-center pt-20 pb-2 z-10">
          {user?.image ? (
            <img
              src={resolveImageUrl(user.image)}
              className="w-40 h-40 rounded-full border-4 border-white object-contain bg-white p-1 shadow-lg"
              alt="Profile"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center text-slate-300">
              <User size={80} />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Removed TOP ACTIONS MENU as requested */}

        {/* DATA FIELDS GRID - Restricted to requested fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-12">
          <ReadOnlyField label="Username" value={user?.userName} />
          <ReadOnlyField label="Email" value={user?.email} />
          <ReadOnlyField label="Phone" value={user?.phone} />
          <ReadOnlyField label="Role Name" value={user?.role || user?.userType} />
          {user?.companyName && <ReadOnlyField label="Company Name" value={user?.companyName} />}
        </div>
      </div>

      {/* BOTTOM ACTION BUTTONS - Matched to realgo old grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-10 pb-10">
        <button
          onClick={() => setIsTemplateModalOpen(true)}
          className="bg-[#160a70] hover:bg-[#3321b7] text-white rounded-lg p-3 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Images size={20} />
          <span className="text-sm font-medium">Change Template</span>
        </button>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="bg-[#160a70] hover:bg-[#3321b7] text-white rounded-lg p-3 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Pencil size={20} />
          <span className="text-sm font-medium">Edit Profile Image</span>
        </button>

        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="bg-[#160a70] hover:bg-[#3321b7] text-white rounded-lg p-3 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Key size={20} />
          <span className="text-sm font-medium">Change Password</span>
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/auth/login");
            window.location.reload();
          }}
          className="bg-[#160a70] hover:bg-red-600 text-white rounded-lg p-3 flex items-center justify-between px-4 transition-all active:scale-95 group"
        >
          <div className="flex items-center gap-2">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </div>
          <ArrowLeft size={18} className="text-white opacity-80" />
        </button>
      </div>

      {/* EDIT PROFILE IMAGE MODAL - Restricted to Image Only */}
      <ModalWrapper
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile Image"
        width="max-w-md"
      >
        {(closeModal) => (
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl flex flex-col items-center gap-6">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-white shadow-md border-2 border-white">
                {profileImagePreview ? (
                  <img src={profileImagePreview} className="w-full h-full object-contain bg-white p-1" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={48} />
                  </div>
                )}
              </div>
              <div className="w-full">
                <FileInput
                  label="Select New Image"
                  onChange={handleProfileImageChange}
                  existingFile={editData.image}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <button onClick={closeModal} className="px-6 py-2.5 text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Cancel</button>
              <button
                onClick={handleSaveProfile}
                disabled={updating}
                className="px-8 py-2.5 bg-[#160a70] text-white text-xs font-black uppercase tracking-widest hover:bg-black rounded-lg transition-all shadow-xl shadow-slate-900/20"
              >
                {updating ? <RefreshCcw className="animate-spin" size={14} /> : "Update Image"}
              </button>
            </div>
          </div>
        )}
      </ModalWrapper>

      {/* PASSWORD MODAL */}
      <ModalWrapper
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Update Credentials"
      >
        {(closeModal) => (
          <div className="space-y-4">
            <FormInput
              label="New Secure Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Ensure your password is at least 8 characters long and contains unique symbols for better security.
            </p>
            <div className="flex justify-end gap-3 pt-6">
              <button onClick={closeModal} className="px-6 py-2.5 text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Cancel</button>
              <button
                onClick={confirmChangePassword}
                disabled={updating}
                className="px-8 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 rounded-xl transition-all shadow-xl shadow-indigo-600/20"
              >
                {updating ? <RefreshCcw className="animate-spin" size={14} /> : "Update Password"}
              </button>
            </div>
          </div>
        )}
      </ModalWrapper>

      {/* TEMPLATE SELECTION MODAL - Exactly like realgo old */}
      <ModalWrapper
        open={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title="Select a Footer Style"
        width="max-w-md"
      >
        {(closeModal) => (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {[1, 2].map((id) => (
                <div
                  key={id}
                  onClick={() => setTempTemplate(id)}
                  className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all p-4 ${tempTemplate === id ? "bg-blue-50 border-indigo-600" : "bg-white border-slate-100"
                    }`}
                >
                  <img
                    src={`/assets/templates/template-${id}.jpg`}
                    alt={`Style ${id}`}
                    className="w-full h-auto object-contain rounded shadow-sm"
                  />
                  <div className={`mt-2 text-center text-sm font-medium ${tempTemplate === id ? "text-indigo-600" : "text-slate-600"}`}>
                    Style {id}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center pt-4 border-t">
              <button
                onClick={handleConfirmTemplate}
                className="px-6 py-2 bg-[#160a70] text-white text-sm font-medium rounded-lg hover:bg-[#3321b7] transition-all shadow-md active:scale-95"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}
      </ModalWrapper>
    </div>
  );
}

function ReadOnlyField({ label, value, className = "" }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-[14px] md:text-[16px] font-medium text-black ml-0.5">
        {label}
      </label>
      <div className="bg-[#F6F5F5] h-11 md:h-12 rounded-md px-3 flex items-center text-[#160a70] text-sm md:text-base overflow-hidden text-ellipsis whitespace-nowrap border border-slate-100/50 shadow-sm">
        {value || <span className="text-slate-300 italic font-medium">Not specified</span>}
      </div>
    </div>
  );
}
