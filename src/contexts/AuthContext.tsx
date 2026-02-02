import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshToken,
  logoutUser,
} from "@/services/authService";
import api from "@/services/api";

/** Normalize backend user (id → _id) and ensure shape matches User */
function normalizeUser(raw: Record<string, unknown> | null): User | null {
  if (!raw || typeof raw !== "object") return null;
  const u = raw as Record<string, unknown>;
  return {
    _id: (u._id ?? u.id) as string,
    firstName: (u.firstName ?? "") as string,
    lastName: (u.lastName ?? "") as string,
    email: (u.email ?? "") as string,
    phone: (u.phone ?? "") as string,
    businessName: (u.businessName ?? "") as string,
    businessType: (u.businessType ?? "") as string,
    monthlyGoal: (u.monthlyGoal ?? 0) as number,
    currentEarnings: (u.currentEarnings ?? 0) as number,
    totalInvoices: (u.totalInvoices ?? 0) as number,
    paidInvoices: (u.paidInvoices ?? 0) as number,
    authProvider: (u.authProvider ?? "local") as User["authProvider"],
    avatar: u.avatar as string | null | undefined,
    isProfileComplete: (u.isProfileComplete ?? false) as boolean,
    isActive: (u.isActive ?? true) as boolean,
    emailVerified: (u.emailVerified ?? false) as boolean,
    plan: (u.plan ?? "free") as User["plan"],
  };
}

// Type definitions
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  monthlyGoal: number;
  currentEarnings: number;
  totalInvoices: number;
  paidInvoices: number;
  authProvider: "local" | "google" | "apple";
  avatar?: string | null; 
  isProfileComplete: boolean;
  isActive: boolean;
  emailVerified: boolean;
  plan: "free" | "pro";
}

interface AuthResponse {
  success: boolean;
  message?: string,
  error?: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  data?: {
    user?: User;
    tokens?: {
      accessToken?: string;
    }
  }
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (token: string, newPassword: string) => Promise<AuthResponse>;
  updateProfile: (profileData: Partial<User>) => Promise<AuthResponse>;
  checkAuthStatus: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  password: string;
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Only check /me if token exists
  const checkAuthStatus = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const res = await getCurrentUser();
      const userData = res?.data ?? (res as unknown as { data?: Record<string, unknown> })?.data;
      const normalized = normalizeUser(userData ?? null);
      if (normalized) {
        setUser(normalized);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(normalized));
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      // console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
    // Obsolete localstorage logic
    // try {
    //   // Check for stored auth token
    //   const token = localStorage.getItem("authToken");
    //   const userData = localStorage.getItem("userData");

    //   if (token && userData) {
    //     // Validate token with backend (simulated)
    //     const isValid = await validateToken(token);

