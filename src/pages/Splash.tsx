import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para o ecrã de boas-vindas após 2.5 segundos
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />
      
      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center animate-slide-up">
        {/* Glow behind the logo */}
        <div className="absolute inset-0 rounded-full animate-pulse-glow" aria-hidden="true" />
        <img 
          src="/logo.png" 
          alt="Onze Logo" 
          className="relative z-10 h-48 w-48 object-contain drop-shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
        />
      </div>
    </div>
  );
};

export default Splash;
