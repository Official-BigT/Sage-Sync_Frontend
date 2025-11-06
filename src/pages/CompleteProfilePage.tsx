import { useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CompleteProfilePage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [formData, setFormData] = useState({
    phone: "",
    businessName: "",
    businessType: "",
    agreeToTerms: false,
    subscribeToNewsletter: false,
  });

  const businessTypes = [
    "Freelancer",
    "Consultant",
    "Small Business",
    "Startup",
    "Agency",
    "E-Commerce",
    "Service Provider",
    "Online Store",
    "Other",
  ];
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/complete-profile/${
          user._id
        }`,
        {
          ...formData,
          isActive: true, // ✅ override to true
        },
        { withCredentials: true }
      );

      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Profile completed!",
        description: "Your account is now active and verified.",
      });

      window.location.href = "/";
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to complete profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Input
          name="businessName"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={handleChange}
          required
        />
        <Select
          onValueChange={(val) =>
            setFormData({ ...formData, businessType: val })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Business Type" />
          </SelectTrigger>
          <SelectContent>
            {businessTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            required
          />
          <span>I agree to the terms and conditions</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="subscribeToNewsletter"
            checked={formData.subscribeToNewsletter}
            onChange={handleChange}
          />
          <span>Subscribe to our newsletter</span>
        </label>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Completing..." : "Complete Profile"}
        </Button>
      </form>
    </div>
  );
}
