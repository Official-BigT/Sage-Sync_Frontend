import api from "./api";

// --- Types ---
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  password: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// --- Functions ---
export const registerUser = async (
  data: RegisterData
): Promise<ApiResponse> => {
  const res = await api.post<ApiResponse>("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: LoginData): Promise<ApiResponse> => {
  const res = await api.post<ApiResponse>("/auth/login", data);
  return res.data;
};

export const verifyEmail = async (token: string): Promise<ApiResponse> => {
  const res = await api.get<ApiResponse>(`/auth/verify-email?token=${token}`);
  return res.data;
};
