import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero-pitch.jpg";

const Welcome = () => {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-background">
      <img src={hero} alt="Football pitch at night" className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      <div className="relative z-10 flex flex-1 flex-col items-center justify-between px-6 pb-10 pt-16">
        <div className="flex animate-in fade-in slide-in-from-top-4 flex-col items-center gap-3 duration-700">
          <div className="relative flex items-center justify-center rounded-2xl bg-background/20 p-3 backdrop-blur-xl border border-white/5 shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
            <img src="/logo.png" alt="Onze" className="h-12 w-12 drop-shadow-[0_0_15px_hsl(var(--primary)/0.8)]" />
          </div>
          <span className="font-display text-xl tracking-[0.4em] font-medium text-foreground/90">ONZE</span>
        </div>

        <div className="w-full flex-1 flex flex-col justify-end pb-8 text-center animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150">
          <div className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6 w-fit mx-auto backdrop-blur-md">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">A Revolução do Futebol Amador</span>
          </div>
          
          <h1 className="font-display text-4xl font-extrabold leading-[1.15] tracking-tight">
            O teu próximo <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 drop-shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
              jogo
            </span><br />
            começa aqui
          </h1>
          <p className="mt-5 text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
            Encontra adversários, gere a tua equipa e leva a competição para o próximo nível.
          </p>
        </div>

        <div className="w-full space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
          <Button asChild size="lg" className="w-full h-14 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base">
            <Link to="/auth/register">
              Começar Agora <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full h-14 rounded-2xl border-border/30 bg-background/40 backdrop-blur-xl hover:bg-card/80 font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Link to="/auth/login">Já tenho uma conta</Link>
          </Button>
          
          <p className="text-center text-[10px] text-muted-foreground pt-4 max-w-[260px] mx-auto leading-tight">
            Ao continuar, assume concordar com os nossos{" "}
            <Link to="#" className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">Termos</Link> e{" "}
            <Link to="#" className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">Privacidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