    //     if (isValid) {
    //       setUser(JSON.parse(userData));
    //       setIsAuthenticated(true);
    //     } else {
    //       // Token is invalid, clear storage
    //       localStorage.removeItem("authToken");
    //       localStorage.removeItem("userData");
    //     }
    //   }
    // } catch (error) {
    //   console.error("Auth check failed:", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const validateToken = async (token: string): Promise<boolean> => {
    // Simulate token validation
    // In a real app, this would make an API call to validate the token
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, assume token is valid if it exists
        resolve(!!token);
      }, 1000);
    });
  };

  // Email/password login — calls backend, stores tokens, sets user
  const login = async (
    email: string,
    password: string,
    _rememberMe?: boolean
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      const userPayload = response?.data ?? (response as { data?: Record<string, unknown> })?.data;
      const tokens = response?.tokens;

      if (userPayload && tokens?.accessToken) {
        const normalized = normalizeUser(userPayload);
        if (normalized) {
          setUser(normalized);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(normalized));
        }
        return { success: true, user: normalized ?? undefined, accessToken: tokens.accessToken };
      }
      return { success: false, error: response?.message ?? "Login failed" };
    } catch (error) {
      return {
        success: false,
        error: "Login failed. Invalid credentials — please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };
  // (authService.loginUser already stores accessToken + refreshToken)
  //   const response = await simulateLogin(email, password);

  //   if (response.success && response.data) {
  //     const { user: userData, token } = response.data;

  //     // Store auth data
  //     localStorage.setItem("authToken", token);
  //     localStorage.setItem("userData", JSON.stringify(userData));

  //     if (rememberMe) {
  //       // Set longer expiration for remember me
  //       localStorage.setItem("rememberMe", "true");
  //     }

  //     setUser(userData);
  //     setIsAuthenticated(true);

  //     return { success: true };
  //   } else {
  //     return { success: false, error: response.error };
  //   }
  // } catch (error) {
  //   return { success: false, error: "Login failed. Please try again." };
  // } finally {
  //   setIsLoading(false);
  // }

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);

      const res = await registerUser(userData);
      if (res.success !== false) {
        return {
          success: true,
          message: "Registration successful. Please verify your email.",
        };
      } else {
        return {
          success: false,
          error: res.message || "Registration failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Server error. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate API registration call
  /* const response = await simulateRegister(userData);

      if (response.success && response.data) {
        // For demo, auto-login after registration
        const { user: newUser, token } = response.data;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(newUser));

        setUser(newUser);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return {
        success: false,
        error: "Registration failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }*/

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    logoutUser().catch(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    });
  };

  // Simulate logout from app
  // // Clear all auth data
  // localStorage.removeItem("authToken");
  // localStorage.removeItem("userData");
  // localStorage.removeItem("rememberMe");

  // setUser(null);
  // setIsAuthenticated(false);

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    try {
      // Simulate API call for password reset
      await simulateForgotPassword(email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Failed to send reset email. Please try again.",
      };
    }
  };

  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<AuthResponse> => {
    try {
      // Simulate API call for password reset
      const response = await simulateResetPassword(token, newPassword);
      return response;
    } catch (error) {
      return {
        success: false,
        error: "Failed to reset password. Please try again.",
      };
    }
  };

  // Simulate update profile
  // const updateProfile = async (
  //   profileData: Partial<User>
  // ): Promise<AuthResponse> => {
  //   try {
  //     setIsLoading(true);

  //     // Simulate API call to update profile
  //     const response = await simulateUpdateProfile(profileData);

  //     if (response.success && response.data) {
  //       const updatedUser = { ...user, ...response.data } as User;
  //       setUser(updatedUser);
  //       localStorage.setItem("userData", JSON.stringify(updatedUser));
  //       return { success: true };
  //     } else {
  //       return { success: false, error: response.error };
  //     }
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: "Failed to update profile. Please try again.",
  //     };
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Simulation functions (replace with actual API calls)
  // const simulateLogin = async (
  //   email: string,
  //   password: string
  // ): Promise<AuthResponse> => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       // Simulate successful login for demo
  //       if (email && password) {
  //         resolve({
  //           success: true,
  //           data: {
  //             user: {
  //               id: "1",
  //               firstName: "John",
  //               lastName: "Doe",
  //               email: email,
  //               phone: "",
  //               businessName: "JD Freelance Services",
  //               businessType: "freelancer",
  //               avatar: null,
  //               plan: "free",
  //             },
  //             token: "demo-jwt-token-" + Date.now(),
  //           },
  //         });
  //       } else {
  //         resolve({
  //           success: false,
  //           error: "Invalid email or password",
  //         });
  //       }
  //     }, 1500);
  //   });
  // };

  // const simulateRegister = async (
  //   userData: RegisterData
  // ): Promise<AuthResponse> => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve({
  //         success: true,
  //         data: {
  //           user: {
  //             id: "1",
  //             firstName: userData.firstName,
  //             lastName: userData.lastName,
  //             email: userData.email,
  //             phone: userData.phone,
  //             businessName: userData.businessName,
  //             businessType: userData.businessType,
  //             avatar: null,
  //             plan: "free",
  //           },
  //           token: "demo-jwt-token-" + Date.now(),
  //         },
  //       });
  //     }, 2000);
  //   });
  // };

  const updateProfile = async (profileData: Partial<User>): Promise<AuthResponse> => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    // Make the API call to backend
    const res = await api.patch<AuthResponse>("/auth/update-profile", profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.success) {
      const updatedUser = res.data.user || res.data.data?.user;
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return { success: true, user: updatedUser };
    } else {
      return { success: false, error: res.data?.error || "Profile update failed" };
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile. Please try again." };
  } finally {
    setIsLoading(false);
  }
};

  const simulateForgotPassword = async (email: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  };

  const simulateResetPassword = async (
    token: string,
    newPassword: string
  ): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1500);
    });
  };

  const simulateUpdateProfile = async (
    profileData: Partial<User>
  ): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          // data: profileData,
        });
      }, 1000);
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
