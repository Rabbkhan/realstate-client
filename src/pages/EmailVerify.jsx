import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Allow only numeric input
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next field
    if (value && index < otp.length - 1) {
      e.target.nextSibling?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      e.target.previousSibling?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/verifyemail`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Verification failed.");
        return;
      }

      alert("OTP verified successfully!");
      navigate("/sign-in");
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength="1"
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-12 h-12 text-center text-xl font-semibold text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Verify
          </button>

          {error && (
            <div className="mt-4 text-center text-red-500 bg-red-100 border border-red-300 rounded-md p-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
