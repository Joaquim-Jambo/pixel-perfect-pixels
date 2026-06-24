import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Challenge } from "@/types/Challenge";
import { AxiosError } from "axios";

const MatchFeedback = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const myTeamId = user?.teams?.[0]?.id ?? user?.team?.id;

  const { data: match, isLoading } = useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      const response = await api.get<Challenge>(`/challenges/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const [showedUp, setShowedUp] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");

  const feedbackMutation = useMutation({
    mutationFn: async () => {
      if (!id || !myTeamId) throw new Error("Equipa não encontrada.");
      return api.post("/matches/give-feedback", {
        matchId: id,
        appeared: showedUp,
        comment: comment.trim() || undefined,
        teamId: myTeamId,
      });
    },
    onSuccess: () => {
      toast.success("Feedback enviado com sucesso! Obrigado.");
      nav("/app/games");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || error.message || "Erro ao enviar feedback.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showedUp === null) {
      toast.error("Por favor indica se a equipa adversária compareceu.");
      return;
    }
    feedbackMutation.mutate();
  };

  if (isLoading) {
    return (
      <div>
        <ScreenHeader title="Match Feedback" back />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div>
        <ScreenHeader title="Match Feedback" back />
        <div className="p-5 text-center text-muted-foreground mt-20">Desafio não encontrado.</div>
      </div>
    );
  }

  const opponentName = match.match?.awayTeam?.name || match.title || "Adversário";
  const dateObj = new Date(match.scheduledAt);
  const dateStr = dateObj.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });

  return (
    <div>
      <ScreenHeader title="Match Feedback" back />

      <div className="px-5 pt-6">
        <h2 className="font-display text-3xl mb-2">Avalia o {opponentName}</h2>
        <p className="text-muted-foreground text-sm mb-8">
          O teu feedback é essencial para manter a comunidade saudável. O jogo aconteceu a {dateStr}.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider">A equipa adversária apareceu?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowedUp(true)}
                className={`py-4 rounded-2xl border-2 font-display text-xl transition-smooth ${
                  showedUp === true 
                    ? "border-primary bg-primary/15 text-primary shadow-glow" 
                    : "border-border/60 bg-card text-muted-foreground hover:border-border"
                }`}
              >
                SIM
              </button>
              <button
                type="button"
                onClick={() => setShowedUp(false)}
                className={`py-4 rounded-2xl border-2 font-display text-xl transition-smooth ${
                  showedUp === false 
                    ? "border-destructive bg-destructive/15 text-destructive shadow-[0_0_20px_hsl(var(--destructive)/0.3)]" 
                    : "border-border/60 bg-card text-muted-foreground hover:border-border"
                }`}
              >
                NÃO
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Comentário (opcional)</label>
            <textarea 
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Como foi o jogo? Fair-play, confusão, etc..."
              className="w-full bg-input border border-border rounded-2xl px-4 py-3.5 text-[0.95rem] text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15 resize-none" 
            />
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={feedbackMutation.isPending}>
            {feedbackMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enviar Feedback"}
          </Button>

        </form>
      </div>
    </div>
  );
};

export default MatchFeedback;