import { create } from "zustand";
import { apiClient, type User, type License } from "../api/client";

interface AuthStore {
  token: string | null;
  user: (User & { licenses?: License[] }) | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("at_token"),
  user: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    const { data } = await apiClient.post<{ token: string; user: User }>("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("at_token", data.token);
    set({ token: data.token, user: data.user, loading: false });
  },

  register: async (email, password, name) => {
    set({ loading: true });
    const { data } = await apiClient.post<{ token: string; user: User }>("/auth/register", {
      email,
      password,
      name,
    });
    localStorage.setItem("at_token", data.token);
    set({ token: data.token, user: data.user, loading: false });
  },

  logout: () => {
    localStorage.removeItem("at_token");
    set({ token: null, user: null });
  },

  fetchMe: async () => {
    set({ loading: true });
    try {
      const { data } = await apiClient.get<{ user: User & { licenses: License[] } }>("/auth/me");
      set({ user: data.user, loading: false });
    } catch {
      localStorage.removeItem("at_token");
      set({ token: null, user: null, loading: false });
    }
  },
}));
