import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Shield,
  Zap,
  Sparkles,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerUser } from "@/services/authService";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: any;
  subscribeToNewsletter: any;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: "",
    subscribeToNewsletter: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

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

  const { mutate: registerMutation, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (res) => {
      if (res.status) {
        toast.success(
          "Registration successful! Please check your email to verify your account."
        );
      } else {
        toast.error(res.message || "Registration failed. Try again.");
      }
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!formData.businessType) {
      newErrors.businessType = "Please select a business type";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    registerMutation({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      businessName: formData.businessName,
      businessType: formData.businessType,
      password: formData.password,
      agreeToTerms: formData.agreeToTerms,
    subscribeToNewsletter: formData.subscribeToNewsletter

    });
  };
  const getPasswordStrength = (): PasswordStrength => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      strength: (strength / 5) * 100,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "bg-gray-300",
    };
  };

  const passwordStrength = getPasswordStrength();



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-emerald-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl mb-6 shadow-lg">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Join{" "}
              <span className="font-semibold text-center bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                SageSync
              </span>{" "}
              today!
            </h1>
            <p className="text-gray-600 text-lg">
              Create your account and start managing your finances
              professionally
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-semibold text-center bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Fill in your details to get started with{" "}
                <span className="font-semibold text-center bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  SageSync
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Error */}
                {errors.general && (
                  <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {errors.general}
                    </span>
                  </div>
                )}

                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700"
                      >
                        First Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          className={`pl-12 pr-4 h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                            errors.firstName
                              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200"
                          }`}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.firstName}</span>
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          className={`pl-12 pr-4 h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                            errors.lastName
                              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200"
                          }`}
                          disabled={isPending}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.lastName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`pl-12 pr-4 h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                            errors.email
                              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200"
                          }`}
                          disabled={isPending}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </Label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+234 801 234 5678"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className={`pl-12 pr-4 h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                            errors.phone
                              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200"
                          }`}
                          disabled={isPending}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Building className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Business Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Business Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="businessName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Business Name
                      </Label>
                      <div className="relative group">
                        <Building className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                        <Input
                          id="businessName"
                          type="text"
                          placeholder="Your Business Name"
                          value={formData.businessName}
                          onChange={(e) =>
                            handleInputChange("businessName", e.target.value)
                          }
                          className={`pl-12 pr-4 h-12 border-2 transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${
                            errors.businessName
                              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200"
                          }`}
                          disabled={isPending}
                        />
                      </div>
                      {errors.businessName && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.businessName}</span>
                        </p>
                      )}
                    </div>

                    {/* Business Type */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="businessType"
                        className="text-sm font-medium text-gray-700"
                      >
                        Business Type
                      </Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) =>
                          handleInputChange("businessType", value)
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger
                          className={`h-12 border-2 transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${
                            errors.businessType
                              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200"
                          }`}
                        >
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.businessType && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.businessType}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Security
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className={`pl-12 pr-12 h-12 border-2 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${
                            errors.password
                              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200"
                          }`}
                          disabled={isPending}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                          disabled={isPending}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                style={{
                                  width: `${passwordStrength.strength}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 font-medium">
                              {passwordStrength.label}
                            </span>
                          </div>
                        </div>
                      )}
                      {errors.password && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.password}</span>
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-gray-700"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className={`pl-12 pr-12 h-12 border-2 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${
                            errors.confirmPassword
                              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200"
                          }`}
                          disabled={isPending}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                          disabled={isPending}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.confirmPassword}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Newsletter */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToTerms", checked as boolean)
                      }
                      disabled={isPending}
                      className={`border-2 ${
                        errors.agreeToTerms
                          ? "border-red-500"
                          : "border-gray-300"
                      } data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600`}
                    />
                    <div className="text-sm">
                      <Label
                        htmlFor="agreeToTerms"
                        className="text-gray-700 font-medium"
                      >
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                      {errors.agreeToTerms && (
                        <p className="text-red-600 mt-1 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.agreeToTerms}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="subscribeNewsletter"
                      checked={formData.subscribeToNewsletter}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "subscribeToNewsletter",
                          checked as boolean
                        )
                      }
                      disabled={isPending}
                      className="border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor="subscribeNewsletter"
                      className="text-sm text-gray-700 font-medium"
                    >
                      Subscribe to our newsletter for tips and updates
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create Account</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="text-center mt-8">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <div className="mt-12 text-center">
            <div className="flex justify-center items-center space-x-2 text-sm text-gray-500 mb-6">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                Your data is protected with enterprise-grade security
              </span>
            </div>
            <div className="flex flex-row justify-center items-stretch gap-4 text-xs text-gray-400 flex-wrap">
              <div className="flex flex-col items-center space-y-2 min-w-[90px] flex-1">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium text-center">
                  256-bit SSL Encryption
                </span>
              </div>
              <div className="flex flex-col items-center space-y-2 min-w-[90px] flex-1">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="font-medium text-center">GDPR Compliant</span>
              </div>
              <div className="flex flex-col items-center space-y-2 min-w-[90px] flex-1">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium text-center">No Setup Fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
