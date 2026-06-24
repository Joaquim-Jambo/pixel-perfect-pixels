import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { api } from "@/lib/api";
import { normalizeUser } from "@/lib/auth-user";
import { initFirebase, requestFcmToken } from "@/lib/firebase";
import { AxiosError } from "axios";

interface UserTeam {
  id: string;
  [key: string]: unknown;
}

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string | null;
  phoneVerified?: boolean;
  fcmToken?: string | null;
  avatarUrl?: string | null;
  team?: UserTeam;
  teams?: UserTeam[];
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, accessToken: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fcmInitRef = useRef(false);

  useEffect(() => {
    const loadSession = async () => {
      console.log("[AUTH] loadSession started")
      try {
        const token = localStorage.getItem("access_token");
        const userDataStr = localStorage.getItem("user_data");
        console.log("[AUTH] cached token:", token ? "present" : "none")
        console.log("[AUTH] cached user_data:", userDataStr ? "present" : "none")

        if (token && userDataStr) {
          setUser(normalizeUser(JSON.parse(userDataStr)));
        }
      } catch (error) {
        console.error("[AUTH] Erro ao carregar cache da sessão:", error);
      } finally {
        setIsLoading(false);
      }

      const currentToken = localStorage.getItem("access_token");
      console.log("[AUTH] access_token after cache:", currentToken ? "present" : "none")
      if (currentToken) {
        try {
          console.log("[AUTH] Fetching /users/me...")
          const res = await api.get("/users/me");
          const normalizedUser = normalizeUser(res.data);
          console.log("[AUTH] /users/me response received")
          setUser(normalizedUser);
          localStorage.setItem("user_data", JSON.stringify(normalizedUser));
        } catch (apiError) {
          console.error("[AUTH] Erro ao atualizar dados da API:", apiError);
        }

        console.log("[AUTH] Calling initFcm...")
        initFcm();
      }
    };

    loadSession();
  }, []);

  const initFcm = async () => {
    if (fcmInitRef.current) {
      console.log("[AUTH] initFcm already called, skipping")
      return
    }
    fcmInitRef.current = true

    console.log("[AUTH] initFcm started")
    const ok = initFirebase();
    console.log("[AUTH] initFirebase result:", ok)
    if (!ok) return;

    const token = await requestFcmToken();
    console.log("[AUTH] requestFcmToken result:", token ? "got token: " + token.substring(0, 20) + "..." : "null")
    if (!token) return;

    console.log("[AUTH] Saving FCM token to localStorage...")
    localStorage.setItem("fcm_token", token);
    console.log("[AUTH] localStorage fcm_token after set:", localStorage.getItem("fcm_token") ? "present" : "still missing")
    try {
      console.log("[AUTH] Patching /users/me with fcmToken...")
      const patchRes = await api.patch("/users/me", { fcmToken: token });
      console.log("[AUTH] FCM token saved to backend successfully", patchRes.status)
      updateUser({ fcmToken: token });
    } catch (error) {
      console.error("[AUTH] Erro ao registar FCM token:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("[AUTH] Response status:", error.response.status);
        console.error("[AUTH] Response data:", error.response.data);
      }
    }
  };

  const login = async (userData: User, accessToken: string) => {
    console.log("[AUTH] login called")
    localStorage.setItem("access_token", accessToken);
    const normalizedUser = normalizeUser(userData);
    localStorage.setItem("user_data", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    
    try {
      console.log("[AUTH] Fetching /users/me after login...")
      const res = await api.get("/users/me");
      const realUser = normalizeUser(res.data);
      localStorage.setItem("user_data", JSON.stringify(realUser));
      setUser(realUser);
    } catch (error) {
      console.error("[AUTH] Erro ao ir buscar /users/me no login", error);
    }

    console.log("[AUTH] Calling initFcm after login...")
    initFcm();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    setUser(null);
    window.location.href = "/auth/login";
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => {
      const newUser = normalizeUser(prev ? { ...prev, ...userData } : (userData as User));
      localStorage.setItem("user_data", JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
