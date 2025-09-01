import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Type definitions
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  businessType: string;
  avatar: string | null;
  plan: "free" | "pro";
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
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
  password: string;
  businessName: string;
  businessType: string;
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

  const checkAuthStatus = async (): Promise<void> => {
    try {
      // Check for stored auth token
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        // Validate token with backend (simulated)
        const isValid = await validateToken(token);

        if (isValid) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
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

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<AuthResponse> => {
    try {
      setIsLoading(true);

      // Simulate API login call
      const response = await simulateLogin(email, password);

      if (response.success && response.data) {
        const { user: userData, token } = response.data;

        // Store auth data
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(userData));

        if (rememberMe) {
          // Set longer expiration for remember me
          localStorage.setItem("rememberMe", "true");
        }

        setUser(userData);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);

      // Simulate API registration call
      const response = await simulateRegister(userData);

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
    }
  };

  const logout = (): void => {
    // Clear all auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberMe");

    setUser(null);
    setIsAuthenticated(false);
  };

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

  const updateProfile = async (
    profileData: Partial<User>
  ): Promise<AuthResponse> => {
    try {
      setIsLoading(true);

      // Simulate API call to update profile
      const response = await simulateUpdateProfile(profileData);

      if (response.success && response.data) {
        const updatedUser = { ...user, ...response.data } as User;
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to update profile. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Simulation functions (replace with actual API calls)
  const simulateLogin = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful login for demo
        if (email && password) {
          resolve({
            success: true,
            data: {
              user: {
                id: "1",
                firstName: "John",
                lastName: "Doe",
                email: email,
                businessName: "JD Freelance Services",
                businessType: "freelancer",
                avatar: null,
                plan: "free",
              },
              token: "demo-jwt-token-" + Date.now(),
            },
          });
        } else {
          resolve({
            success: false,
            error: "Invalid email or password",
          });
        }
      }, 1500);
    });
  };

  const simulateRegister = async (
    userData: RegisterData
  ): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            user: {
              id: "1",
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              businessName: userData.businessName,
              businessType: userData.businessType,
              avatar: null,
              plan: "free",
            },
            token: "demo-jwt-token-" + Date.now(),
          },
        });
      }, 2000);
    });
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
