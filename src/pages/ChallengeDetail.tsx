import { useParams } from "react-router-dom";
import { Calendar, MapPin, Star, Users, Clock } from "lucide-react";
import { challenges } from "@/data/mock";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/button";

const ChallengeDetail = () => {
  const { id } = useParams();
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

          <span className="mt-4 inline-block rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
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

        <Button variant="hero" size="lg" className="mt-8 w-full">
          Candidatar-me
        </Button>
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
