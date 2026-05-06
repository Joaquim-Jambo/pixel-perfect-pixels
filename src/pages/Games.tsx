import { useState } from "react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ChallengeCard } from "@/components/ChallengeCard";
import { myChallenges, myMatches, requests } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Check, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = "challenges" | "matches" | "requests";

const Games = () => {
  const [tab, setTab] = useState<Tab>("challenges");

  return (
    <div>
      <ScreenHeader title="Os meus jogos" subtitle="Gere a tua agenda" />

      <div className="px-5">
        <div className="flex gap-1 rounded-2xl bg-secondary p-1">
          {([
            ["challenges", "Desafios"],
            ["matches", "Jogos"],
            ["requests", `Pedidos${requests.length ? ` (${requests.length})` : ""}`],
          ] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wide transition-smooth",
                tab === key ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {tab === "challenges" && myChallenges.map(c => <ChallengeCard key={c.id} c={c} />)}
          {tab === "matches" && myMatches.map(m => (
            <div key={m.id} className="rounded-3xl bg-gradient-card p-5 border border-border/60 shadow-card animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">vs</p>
                  <h3 className="font-display text-2xl mt-0.5">{m.opponent}</h3>
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                  {m.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{m.date} · {m.time}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{m.location}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-lg bg-primary/15 px-3 py-1 text-sm font-display text-primary">{m.type}</span>
                <Button size="sm" variant="outline">Dar feedback</Button>
              </div>
            </div>
          ))}
          {tab === "requests" && requests.map(r => {
            const initials = r.team.split(" ").map(w => w[0]).slice(0, 2).join("");
            return (
              <div key={r.id} className="flex items-center gap-3 rounded-3xl bg-gradient-card p-4 border border-border/60 animate-slide-up">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl font-display text-xl text-background" style={{ background: r.teamColor }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg leading-tight">{r.team}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{r.rating}</span>
                    <span>· {r.date}</span>
                  </div>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow"><Check className="h-5 w-5" strokeWidth={3} /></button>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/20 text-destructive"><X className="h-5 w-5" strokeWidth={3} /></button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Games;
