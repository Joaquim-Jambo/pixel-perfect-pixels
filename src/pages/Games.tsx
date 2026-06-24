import { useState } from "react";
import { Link } from "react-router-dom";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ChallengeCard } from "@/components/ChallengeCard";
import { cn } from "@/lib/utils";
import { Calendar, Inbox, Loader2, MapPin, Users, Star, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/types/Challenge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { getChallengeRequests, acceptChallengeRequest, rejectChallengeRequest } from "@/lib/challengeRequests";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { AxiosError } from "axios";

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

  const [mockedRequests, setMockedRequests] = useState<Record<string, "ACCEPTED" | "REJECTED">>({});
  const [mockedChallenges, setMockedChallenges] = useState<Record<string, "CLOSED">>({});
  const [acceptedOpponents, setAcceptedOpponents] = useState<Record<string, string>>({});
  const [selectedRequest, setSelectedRequest] = useState<ChallengeRequestWithChallenge | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return acceptChallengeRequest(requestId);
    },
    onSuccess: (_, requestId) => {
      toast.success("Candidatura aceite!");
      queryClient.invalidateQueries({ queryKey: ["all_challenges"] });
      queryClient.invalidateQueries({ queryKey: ["challenge-requests"] });
      setIsDrawerOpen(false);
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || err.message || "Erro ao aceitar candidatura.");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return rejectChallengeRequest(requestId);
    },
    onSuccess: () => {
      toast.success("Candidatura recusada.");
      queryClient.invalidateQueries({ queryKey: ["all_challenges"] });
      queryClient.invalidateQueries({ queryKey: ["challenge-requests"] });
      setIsDrawerOpen(false);
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || err.message || "Erro ao recusar candidatura.");
    }
  });

  const { data: allChallenges = [], isLoading } = useQuery({
    queryKey: ["all_challenges"],
    queryFn: async () => {
      const response = await api.get<Challenge[]>("/challenges");
      return response.data;
    },
  });

  const myChallenges = allChallenges
    .filter((challenge) => challenge.teamId === myTeamId)
    .filter((challenge) => {
      const status = mockedChallenges[challenge.id ?? ""] || challenge.status;
      return status === "OPEN";
    });

  const myMatches = allChallenges
    .filter((challenge) => challenge.teamId === myTeamId)
    .filter((challenge) => {
      const status = mockedChallenges[challenge.id ?? ""] || challenge.status;
      return status === "CLOSED";
    });

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
              myMatches.map((match) => {
                const opponentName = match.match?.awayTeam?.name || acceptedOpponents[match.id ?? ""] || match.title || "Jogo";
                const isConfirmed = (mockedChallenges[match.id ?? ""] || match.status) === "CLOSED";

                return (
                  <div key={match.id} className="rounded-3xl bg-gradient-card p-5 border border-border/60 shadow-card animate-slide-up">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Adversário</p>
                        <h3 className="font-display text-2xl mt-0.5">{opponentName}</h3>
                      </div>
                      <span className="rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                        {isConfirmed ? "CONFIRMADO" : match.status}
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
                );
              })
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
              const currentStatus = mockedRequests[request.id] || request.status;
              const initials = request.team?.name
                ?.split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "??";
              const requestedAt = request.createdAt ? format(new Date(request.createdAt), "dd/MM · HH:mm") : "Sem data";

              return (
                <div 
                  key={request.id} 
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsDrawerOpen(true);
                  }}
                  className="cursor-pointer hover:border-primary/40 hover:shadow-glow/20 transition-smooth rounded-3xl bg-gradient-card p-5 border border-border/60 shadow-card animate-slide-up"
                >
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
                        <span className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase",
                          currentStatus === "PENDING" && "border-warning/30 bg-warning/15 text-warning",
                          currentStatus === "ACCEPTED" && "border-primary/30 bg-primary/15 text-primary",
                          currentStatus === "REJECTED" && "border-destructive/30 bg-destructive/15 text-destructive"
                        )}>
                          {currentStatus === "PENDING" && "PENDENTE"}
                          {currentStatus === "ACCEPTED" && "ACEITE"}
                          {currentStatus === "REJECTED" && "RECUSADO"}
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

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="mx-auto max-w-md bg-card/95 border-border/60 backdrop-blur-xl pb-6">
          {selectedRequest && (() => {
            const reqStatus = mockedRequests[selectedRequest.id] || selectedRequest.status;
            const initials = selectedRequest.team?.name
              ?.split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "??";
            
            const reqDateStr = selectedRequest.createdAt 
              ? format(new Date(selectedRequest.createdAt), "dd/MM/yyyy 'às' HH:mm") 
              : "Sem data";
            
            const matchDateStr = selectedRequest.challenge.scheduledAt
              ? format(new Date(selectedRequest.challenge.scheduledAt), "dd/MM/yyyy 'às' HH:mm")
              : "Sem data";

            return (
              <div className="px-6 space-y-6">
                <DrawerHeader className="px-0 pb-2">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground font-display text-4xl shadow-elevated">
                      {initials}
                    </div>
                  </div>
                  <DrawerTitle className="text-center font-display text-3xl leading-tight">
                    {selectedRequest.team?.name || "Equipa sem nome"}
                  </DrawerTitle>
                  <DrawerDescription className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-bold text-foreground">
                      {(selectedRequest.team?.rating ?? 5.0).toFixed(1)}
                    </span>
                    <span>· Pedido enviado em {reqDateStr}</span>
                  </DrawerDescription>
                </DrawerHeader>

                <div className="space-y-4">
                  {/* Detalhes do Desafio */}
                  <div className="rounded-2xl border border-border/60 bg-background/50 p-4 space-y-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                      Jogo Candidatado
                    </p>
                    <div>
                      <h4 className="font-display text-xl leading-tight">
                        {selectedRequest.challenge.title || "Desafio sem título"}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Formato: <span className="text-foreground font-semibold">{selectedRequest.challenge.gameType}</span>
                      </p>
                    </div>
                    
                    <div className="pt-2 border-t border-border/30 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {matchDateStr}
                      </span>
                      <span className="flex items-center gap-1.5 text-right">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{selectedRequest.challenge.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* Estado da Candidatura */}
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/50 p-4">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      Estado Atual
                    </span>
                    <span className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                      reqStatus === "PENDING" && "bg-warning/15 text-warning border border-warning/30",
                      reqStatus === "ACCEPTED" && "bg-primary/15 text-primary border border-primary/30",
                      reqStatus === "REJECTED" && "bg-destructive/15 text-destructive border border-destructive/30"
                    )}>
                      {reqStatus === "PENDING" && "Pendente"}
                      {reqStatus === "ACCEPTED" && "Aceite"}
                      {reqStatus === "REJECTED" && "Recusado"}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <DrawerFooter className="px-0 pt-2 flex flex-col gap-2">
                  {reqStatus === "PENDING" ? (
                    <>
                      <Button
                        size="lg"
                        className="w-full bg-gradient-primary text-primary-foreground font-bold shadow-glow flex items-center justify-center gap-2"
                        disabled={acceptMutation.isPending || rejectMutation.isPending}
                        onClick={() => {
                          acceptMutation.mutate(selectedRequest.id);
                        }}
                      >
                        {acceptMutation.isPending ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Check className="h-5 w-5" strokeWidth={3} />
                        )}
                        Aceitar Candidatura
                      </Button>

                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-destructive/60 bg-destructive/5 text-destructive hover:bg-destructive/10 flex items-center justify-center gap-2"
                        disabled={acceptMutation.isPending || rejectMutation.isPending}
                        onClick={() => {
                          rejectMutation.mutate(selectedRequest.id);
                        }}
                      >
                        {rejectMutation.isPending ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <X className="h-5 w-5" />
                        )}
                        Recusar Candidatura
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      Fechar Detalhes
                    </Button>
                  )}
                </DrawerFooter>
              </div>
            );
          })()}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Games;
