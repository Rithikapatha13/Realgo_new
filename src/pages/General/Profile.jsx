import { useState } from "react";
import {
  User,
  Lock,
  LogOut,
  Edit,
  Images,
  Eye,
  EyeOff,
  AlertCircle,
  Upload,
} from "lucide-react";
import FormInput from "../../components/Common/FormInput";
import ModalWrapper from "../../components/Common/ModalWrapper";
import Button from "../../components/Common/Button";
import FileInput from "../../components/Common/FileUpload";
import {
  changepassword,
  getUser,
  updateLocalUser,
} from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { delay, resolveImageUrl } from "../../utils/common";
import toast from "react-hot-toast";
import { updateProfile } from "../../services/common.service";

// Template images - defined outside component to prevent re-creation
const TEMPLATE_IMAGES = [
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=600&fit=crop",
];

export default function Profile() {
  const navigate = useNavigate();
  const user = getUser();
  console.log(user);

  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Password form states (for admin only)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Edit form states
  const [editUsername, setEditUsername] = useState(user.userName);
  const [editEmail, setEditEmail] = useState(user.email || "");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(
    user.image ? resolveImageUrl(user.image) : null,
  );

  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const isAdmin = user?.role === "admin";

  const confirmChangePassword = async () => {
    try {
      const res = await changepassword(user.phone, user.companyId, newPassword);
      toast.success(res.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
      return;
    }
  };

  const handleProfileImageChange = (file) => {
    if (file) {
      setProfileImage(file);
      // // Create preview URL
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setProfileImagePreview(reader.result);
      // };
      // reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Add your API call here to update profile
      const formData = new FormData();
      formData.append("username", editUsername);
      formData.append("email", editEmail);
      if (profileImage) {
        formData.append("image", profileImage);
      }

      const res = await updateProfile(
        user.id,
        editUsername,
        profileImage.target.value,
        editEmail,
        isAdmin,
      );
      updateLocalUser(editUsername, editEmail, profileImage.target.value);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* HEADER WITH BACKGROUND */}
        <div className="relative">
          <div className="h-32 sm:h-40 w-full overflow-hidden">
            <img
              src="https://t4.ftcdn.net/jpg/00/90/75/91/360_F_90759175_mgrvFtX2ILUc7pw7eKziYEeFskckGdut.jpg"
              alt="Profile background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Picture - WITHOUT edit button */}
          <div className="absolute left-4 sm:left-8 -bottom-12 sm:-bottom-14">
            <div className="relative">
              {user.image ? (
                <img
                  src={resolveImageUrl(user.image)}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white shadow-lg object-cover"
                  alt="Profile"
                />
              ) : (
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                  <User size={48} className="text-slate-500" />
                </div>
              )}
            </div>
          </div>

          {/* Company Logo */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <div className="h-12 w-full sm:h-14 px-2 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center">
              <img
                src={resolveImageUrl(user.companyImg)}
                alt="Company logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 lg:p-10 pt-16 sm:pt-20">
          {/* User Info */}
          <div className="mb-8 ml-0 sm:ml-28 -mt-0 sm:-mt-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              {user.userName}
            </h1>
            <p className="text-sm text-slate-500">
              {user.email || "No Email Provided"}
            </p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
            <ReadOnlyField label="Username" value={user.userName} />
            <ReadOnlyField
              label="Email"
              value={user.email || "No Email Provided"}
            />
            <ReadOnlyField label="Phone" value={user.phone} />
            <ReadOnlyField label="Role" value={user.role} />
            <ReadOnlyField
              label="Company"
              value={user.companyName || "Company Not Provided"}
            />
          </div>

          {/* Actions */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
            <Button size="medium" onClick={() => setIsPasswordModalOpen(true)}>
              <Lock size={16} />
              {isAdmin ? "Change Password" : "Reset Password"}
            </Button>

            <Button size="medium" onClick={() => setIsTemplateModalOpen(true)}>
              <Images size={16} />
              Change Template
            </Button>

            <Button size="medium" onClick={() => setIsEditModalOpen(true)}>
              <Edit size={16} />
              Edit Profile
            </Button>

            <Button
              variant="primary"
              size="medium"
              className="bg-red-500"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                delay(2000);
                navigate("/auth/login");
                window.location.reload();
              }}
            >
              <LogOut size={16} />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      <ModalWrapper
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title={isAdmin ? "Change Password" : "Reset Password"}
        width="max-w-md"
      >
        {(closeModal) => (
          <div className="space-y-4">
            {isAdmin ? (
              <>
                <p className="text-sm text-slate-600 mb-4">
                  Enter a new password to update your account security.
                </p>

                <div className="relative">
                  <FormInput
                    label="New Password *"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <FormInput
                    label="Confirm Password *"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" size="medium" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    size="medium"
                    onClick={() => {
                      if (newPassword !== confirmPassword) {
                        toast.error("Passwords do not match!");
                        return;
                      }
                      confirmChangePassword();
                      closeModal();
                    }}
                  >
                    Change Password
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Password Reset Request</p>
                    <p>Are you sure you want to request a password reset?</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-slate-700 mb-2">
                    <span className="font-medium">What happens next:</span>
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li>Request sent to administrator</li>
                    <li>
                      Password reset to:{" "}
                      <code className="bg-white px-2 py-0.5 rounded text-primary-500">
                        Realgo@123
                      </code>
                    </li>
                    <li>Login with new password</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" size="medium" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    size="medium"
                    onClick={() => {
                      console.log("Password reset requested");
                      toast.success("Password reset request sent to admin!");
                      closeModal();
                    }}
                  >
                    Confirm Reset Request
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </ModalWrapper>

      {/* EDIT PROFILE MODAL */}
      <ModalWrapper
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        width="max-w-2xl"
      >
        {(closeModal) => (
          <div className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center pb-6 border-b border-slate-200">
              <div className="relative mb-4">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile preview"
                    className="h-28 w-28 rounded-full object-cover border-4 border-slate-200"
                  />
                ) : (
                  <div className="h-28 w-28 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center">
                    <User size={48} className="text-slate-400" />
                  </div>
                )}
              </div>

              <FileInput
                accept="image/*"
                maxSizeMB={2}
                onChange={handleProfileImageChange}
                helperText="Upload a profile picture (JPG, PNG). Max size: 2MB"
                showPreview={false}
                className="w-full max-w-md"
              />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-1">
              <FormInput
                label="Username *"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Enter username"
              />
              <FormInput label="Phone *" value={user.phone} disabled />
              <FormInput
                label="Email *"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Enter email address"
              />
              <FormInput label="Role *" value={user.role} disabled />
              <div className="sm:col-span-2">
                <FormInput
                  label="Company *"
                  value={user.companyName}
                  disabled
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button variant="outline" size="medium" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                size="medium"
                onClick={() => {
                  handleSaveProfile();
                  // closeModal();
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </ModalWrapper>

      {/* TEMPLATE MODAL */}
      <ModalWrapper
        open={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title="Change Template"
        width="max-w-4xl"
      >
        {(closeModal) => (
          <div>
            <p className="text-sm text-slate-600 mb-6">
              Select a template for your profile background.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {TEMPLATE_IMAGES.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedTemplate(index)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
                    selectedTemplate === index
                      ? "border-primary-500 shadow-lg"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Template ${index + 1}`}
                    className="w-full h-80 object-cover"
                  />
                  {selectedTemplate === index && (
                    <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                      <div className="bg-primary-500 text-white px-4 py-2 rounded-full font-medium">
                        Selected
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button variant="outline" size="medium" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                size="medium"
                onClick={() => {
                  console.log("Template changed to:", selectedTemplate);
                  toast.success("Template updated successfully!");
                  closeModal();
                }}
              >
                Apply Template
              </Button>
            </div>
          </div>
        )}
      </ModalWrapper>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-sm font-medium capitalize text-slate-900 mt-1">
        {value || "Not provided"}
      </p>
    </div>
  );
}
