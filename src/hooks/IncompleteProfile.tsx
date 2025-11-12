import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const IncompleteProfile = () => {
    const { user } = useAuth();
  const navigate = useNavigate();
//   const [showBanner, setShowBanner] = useState(false);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");

//     if (user && user.authProvider === "google" && !user.isProfileComplete) {
//       setShowBanner(true);
//     }
//   }, []);
    const isIncomplete = user?.authProvider === "google" && !user?.isProfileComplete;
  if (!isIncomplete) return null;

  return <div className="max-w-4xl mx-auto mt-4">
      <Alert className="bg-yellow-50 border-yellow-300 text-yellow-800">
        <Info className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="font-semibold">
          Complete Your Profile
        </AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>
            Your profile is incomplete. Add your business info to unlock full features.
          </span>
          <Button
            size="sm"
            onClick={() => navigate("/profile")}
            className="bg-yellow-600 text-white hover:bg-yellow-700"
          >
            Complete Now
          </Button>
        </AlertDescription>
      </Alert>
  </div>;
};

export default IncompleteProfile;
