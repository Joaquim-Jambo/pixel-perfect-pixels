import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Star, Users, Clock, AlertCircle } from "lucide-react";
import { challenges } from "@/data/mock";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  OPEN: "bg-primary/15 text-primary border-primary/30",
  CLOSED: "bg-muted text-muted-foreground border-border",
  CANCELLED: "bg-destructive/15 text-destructive border-destructive/30",
};

const ChallengeDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const c = challenges.find(x => x.id === id) ?? challenges[0];
  const initials = c.team.split(" ").map(w => w[0]).slice(0, 2).join("");

  return (
    <div>
      <ScreenHeader title="Desafio" back />

      <div className="px-5 pb-6">
        <div className="rounded-3xl bg-gradient-card p-6 shadow-card border border-border/60 animate-slide-up">
          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-3xl font-display text-4xl text-background shadow-elevated"
              style={{ background: `linear-gradient(135deg, ${c.teamColor}, ${c.teamColor}aa)` }}
            >
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="font-display text-3xl leading-tight">{c.team}</h2>
              <div className="mt-1 flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-bold">{c.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">· Equipa amadora</span>
              </div>
            </div>
          </div>

          <span className={cn("mt-4 inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider", statusStyles[c.status] || "bg-muted text-foreground border-border")}>
            {c.status}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat icon={<Users className="h-5 w-5" />} label="Tipo" value={c.type} accent />
          <Stat icon={<Calendar className="h-5 w-5" />} label="Data" value={c.date} />
          <Stat icon={<Clock className="h-5 w-5" />} label="Hora" value={c.time} />
          <Stat icon={<MapPin className="h-5 w-5" />} label="Local" value={c.location} />
        </div>

        <div className="mt-6">
          <h3 className="font-display text-xl">Sobre o desafio</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {c.team} procura adversário para um {c.type} amigável. Equipa equilibrada, jogo com fair-play. Bola e equipamento de água por nossa conta.
          </p>
        </div>

        {c.status === "OPEN" ? (
          <Button 
            variant="hero" 
            size="lg" 
            className="mt-8 w-full"
            onClick={() => {
              toast.success("Candidatura enviada à equipa!");
              nav("/app");
            }}
          >
            Candidatar-me
          </Button>
        ) : (
          <div className="mt-8 rounded-2xl bg-secondary p-4 flex items-center justify-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-semibold">Desafio já não se encontra disponível</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) => (
  <div className="rounded-2xl bg-card border border-border/60 p-4">
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
      {icon}
    </div>
    <p className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</p>
    <p className="font-display text-xl mt-0.5">{value}</p>
  </div>
);

export default ChallengeDetail;
