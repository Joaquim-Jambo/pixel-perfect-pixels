import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name?: string;
  team?: any;
  teams?: any[];
  [key: string]: any;
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
        
        if (token) {
          // 1. Mostrar os dados em cache para não haver ecrã branco/loading
          if (userDataStr) {
            setUser(JSON.parse(userDataStr));
          }
          // 2. Ir buscar os dados mais recentes à API, garantindo que temos tudo logo no arranque
          try {
            const res = await api.get("/users/me");
            setUser(res.data);
            localStorage.setItem("user_data", JSON.stringify(res.data));
          } catch (apiError) {
            console.error("Erro ao fazer refresh dos dados do utilizador na API:", apiError);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSession();
  }, []);

  const login = async (userData: User, accessToken: string) => {
    // O token é gravado imediatamente para o axios o apanhar nos interceptors
    localStorage.setItem("access_token", accessToken);
    
    try {
      // Como a API não retorna tudo no login, fazemos logo fetch do /users/me
      const res = await api.get("/users/me");
      const realUser = res.data;
      localStorage.setItem("user_data", JSON.stringify(realUser));
      setUser(realUser);
    } catch (error) {
      // Em caso de falha, guarda pelo menos o dummy object retornado no login
      console.error("Erro ao ir buscar /users/me no login", error);
      localStorage.setItem("user_data", JSON.stringify(userData));
      setUser(userData);
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
      const newUser = prev ? { ...prev, ...userData } : (userData as User);
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
