import { useParams, useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Calendar, MapPin, Clock, Trophy, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Challenge } from "@/types/Challenge";
import { format } from "date-fns";
import { AxiosError } from "axios";

const MatchDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: match, isLoading } = useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      const response = await api.get<Challenge>(`/challenges/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/challenges/${id}`);
    },
    onSuccess: () => {
      toast.success("Desafio cancelado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["all_challenges"] });
      nav("/app/games");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || error.message || "Erro ao cancelar desafio.");
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="p-5 text-center text-muted-foreground mt-20">Desafio não encontrado.</div>
    );
  }

  const isCreator = user?.teams?.[0]?.id === match.teamId;

  // Cores/Iniciais
  const myTeam = match.team?.name || "Desconhecido";
  const myColor = "#00E676";
  const myInitials = myTeam.split(" ").map(w => w[0]).slice(0, 2).join("");
  
  const hasAwayTeam = !!match.match?.awayTeam;
  const opponentName = hasAwayTeam 
    ? (match.match?.awayTeam?.name || "Adversário") 
    : (match.status === "CLOSED" ? "Adversário Confirmado" : "A aguardar adversário...");
  const opponentColor = match.status === "CLOSED" ? "#2979FF" : "#555";
  const opponentInitials = hasAwayTeam && match.match?.awayTeam?.name
    ? match.match.awayTeam.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : (match.status === "CLOSED" ? "AD" : "?");

  const dateStr = format(new Date(match.scheduledAt), "dd/MM/yyyy");
  const timeStr = format(new Date(match.scheduledAt), "HH:mm");

  return (
    <div>
      <ScreenHeader title="Detalhes do Jogo" back />

      {/* Matchup Header (SofaScore / ESPN style) */}
      <div className="relative pt-8 pb-12 px-5 bg-gradient-hero overflow-hidden border-b border-border/40">
        <div className="relative z-10 flex items-center justify-between">
          
          {/* Home Team */}
          <div className="flex flex-col items-center flex-1">
            <div 
              className="flex h-20 w-20 items-center justify-center rounded-full font-display text-3xl text-background shadow-glow border-4 border-background"
              style={{ background: `linear-gradient(135deg, ${myColor}, #000)` }}
            >
              {myInitials}
            </div>
            <h3 className="font-display text-xl mt-3 text-center leading-tight h-12">{myTeam}</h3>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Casa</span>
          </div>

          {/* VS Badge */}
          <div className="flex flex-col items-center justify-center px-4">
            <span className="text-sm font-bold text-muted-foreground mb-1">{dateStr}</span>
            <div className="bg-card border border-border px-3 py-1.5 rounded-xl font-display text-2xl shadow-elevated">
              {timeStr}
            </div>
            <span className={cn("mt-3 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border", match.status === "CLOSED" ? "bg-primary/15 text-primary border-primary/30" : "bg-destructive/15 text-destructive border-destructive/30")}>
              {match.status}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1">
            <div 
              className="flex h-20 w-20 items-center justify-center rounded-full font-display text-3xl text-background shadow-elevated border-4 border-background"
              style={{ background: `linear-gradient(135deg, ${opponentColor}, #333)` }}
            >
              {opponentInitials}
            </div>
            <h3 className="font-display text-xl mt-3 text-center leading-tight h-12">{opponentName}</h3>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Visitante</span>
          </div>

        </div>
      </div>

      {/* Match Details */}
      <div className="px-5 pt-6 pb-20">
        <h4 className="font-display text-xl mb-4">Informações da Partida</h4>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
           <div className="rounded-3xl bg-secondary p-4 flex flex-col items-center text-center justify-center border border-border/50">
             <Trophy className="h-6 w-6 text-primary mb-2" />
             <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Formato</span>
             <span className="font-display text-2xl mt-1">{match.gameType}</span>
           </div>
           
           <div className="rounded-3xl bg-secondary p-4 flex flex-col items-center text-center justify-center border border-border/50">
             <MapPin className="h-6 w-6 text-primary mb-2" />
             <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Local</span>
             <span className="font-display text-xl mt-1 leading-tight">{match.location}</span>
           </div>
        </div>

        <div className="rounded-3xl bg-card border border-border/60 p-5 mb-8">
           <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
             <AlertCircle className="h-4 w-4 text-primary" /> Regras e Notas
           </h4>
           <p className="text-sm text-muted-foreground leading-relaxed">
             {match.description || "Sem notas adicionais para este desafio."}
           </p>
        </div>

        {match.status === "CLOSED" && (
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full mb-4"
            onClick={() => {
              nav(`/app/match/${match.id}/feedback`);
            }}
          >
            Dar Feedback Pós-Jogo
          </Button>
        )}

        {isCreator && match.status !== "CANCELLED" && (
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full text-destructive border-destructive hover:bg-destructive/10"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if(confirm("Tem a certeza que deseja cancelar este desafio?")) {
                deleteMutation.mutate();
              }
            }}
          >
            {deleteMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <span className="flex items-center gap-2"><Trash2 className="h-4 w-4" /> Cancelar Desafio</span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MatchDetail;