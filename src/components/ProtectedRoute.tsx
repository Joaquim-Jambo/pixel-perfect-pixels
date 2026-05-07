import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  // Se não houver acesso nem token de refresh, redireciona para a página de login
  if (!accessToken && !refreshToken) {
    return <Navigate to="/auth/login" replace />;
  }

  // Se houver pelo menos um dos tokens, tentamos renderizar a aplicação
  // (Caso o access_token falte durante uma chamada, o interceptor da API tentará renová-lo)
  return <Outlet />;
};
