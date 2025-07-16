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
  register: (
    email: string,
    password: string,
    phone: string,
    name: string
  ) => Promise<{ success: boolean; error?: any }>;
  accessToken: string | null;
  loading: boolean;
  authLoading: boolean;
};

export type FormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};
