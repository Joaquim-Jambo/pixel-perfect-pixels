import { useParams, useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/ScreenHeader";
import { myMatches } from "@/data/mock";
import { Calendar, MapPin, Clock, Trophy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MatchDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  // Assume mock para o jogo. fallback para o primeiro caso não encontre.
  const match = myMatches.find((m) => m.id === id) ?? myMatches[0];

  // Cores/Iniciais mockadas baseadas no nome
  const myTeam = "Onze United";
  const myColor = "#00E676";
  const myInitials = "OU";
  
  const opponentColor = match.opponent.length % 2 === 0 ? "#2979FF" : "#FF6D00";
  const opponentInitials = match.opponent.split(" ").map(w => w[0]).slice(0, 2).join("");

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
            <span className="text-sm font-bold text-muted-foreground mb-1">{match.date}</span>
            <div className="bg-card border border-border px-3 py-1.5 rounded-xl font-display text-2xl shadow-elevated">
              {match.time}
            </div>
            <span className={cn("mt-3 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border", match.status === "CONFIRMED" ? "bg-primary/15 text-primary border-primary/30" : "bg-destructive/15 text-destructive border-destructive/30")}>
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
            <h3 className="font-display text-xl mt-3 text-center leading-tight h-12">{match.opponent}</h3>
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
             <span className="font-display text-2xl mt-1">{match.type}</span>
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
             Jogo amigável. Custo do campo a dividir por ambas as equipas no final (dinheiro ou MBWay). Levem equipamento claro e escuro por precaução. Chegar 15 minutos antes da hora marcada.
           </p>
        </div>

        {match.status === "CONFIRMED" && (
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full"
            onClick={() => {
              nav(`/app/match/${match.id}/feedback`);
            }}
          >
            Dar Feedback Pós-Jogo
          </Button>
        )}
      </div>
    </div>
  );
};

export default MatchDetail;