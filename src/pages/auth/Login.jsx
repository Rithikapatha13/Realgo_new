import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { checkUser,login } from "../../services/auth.service";


const API_BASE = "http://localhost:3000/api";

export default function Login() {
  const [step, setStep] = useState("PHONE");

  const [phone, setPhone] = useState("");
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [password, setPassword] = useState("");

  // change password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ===============================
  // STEP 1: IDENTIFY USER BY PHONE
  // ===============================
  const handlePhoneSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await checkUser(phone);
      console.log(res);
      if (res.role === "superadmin") {
        setStep("PASSWORD");
        return;
      }

      setCompanies(res.companies || []);

      if (res.companies.length === 1) {
        setCompanyId(res.companies[0].company.id);
        setStep("PASSWORD");
      } else {
        setStep("COMPANY");
      }
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // STEP 3: LOGIN
  // ===============================
  // const handleLogin = async () => {
  //   setError("");
  //   setLoading(true);

  //   try {
     
  //     const res = await axios.post(
  //       `${API_BASE}/auth/login`,
  //       { phone, password, companyId },
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     console.log(res);

  //     const data = await res.json();
  //     console.log(res.json());
  //     if (!res.ok) {
  //       // 🔴 FORCE CHANGE PASSWORD
  //       if (data.message?.toLowerCase().includes("change")) {
  //         setOldPassword(password);
  //         setStep("CHANGE_PASSWORD");
  //         return;
  //       }
  //       setError(data.message || "Login failed");
  //       return;
  //     }

  //     localStorage.setItem("token", data.token);
  //     alert("Login successful ✅");
  //     navigate("/");

      
  //   } catch {
  //     setError("Server not reachable");
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await login(phone, companyId, password); // 🔥 same pattern as checkUser
      const data = res;
     
      // 🔴 FORCE CHANGE PASSWORD
      if (data.message?.toLowerCase().includes("change")) {
        setOldPassword(password);
        setStep("CHANGE_PASSWORD");
        return;
      }

      localStorage.setItem("token", data.token);
      alert("Login successful ✅");
      navigate("/");
    } catch (error) {
      setError(error?.response?.data?.message || "Server not reachable");
    } finally {
      setLoading(false);
    }
  };
  
console.log(first)

  // ===============================
  // STEP 4: CHANGE PASSWORD
  // ===============================
  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          companyId,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Password update failed");
        return;
      }

      setSuccess("Password changed successfully. Logging in...");
      setPassword(newPassword);

      setTimeout(() => {
        setStep("PASSWORD");
        handleLogin();
      }, 800);
    } catch {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT IMAGE */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://app.realgo.in/assets/images/side-img.jpeg')",
        }}
      />

      {/* RIGHT CONTENT */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-6">
        {/* FORM CENTER */}
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto">
          {/* LOGO */}
          <img
            src="https://app.realgo.in/assets/images/logo1.png"
            alt="RealGo"
            className="h-14 mb-4"
          />

          <h2 className="text-xl font-semibold text-black mb-2">
            Log in to your account
          </h2>

          <p className="text-sm text-indigo-400 mb-8 text-center">
            Welcome back, Please enter your phone number
          </p>

          {/* PHONE */}
          {step === "PHONE" && (
            <div className="w-full">
              <label className="block text-sm text-black mb-2">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-100 rounded-md px-4 py-3 mb-6 focus:outline-none"
              />
              <button
                onClick={handlePhoneSubmit}
                className="w-full bg-indigo-900 text-white py-3 rounded-md font-medium"
              >
                Next
              </button>
            </div>
          )}
          {console.log(companies)}
          {/* COMPANY */}
          {/* {step === "COMPANY" && (
            <div className="w-full">
              <label className="block text-sm text-black mb-2">
                Select Company
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full bg-gray-100 rounded-md px-4 py-3 mb-6"
              >
                <option value="">Select company</option>
                {companies.map((c, i) => (
                  <option key={i} value={c.company.id}>
                    
                    {c.company.company}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setStep("PASSWORD")}
                className="w-full bg-indigo-900 text-white py-3 rounded-md font-medium"
              >
                Next
              </button>
            </div>
          )} */}
          {/* Company Card Picker */}
            {step === "COMPANY" && (
              <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                {companies.map((c, i) => {
                  const isSelected = companyId === c.company.id;
                  return (
                    <div
                      key={i}
                      onClick={() => setCompanyId(c.company.id)}
                      className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center shadow-sm transition-all
        ${
          isSelected
            ? "border-indigo-600 ring-2 ring-indigo-300 bg-indigo-50"
            : "border-gray-200 hover:border-indigo-400"
        }`}
                    >
                      <img
                        src={`${import.meta.env.VITE_S3_URL}${c.company.img}`}
                        alt={c.company.company}
                        className="w-22 h-22 object-contain mb-3"
                      />
                      <p className="text-sm font-medium text-gray-800 text-center">
                        {c.company.company}
                      </p>
                    </div>
                  );
                })}
              </div>
              <button
              onClick={() => setStep("PASSWORD")}
              className="w-full bg-indigo-900 text-white py-3 rounded-md font-medium"
            >
              Next
            </button>
           </>
            )}
            
          {/* PASSWORD */}
          {step === "PASSWORD" && (
            <div className="w-full">
              <label className="block text-sm text-black mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 rounded-md px-4 py-3 mb-6"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-indigo-900 text-white py-3 rounded-md font-medium"
              >
                Login
              </button>
            </div>
          )}

          {/* CHANGE PASSWORD */}
          {step === "CHANGE_PASSWORD" && (
            <div className="w-full">
              <label className="block text-sm text-black mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-100 rounded-md px-4 py-3 mb-4"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-100 rounded-md px-4 py-3 mb-6"
              />
              <button
                onClick={handleChangePassword}
                className="w-full bg-indigo-900 text-white py-3 rounded-md font-medium"
              >
                Update Password
              </button>
            </div>
          )}

          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
          {success && <p className="text-sm text-green-600 mt-4">{success}</p>}
        </div>

        {/* FOOTER */}

        <div className="text-center text-xs text-gray-500 mb-4">
          © 2026{" "}
          <a
            href="https://www.brandwar.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block align-middle mx-1"
          >
            <img
              src="https://app.realgo.in/assets/images/brandwar.png"
              alt="Brandwar"
              className="h-11 inline"
            />
          </a>
          |{" "}
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <div className="mt-1">All Rights Reserved.</div>
        </div>
      </div>
    </div>
  );
}
