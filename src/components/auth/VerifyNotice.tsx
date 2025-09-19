import React from "react";
import { Link } from "react-router-dom";


export const VerifyNotice = () => {
  return (<>
  <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Verify Your Email
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          We’ve sent a verification link to your email address. 
          Please check your inbox and click the link to activate your account.
        </p>
        <Link
          to="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
  </>)
};



