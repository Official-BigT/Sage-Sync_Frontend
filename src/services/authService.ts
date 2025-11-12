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
  subscribeToNewsletter: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  status: string;
  message: string;
  data?: T;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  user: any;
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

  const { accessToken, refreshToken } = res.data.tokens || {};
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

  return res.data; //cookies are auto-set by browser for httpsOnly
};

export const verifyEmail = async (token: string): Promise<ApiResponse> => {
  const res = await api.get<ApiResponse>(`/auth/verify-email?token=${token}`);
  return res.data;
};

export const getCurrentUser = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get<ApiResponse>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const refreshToken = async (): Promise<ApiResponse> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token stored");

  const res = await api.post<ApiResponse>("/auth/refresh", {
    refreshToken,
  });
  const { accessToken, refreshToken: newRefresh } = res.data.tokens || {};

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  if (newRefresh) {
    localStorage.setItem("refreshToken", newRefresh);
  }


  return res.data;
};

// Google users profile completion
export const completeProfile = async (
  profileData: Partial<RegisterData>
): Promise<ApiResponse> => {
  const token = localStorage.getItem("accessToken");
  const res = await api.patch<ApiResponse>("auth/complete-profile", profileData, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return res.data
};

// Manual users profile update
export const updateProfile = async (
  profileData: Partial<RegisterData>
): Promise<ApiResponse> => {
  const token = localStorage.getItem("accessToken");
  const res = await api.patch<ApiResponse>("/auth/update-profile", profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};
