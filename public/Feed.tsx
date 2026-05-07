import { useState } from "react";
import { Bell, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { challenges, type GameType } from "@/data/mock";
import { ChallengeCard } from "@/components/ChallengeCard";
import { cn } from "@/lib/utils";

const TYPES: (GameType | "ALL")[] = ["ALL", "5v5", "7v7", "11v11"];

// Mapeia ownerRole → label de saudação
const ROLE_LABEL: Record<string, string> = {
  CAPTAIN: "Capitão",
  COACH: "Treinador",
};

const Feed = () => {
  const [type, setType] = useState<GameType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Lê do cache — mesmo padrão do Profile
  const userData = (() => {
    try {
      const saved = localStorage.getItem("user_data");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const ownerRole = userData?.teams?.[0]?.ownerRole;
  const roleLabel = ownerRole ? (ROLE_LABEL[ownerRole] ?? ownerRole) : null;
  const greeting = roleLabel ? `Olá, ${roleLabel} 👊` : "Olá 👊";

  const filtered = challenges.filter(c => {
    const matchesType = type === "ALL" || c.type === type;
    const matchesSearch =
      c.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div>
      <header className="bg-gradient-hero px-5 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Onze</p>
            <h1 className="font-display text-4xl mt-1">{greeting}</h1>
          </div>
          <Link
            to="/app/notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-secondary"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
          </Link>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-card/80 backdrop-blur px-4 py-3 border border-border/60">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            placeholder="Procurar equipas, locais..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button aria-label="Filtro de busca">
            <Filter className="h-4 w-4 text-primary" />
          </button>
        </div>
      </header>

      <div className="px-5">
        <div className="-mt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-smooth",
                type === t
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "ALL" ? "Todos" : t}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-baseline justify-between">
          <h2 className="font-display text-2xl">Desafios abertos</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} disponíveis</span>
        </div>

        <div className="mt-3 space-y-3">
          {filtered.map(c => <ChallengeCard key={c.id} c={c} />)}
        </div>
      </div>
    </div>
  );
};

export default Feed;