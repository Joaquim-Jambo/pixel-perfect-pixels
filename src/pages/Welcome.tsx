import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-pitch.jpg";

const Welcome = () => {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-background">
      <img src={hero} alt="Football pitch at night" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      
      <div className="relative z-10 flex flex-1 flex-col items-center justify-between px-8 py-14">
        <div className="flex items-center gap-3 pt-6">
          <img src="/logo.png" alt="Onze" className="h-10 w-10" />
          <span className="font-display text-4xl tracking-widest mt-1">ONZE</span>
        </div>

        <div className="text-center">
          <p className="font-display text-sm uppercase tracking-[0.4em] text-primary">Desafia. Joga. Repete.</p>
          <h1 className="mt-4 font-display text-6xl leading-[0.9]">
            O TEU PRÓXIMO<br />
            <span className="text-primary drop-shadow-[0_0_24px_hsl(var(--primary)/0.7)]">JOGO</span><br />
            COMEÇA AQUI.
          </h1>
          <p className="mt-6 text-base text-muted-foreground max-w-xs mx-auto">
            Cria desafios, encontra adversários e marca jogos com equipas amadoras perto de ti.
          </p>
        </div>

        <div className="w-full space-y-3">
          <Button asChild variant="hero" size="lg" className="w-full">
            <Link to="/auth/register">Criar conta</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link to="/auth/login">Entrar</Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground pt-2">
            Ao continuar aceitas os termos do Onze.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
