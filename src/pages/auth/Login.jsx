import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { changepassword, checkUser, login } from "../../services/auth.service";
import FormInput from "../../components/Common/FormInput";
import Button from "../../components/Common/Button";
import { delay, resolveImageUrl } from "../../utils/common";
import { ColorContext } from "../../context/ColorContext";

const STEPS = {
  PHONE: "PHONE",
  COMPANY: "COMPANY",
  PASSWORD: "PASSWORD",
  CHANGE_PASSWORD: "CHANGE_PASSWORD",
};

export default function Login() {
  const navigate = useNavigate();
  const { updateColors } = useContext(ColorContext);

  // Step management
  const [step, setStep] = useState(STEPS.PHONE);

  // Form fields
  const [phone, setPhone] = useState("");
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset error on any input change
  const clearError = () => setError("");

  // ===============================
  // STEP 1: CHECK USER BY PHONE
  // ===============================
  const handlePhoneSubmit = async () => {
    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    clearError();
    setLoading(true);

    try {
      const res = await checkUser(phone);

      // Super admin goes directly to password
      if (res.userType === "superadmin") {
        setStep(STEPS.PASSWORD);
        return;
      }

      // Set companies and determine next step
      setCompanies(res.companies || []);

      if (res.companies.length === 1) {
        setCompanyId(res.companies[0].company.id);
        setStep(STEPS.PASSWORD);
      } else if (res.companies.length > 1) {
        setStep(STEPS.COMPANY);
      } else {
        setError("No companies found for this phone number");
      }
    } catch (error) {
      console.error("Phone check error:", error);
      setError(
        error?.response?.data?.message ||
        "User not found. Please check your phone number."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // STEP 2: SELECT COMPANY (if multiple)
  // ===============================
  const handleCompanySelect = () => {
    if (!companyId) {
      setError("Please select a company to continue");
      return;
    }
    clearError();
    setStep(STEPS.PASSWORD);
  };

  // ===============================
  // STEP 3: LOGIN WITH PASSWORD
  // ===============================
  const handleLogin = async () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }

    clearError();
    setLoading(true);

    try {
      const res = await login(phone, companyId, password);

      // Successful login
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("usertype", res.userType);

      // Apply theme colors if available
      if (res.user?.primaryColour && res.user?.secondaryColour) {
        updateColors(res.user.primaryColour, res.user.secondaryColour);
      }

      toast.success("Login successful! Redirecting...");
      await delay(1500);

      if (res.user?.role?.toLowerCase() === "accounts") {
        window.location.href = "/finance";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      const status = error?.response?.status;
      // 403 means password not changed yet → go to Change Password step
      if (status === 403) {
        setOldPassword(password); // pre-fill old password from what they just typed
        setStep(STEPS.CHANGE_PASSWORD);
        clearError();
        return;
      }
      console.error("Login error:", error);
      setError(
        error?.response?.data?.message || "Invalid password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // STEP 4: CHANGE PASSWORD
  // ===============================
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword === oldPassword) {
      setError("New password must be different from your current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    clearError();
    setLoading(true);

    try {
      const res = await changepassword(phone, companyId, oldPassword, newPassword);

      if (res.success) {
        toast.success(
          "Password changed! Please login with your new password."
        );
        setPassword("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setStep(STEPS.PASSWORD);
      }
    } catch (error) {
      console.error("Password change error:", error);
      setError(
        error?.response?.data?.message ||
        "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // HANDLE BACK NAVIGATION
  // ===============================
  const handleBack = () => {
    clearError();
    if (step === STEPS.COMPANY || step === STEPS.PASSWORD) {
      setStep(STEPS.PHONE);
      setPassword("");
      setCompanyId("");
    } else if (step === STEPS.CHANGE_PASSWORD) {
      setStep(STEPS.PASSWORD);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // ===============================
  // RENDER HELPERS
  // ===============================
  const getStepTitle = () => {
    switch (step) {
      case STEPS.PHONE:
        return "Log in to your account";
      case STEPS.COMPANY:
        return "Select your company";
      case STEPS.PASSWORD:
        return "Enter your password";
      case STEPS.CHANGE_PASSWORD:
        return "Change your password";
      default:
        return "Login";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case STEPS.PHONE:
        return "Welcome back! Please enter your registered phone number";
      case STEPS.COMPANY:
        return "You have multiple companies. Select one to continue";
      case STEPS.PASSWORD:
        return "Enter your password to access your account";
      case STEPS.CHANGE_PASSWORD:
        return "For security, set a new password before continuing. Your current password is Realgo@123";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT IMAGE SECTION */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://app.realgo.in/assets/images/side-img.jpeg')",
        }}
      />

      {/* RIGHT CONTENT SECTION */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-6">
        {/* MAIN FORM AREA */}
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto">
          {/* LOGO */}
          <img
            src="https://app.realgo.in/assets/images/logo1.png"
            alt="RealGo"
            className="h-14 mb-8"
          />

          {/* BACK BUTTON */}
          {step !== STEPS.PHONE && (
            <button
              onClick={handleBack}
              className="self-start flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600 mb-4 transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}

          {/* STEP TITLE & DESCRIPTION */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {getStepTitle()}
          </h2>
          <p className="text-sm text-gray-500 mb-8 text-center">
            {getStepDescription()}
          </p>

          {/* STEP CONTENT */}
          <div className="w-full space-y-4">
            {/* STEP 1: PHONE NUMBER */}
            {step === STEPS.PHONE && (
              <>
                <FormInput
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearError();
                  }}
                  placeholder="Enter your 10-digit phone number"
                  onKeyPress={(e) => e.key === "Enter" && handlePhoneSubmit()}
                />
                <br />
                <div className="flex justify-center">
                  <Button
                    onClick={handlePhoneSubmit}
                    className="w-40 bg-primary-500 hover:bg-primary-600"
                    loading={loading}
                    disabled={!phone || phone.length !== 10}
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}

            {/* STEP 2: COMPANY SELECTION */}
            {step === STEPS.COMPANY && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {companies.map((c, i) => {
                    const isSelected = companyId === c.company.id;
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setCompanyId(c.company.id);
                          clearError();
                        }}
                        className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${isSelected
                            ? "border-secondary-500 ring-2 ring-secondary-500/20 bg-secondary-500/5"
                            : "border-gray-100 hover:border-secondary-500/30 hover:shadow-md"
                          }`}
                      >
                        <div className="relative">
                          <img
                            src={resolveImageUrl(c.company.img)}
                            alt={c.company.company}
                            className="h-16 w-16 object-contain mb-3"
                          />
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 bg-secondary-500 text-white rounded-full p-0.5 shadow-sm">
                              <CheckCircle2 size={12} />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-800 text-center">
                          {c.company.company}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <Button
                  onClick={handleCompanySelect}
                  className="w-full bg-primary-500"
                  disabled={!companyId}
                >
                  Continue
                </Button>
              </>
            )}

            {/* STEP 3: PASSWORD */}
            {step === STEPS.PASSWORD && (
              <>
                <div className="relative">
                  <FormInput
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                    placeholder="Enter your password"
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Button
                  onClick={handleLogin}
                  className="w-full bg-primary-500"
                  loading={loading}
                  disabled={!password}
                >
                  Login
                </Button>
              </>
            )}

            {/* STEP 4: CHANGE PASSWORD */}
            {step === STEPS.CHANGE_PASSWORD && (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
                  <p className="text-sm text-amber-800 font-medium">🔐 First-time setup required</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Your account uses a default password. Please set a new one to continue.
                  </p>
                </div>

                {/* Current Password */}
                <div className="relative">
                  <FormInput
                    label="Current Password"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      clearError();
                    }}
                    placeholder="Enter your current / default password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* New Password */}
                <div className="relative">
                  <FormInput
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      clearError();
                    }}
                    placeholder="Enter new password (min. 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <FormInput
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearError();
                    }}
                    placeholder="Re-enter new password"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleChangePassword()
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <Button
                  onClick={handleChangePassword}
                  className="w-full"
                  loading={loading}
                  disabled={!oldPassword || !newPassword || !confirmPassword}
                >
                  Set New Password
                </Button>
              </>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-500 py-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-2">
            © 2026
            <a
              href="https://www.brandwar.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src="https://app.realgo.in/assets/images/brandwar.png"
                alt="Brandwar"
                className="h-11"
              />
            </a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <a href="#" className="hover:underline hover:text-gray-700">
              Privacy Policy
            </a>
            <span>•</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
