import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const CreateTeam = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"capitão" | "treinador" | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-12 pb-6 relative">
      <button onClick={() => navigate(-1)} className="absolute top-12 left-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center pt-8">
        <h1 className="font-display text-4xl mb-2 text-center">A TUA EQUIPA</h1>
        <p className="text-muted-foreground text-center mb-10 text-sm">Configura o teu plantel antes de jogar.</p>

        <form className="w-full max-w-sm space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/app'); }}>
           <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome da Equipa</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Bayern de Munique Amador" 
              className="w-full rounded-2xl bg-card border border-border/60 px-5 py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-smooth text-center font-display text-2xl"
            />
          </div>

          <div className="space-y-3">
             <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">O teu papel</label>
             <div className="grid grid-cols-2 gap-3">
                 <button 
                  type="button"
                  onClick={() => setRole("capitão")}
                  className={cn(
                    "flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-smooth",
                    role === "capitão" 
                      ? "border-primary bg-primary/10 text-primary shadow-glow" 
                      : "border-border/60 bg-card text-muted-foreground hover:border-muted-foreground"
                  )}>
                    <UserCircle2 className="h-8 w-8 mb-2" />
                    <span className="font-bold text-sm">Capitão</span>
                 </button>

                 <button 
                  type="button"
                  onClick={() => setRole("treinador")}
                  className={cn(
                    "flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-smooth",
                    role === "treinador" 
                      ? "border-primary bg-primary/10 text-primary shadow-glow" 
                      : "border-border/60 bg-card text-muted-foreground hover:border-muted-foreground"
                  )}>
                    <Users className="h-8 w-8 mb-2" />
                    <span className="font-bold text-sm">Treinador</span>
                 </button>
             </div>
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            disabled={!role}
            className="w-full mt-6 bg-gradient-primary text-primary-foreground font-bold shadow-glow disabled:opacity-50 disabled:shadow-none"
          >
            Criar Equipa e Começar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
