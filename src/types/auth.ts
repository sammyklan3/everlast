export type User = {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin" | "staff";
  image?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: any }>;
  logout: () => void;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  authLoading: boolean;
};
