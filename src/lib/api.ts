import axios from "axios";

// Permite usar a env VITE_API_URL, ou usar fallback para localhost
export const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token de acesso aos requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para gerir respostas e refresh de token / erros 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 429 (rate limit), rejeitar com mensagem amigável
    if (error.response?.status === 429) {
      const rateLimitError = new Error("Muitas requisições. Tente novamente mais tarde.");
      rateLimitError.name = "RateLimitError";
      return Promise.reject(rateLimitError);
    }

    // Se o erro for 401 e não for a rota de login nem a de refresh
    if (error.response?.status === 401 && !originalRequest.url?.includes("/auth/") && !originalRequest.url?.includes("/refresh") && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tentativa de refresh (agora usa o cookie httpOnly automaticamente se withCredentials for true)
        const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {}, {
          withCredentials: true
        });
        
        if (refreshResponse.status === 200 || refreshResponse.status === 201) {
          const data = refreshResponse.data;
          const newAccessToken = data.access_token || data.accessToken;

          if (newAccessToken) localStorage.setItem("access_token", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }

      // Se falhar o refresh
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      
      if (!window.location.pathname.includes('/auth/')) {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);
