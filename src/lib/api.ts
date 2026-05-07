// src/lib/api.ts
const API_URL = "http://localhost:8080";

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function fetchWithAuth(endpoint: string, options: FetchOptions = {}) {
  const { requiresAuth = true, ...customOptions } = options;
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  
  const headers = new Headers(customOptions.headers);

  if (requiresAuth) {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...customOptions,
    headers,
  });

  if (response.status === 401 && requiresAuth) {
    // Access token expired, try to refresh it
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${refreshToken}`
          },
          body: JSON.stringify({ refresh_token: refreshToken }), // Opcional, caso a API espere no body
          credentials: "include" // Caso a API espere nos cookies
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          // Assuming the data contains the new tokens
          const newAccessToken = data.access_token || data.accessToken;
          const newRefreshToken = data.refresh_token || data.refreshToken || data.refreh_token;

          if (newAccessToken) localStorage.setItem("access_token", newAccessToken);
          if (newRefreshToken) localStorage.setItem("refresh_token", newRefreshToken);

          // Retry the original request with the new access token
          headers.set("Authorization", `Bearer ${newAccessToken}`);
          return fetch(url, {
            ...customOptions,
            headers,
          });
        }
      } catch (error) {
        // Failed to refresh token
        console.error("Token refresh failed:", error);
      }
    }
    
    // If refresh failed or no refresh token, log out
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/auth/login";
  }

  return response;
}
