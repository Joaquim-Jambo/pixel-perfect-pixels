import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Star, Settings, LogOut, ChevronRight, Trophy, Users, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// 1. Definição de Tipos
interface UserTeam {
  id: string;
  name: string;
  ownerRole: string; // ex: "CAPTAIN", "COACH"
  rating?: number;
  raiting?: number;
  gamePlayed?: number;
  emblemUrl?: string | null;
}

interface UserData {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  teams?: UserTeam[];
  rating?: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(!user);

  // Função para extrair iniciais
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .filter(n => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const fetchUserData = useCallback(async () => {
    try {
      if (!user) setIsLoading(true);
      const res = await api.get("/users/me");
      updateUser(res.data);
    } catch (error) {
      console.error("Erro ao recuperar sessão:", error);
      toast.error("Sessão expirada. Por favor, faz login novamente.");
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUser, logout]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error(e);
    } finally {
      toast.success("Sessão terminada");
      logout();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse tracking-widest uppercase font-bold">
          A carregar perfil...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-700">
      <ScreenHeader title="Perfil" back />

      <div className="px-5 space-y-5 pb-10 max-w-md mx-auto">
        {/* Card de Identidade */}
        <div className="rounded-3xl bg-gradient-hero p-6 border border-primary/20 text-center shadow-elevated relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none" />
          
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary text-background font-display text-4xl shadow-glow border-4 border-background/20 relative z-10 overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              (user ? getInitials(user.name) : "??")
            )}
          </div>
          
          <h2 className="mt-4 font-display text-3xl tracking-tight relative z-10">
            {user?.name || "Utilizador"}
          </h2>
          <p className="text-sm text-muted-foreground opacity-80 relative z-10">
            {user?.email}
          </p>
          {user?.phone && (
            <p className="text-xs text-muted-foreground/60 mt-1 relative z-10">
              {user.phone} {user.phoneVerified && <span className="text-primary font-bold">· Verificado</span>}
            </p>
          )}
        </div>

        {/* Card da Equipa */}
        {user?.teams && user.teams.length > 0 ? (
          user.teams.map((team) => (
            <div key={team.id} className="rounded-3xl bg-gradient-card p-5 border border-border/60 shadow-card">
              <p className="text-[10px] uppercase tracking-[0.15em] font-black text-muted-foreground/60 ml-1">
                A minha equipa
              </p>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-2xl shadow-glow overflow-hidden relative">
                  {team.emblemUrl ? (
                    <img src={team.emblemUrl} alt={team.name} className="h-full w-full object-cover" />
                  ) : (
                    team.name ? getInitials(team.name) : "OU"
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl leading-tight">
                    {team.name}
                  </h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider">
                    {team.ownerRole === "CAPTAIN" ? "Capitão" : team.ownerRole === "COACH" ? "Treinador" : team.ownerRole}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-display text-xl">
                      {team.rating !== undefined 
                        ? Number(team.rating).toFixed(1) 
                        : team.raiting !== undefined 
                          ? Number(team.raiting).toFixed(1) 
                          : "0.0"}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase">Rating</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">
                <Stat icon={<Trophy className="h-4 w-4" />} value={String(team.gamePlayed ?? 0)} label="Jogos" />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-gradient-card p-5 border border-border/60 shadow-card text-center">
            <p className="text-sm text-muted-foreground mb-4">Ainda não tens uma equipa.</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth/create-team">Criar Equipa</Link>
            </Button>
          </div>
        )}

        {/* Opções de Conta */}
        <div className="rounded-3xl bg-card border border-border/60 overflow-hidden shadow-sm">
          <Row 
            icon={<Settings className="h-5 w-5" />} 
            label="Editar perfil" 
            onClick={() => navigate("/app/profile/edit")} 
          />
          <div className="h-px bg-border/40 mx-4" />
          <Row 
            icon={<LogOut className="h-5 w-5" />} 
            label="Sair da conta" 
            danger 
            onClick={handleLogout} 
          />
        </div>

        <Button 
          asChild 
          variant="ghost" 
          size="sm" 
          className="w-full text-muted-foreground hover:text-foreground transition-colors py-6"
        >
          <Link to="/welcome">Voltar ao Início</Link>
        </Button>
      </div>
    </div>
  );
};

// Componentes Auxiliares Otimizados
const Stat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="rounded-2xl bg-secondary/40 p-3 flex items-center gap-3 border border-border/40 transition-smooth hover:border-primary/30">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
      {icon}
    </div>
    <div>
      <p className="font-display text-xl leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 font-medium">{label}</p>
    </div>
  </div>
);

const Row = ({ icon, label, danger, onClick }: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex w-full items-center gap-3 px-5 py-5 transition-all active:scale-[0.98] active:bg-secondary/80",
      danger ? "text-destructive" : "hover:bg-secondary/50"
    )}
  >
    <span className={cn(
      "p-2 rounded-lg bg-secondary", 
      danger && "bg-destructive/10 text-destructive"
    )}>
      {icon}
    </span>
    <span className="flex-1 text-left font-bold text-sm tracking-tight">{label}</span>
    <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
  </button>
);

export default Profile;