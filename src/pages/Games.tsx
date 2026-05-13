import { useState } from "react";
import { Link } from "react-router-dom";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ChallengeCard } from "@/components/ChallengeCard";
import { cn } from "@/lib/utils";
import { Calendar, Inbox, Loader2, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/types/Challenge";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { getChallengeRequests } from "@/lib/challengeRequests";

type Tab = "challenges" | "matches" | "requests";

type ChallengeRequestWithChallenge = {
  id: string;
  teamId: string;
  challengeId: string;
  status: string;
  createdAt?: string | Date | null;
  team?: {
    id: string;
    name?: string;
    rating?: number | null;
  } | null;
  challenge: Challenge;
};

const Games = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("challenges");

  const myTeamId = user?.teams?.[0]?.id ?? user?.team?.id;

  const { data: allChallenges = [], isLoading } = useQuery({
    queryKey: ["all_challenges"],
    queryFn: async () => {
      const response = await api.get<Challenge[]>("/challenges");
      return response.data;
    },
  });

  const myChallenges = allChallenges.filter((challenge) => challenge.teamId === myTeamId && challenge.status === "OPEN");
  const myMatches = allChallenges.filter((challenge) => challenge.teamId === myTeamId && challenge.status === "CLOSED");

  const { data: requestItems = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ["challenge-requests", myTeamId, myChallenges.map((challenge) => challenge.id).join(",")],
    queryFn: async () => {
      const results = await Promise.all(
        myChallenges.map(async (challenge) => {
          const requests = await getChallengeRequests(challenge.id ?? "");
          return requests.map((request) => ({
            ...request,
            challenge,
          })) as ChallengeRequestWithChallenge[];
        })
      );

      return results.flat();
    },
    enabled: tab === "requests" && !!myTeamId && myChallenges.length > 0,
  });

  return (
    <div>
      <ScreenHeader title="Os meus jogos" subtitle="Gere a tua agenda" />

      <div className="px-5">
        <div className="flex gap-1 rounded-2xl bg-secondary p-1">
          {([
            ["challenges", "Desafios"],
            ["matches", "Jogos"],
            ["requests", "Pedidos"],
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
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tab === "challenges" ? (
            myChallenges.length > 0 ? (
              myChallenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)
            ) : (
              <p className="text-muted-foreground text-center py-8">Não tens desafios abertos.</p>
            )
          ) : tab === "matches" ? (
            myMatches.length > 0 ? (
              myMatches.map((match) => (
                <div key={match.id} className="rounded-3xl bg-gradient-card p-5 border border-border/60 shadow-card animate-slide-up">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Adversário</p>
                      <h3 className="font-display text-2xl mt-0.5">{match.title || "Jogo"}</h3>
                    </div>
                    <span className="rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                      {match.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{format(new Date(match.scheduledAt), "dd/MM/yyyy · HH:mm")}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{match.location}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-lg bg-primary/15 px-3 py-1 text-sm font-display text-primary">{match.gameType}</span>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/app/match/${match.id}`}>Ver Partida</Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">Não tens jogos agendados.</p>
            )
          ) : !myTeamId ? (
            <div className="rounded-3xl bg-card border border-border/60 p-6 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl">Ainda não tens equipa</h3>
              <p className="text-sm text-muted-foreground">
                Cria uma equipa para veres os pedidos recebidos nos teus desafios.
              </p>
            </div>
          ) : isLoadingRequests ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : requestItems.length > 0 ? (
            requestItems.map((request) => {
              const initials = request.team?.name
                ?.split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "??";
              const requestedAt = request.createdAt ? format(new Date(request.createdAt), "dd/MM · HH:mm") : "Sem data";

              return (
                <div key={request.id} className="rounded-3xl bg-gradient-card p-5 border border-border/60 shadow-card animate-slide-up">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-2xl shadow-glow overflow-hidden">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">Equipa candidata</p>
                          <h3 className="font-display text-2xl leading-tight truncate">{request.team?.name || "Equipa sem nome"}</h3>
                        </div>
                        <span className="rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                          {request.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Inbox className="h-3.5 w-3.5" />{request.challenge.title || "Desafio"}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{format(new Date(request.challenge.scheduledAt), "dd/MM/yyyy · HH:mm")}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{request.challenge.location}</span>
                      </div>

                      <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                        Pedido enviado {requestedAt}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl bg-card border border-border/60 p-6 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <Inbox className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl">Sem pedidos no momento</h3>
              <p className="text-sm text-muted-foreground">
                Quando outras equipas se candidatarem aos teus desafios, vão aparecer aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;
