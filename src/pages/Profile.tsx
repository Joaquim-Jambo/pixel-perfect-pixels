import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Star, Settings, LogOut, ChevronRight, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div>
      <ScreenHeader title="Perfil" />

      <div className="px-5 space-y-5">
        <div className="rounded-3xl bg-gradient-hero p-6 border border-primary/20 text-center animate-slide-up">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary text-background font-display text-4xl shadow-elevated">
            JM
          </div>
          <h2 className="mt-4 font-display text-3xl">João Mendes</h2>
          <p className="text-sm text-muted-foreground">joao@onze.app</p>
        </div>

        <div className="rounded-3xl bg-gradient-card p-5 border border-border/60 shadow-card">
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">A minha equipa</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-2xl shadow-glow">
              OU
            </div>
            <div className="flex-1">
              <h3 className="font-display text-2xl leading-tight">Onze United</h3>
              <p className="text-xs text-primary font-bold uppercase tracking-wider">Capitão</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-display text-xl">4.6</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase">Rating</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat icon={<Trophy className="h-4 w-4" />} value="12" label="Jogos" />
            <Stat icon={<Users className="h-4 w-4" />} value="8" label="Adversários" />
          </div>
        </div>

        <div className="rounded-3xl bg-card border border-border/60 overflow-hidden">
          <Row icon={<Settings className="h-5 w-5" />} label="Editar perfil" />
          <div className="h-px bg-border/60 mx-4" />
          <Row icon={<LogOut className="h-5 w-5" />} label="Sair" danger />
        </div>

        <Button asChild variant="ghost" size="sm" className="w-full text-muted-foreground">
          <Link to="/welcome">Voltar ao welcome</Link>
        </Button>
      </div>
    </div>
  );
};

const Stat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="rounded-2xl bg-secondary/60 p-3 flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">{icon}</div>
    <div>
      <p className="font-display text-xl leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
    </div>
  </div>
);

const Row = ({ icon, label, danger }: { icon: React.ReactNode; label: string; danger?: boolean }) => (
  <button className={`flex w-full items-center gap-3 px-5 py-4 transition-smooth hover:bg-secondary ${danger ? "text-destructive" : ""}`}>
    {icon}
    <span className="flex-1 text-left font-semibold">{label}</span>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </button>
);

export default Profile;
