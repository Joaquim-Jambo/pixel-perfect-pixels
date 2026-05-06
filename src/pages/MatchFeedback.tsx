import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { myMatches } from "@/data/mock";

const MatchFeedback = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const match = myMatches.find((m) => m.id === id) ?? myMatches[0];

  const [showedUp, setShowedUp] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showedUp === null) {
      toast.error("Por favor indica se a equipa adversária compareceu.");
      return;
    }
    toast.success("Feedback enviado com sucesso! Obrigado.");
    nav("/app/games");
  };

  return (
    <div>
      <ScreenHeader title="Match Feedback" back />

      <div className="px-5 pt-6">
        <h2 className="font-display text-3xl mb-2">Avalia o {match.opponent}</h2>
        <p className="text-muted-foreground text-sm mb-8">
          O teu feedback é essencial para manter a comunidade saudável. O jogo aconteceu a {match.date}.
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

          <Button type="submit" variant="hero" size="lg" className="w-full">
            Enviar Feedback
          </Button>

        </form>
      </div>
    </div>
  );
};

export default MatchFeedback;