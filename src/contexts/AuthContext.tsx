import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";
import { normalizeUser } from "@/lib/auth-user";

interface UserTeam {
  id: string;
  [key: string]: unknown;
}

interface User {
  id: string;
  email: string;
  name?: string;
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

  useEffect(() => {
    // Ao iniciar a app, verificar se temos sessão no localStorage
    const loadSession = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userDataStr = localStorage.getItem("user_data");
        
        if (token && userDataStr) {
          setUser(normalizeUser(JSON.parse(userDataStr)));
        }
      } catch (error) {
        console.error("Erro ao carregar cache da sessão:", error);
      } finally {
        setIsLoading(false);
      }

      // 2. Fetch the latest data in the background
      const currentToken = localStorage.getItem("access_token");
      if (currentToken) {
        try {
          const res = await api.get("/users/me");
          const normalizedUser = normalizeUser(res.data);
          setUser(normalizedUser);
          localStorage.setItem("user_data", JSON.stringify(normalizedUser));
        } catch (apiError) {
          console.error("Erro ao atualizar dados da API:", apiError);
        }
      }
    };
    
    loadSession();
  }, []);

  const login = async (userData: User, accessToken: string) => {
    localStorage.setItem("access_token", accessToken);
    const normalizedUser = normalizeUser(userData);
    localStorage.setItem("user_data", JSON.stringify(normalizedUser));
    setUser(normalizedUser); // Set user immediately so navigation to /app doesn't get blocked
    
    try {
      const res = await api.get("/users/me");
      const realUser = normalizeUser(res.data);
      localStorage.setItem("user_data", JSON.stringify(realUser));
      setUser(realUser);
    } catch (error) {
      console.error("Erro ao ir buscar /users/me no login", error);
    }
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
