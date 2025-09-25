import { verifyEmail } from "@/services/authService";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const VerifyEmailPage = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token") ?? "";

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verify = async () => {
      console.log("📡 Calling backend /auth/verify-email with token:", token);
      try {
        const res = await verifyEmail(token);
        console.log("✅ Backend response:", res);

        if (res.success) {
          setStatus("success");
          setMessage("Your email has been verified! Redirecting to login...");
          setTimeout(() => navigate("/login"), 3000); // redirect after 3s
        } else {
          setStatus("error");
          setMessage(res.message || "Verification failed. Please try again.");
        }
      } catch (err) {
        console.error("❌ Verification error:", err);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      {status === "loading" && (
        <p className="text-gray-600">Verifying your email, please wait...</p>
      )}
      {status === "success" && (
        <p className="text-green-600 font-semibold">{message}</p>
      )}
      {status === "error" && (
        <p className="text-red-600 font-semibold">{message}</p>
      )}
    </div>
  );
};
