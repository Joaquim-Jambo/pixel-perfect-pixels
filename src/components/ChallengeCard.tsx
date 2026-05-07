import { Calendar, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Challenge } from "@/types/Challenge";

// Tipo real da API — substitui o import do mock
interface ChallengeTeam {
  id: string;
  name: string;
  province?: string;
  emblemUrl?: string | null;
  raiting?: number;
}

const statusStyles: Record<string, string> = {
  OPEN: "bg-primary/15 text-primary border-primary/30",
  CLOSED: "bg-muted text-muted-foreground border-border",
  CANCELLED: "bg-destructive/15 text-destructive border-destructive/30",
};

const getInitials = (name: string) =>
  name?.split(" ")?.map(w => w[0])?.slice(0, 2)?.join("").toUpperCase();

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" }),
    time: d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
  };
};

interface IChallangeCardProps {
  challenge: Challenge,
  to?: string
}

export const ChallengeCard = ({ challenge, to }: IChallangeCardProps) => {
  const initials = getInitials(challenge.title ?? "");

  const { date, time } = formatDate(challenge.scheduledAt ? challenge.scheduledAt.toString() : "");

  return (
    <Link
      to={to ?? `/app/challenge/${challenge.id}`}
      className="group block rounded-3xl bg-gradient-card p-5 shadow-card border border-border/60 transition-smooth hover:border-primary/50 hover:shadow-elevated animate-slide-up"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-2xl text-background shadow-card bg-gradient-primary overflow-hidden">
          {getInitials(challenge.title ?? "")}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-xl truncate">{challenge.title ?? ""}</h3>
            <span className={cn(
              "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              statusStyles[challenge.status] ?? "bg-muted text-foreground border-border"
            )}>
              {challenge.status}
            </span>
          </div>

          {/* {challenge.team?.raiting !== undefined && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span className="font-semibold text-foreground">
                {Number(challenge.team.raiting).toFixed(1)}
              </span>
            </div>
          )} */}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="rounded-lg bg-primary/15 px-3 py-1.5 text-sm font-display text-primary">
          {challenge.gameType}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" /> {date} · {time}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" /> {challenge.location}
      </div>

      {/* {challenge.pendingRequests ? (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          {challenge.pendingRequests} pedidos pendentes
        </div>
      ) : null} */}
    </Link>
  );
};