import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Calendar, Clock, Loader2, MapPin, Star, Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { getChallengeRequests, joinChallenge, leaveChallenge } from "@/lib/challengeRequests";
import { cn } from "@/lib/utils";
import { Challenge } from "@/types/Challenge";
import { getActiveTeamId, normalizeUser } from "@/lib/auth-user";

const statusStyles: Record<string, string> = {
  OPEN: "bg-primary/15 text-primary border-primary/30",
  CLOSED: "bg-muted text-muted-foreground border-border",
  CANCELLED: "bg-destructive/15 text-destructive border-destructive/30",
};

const ChallengeDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const myTeamId = getActiveTeamId(user);

  const { data: freshUser, isFetching: isFetchingFreshUser } = useQuery({
    queryKey: ["current-user", "challenge-detail"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return normalizeUser(res.data);
    },
    enabled: !!user && !myTeamId,
  });

  const resolvedTeamId = myTeamId ?? getActiveTeamId(freshUser);

  const { data: challenge, isLoading, error } = useQuery({
    queryKey: ["challenge", id],
    queryFn: async () => {
      const res = await api.get<Challenge>(`/challenges/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: requests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ["challenge-requests", id],
    queryFn: async () => {
      if (!id) return [];
      return getChallengeRequests(id);
    },
    enabled: !!id && !!challenge && challenge.status === "OPEN",
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!id || !resolvedTeamId) {
        throw new Error("Você deve ter uma equipa para entrar em um desafio.");
      }

      return joinChallenge(id, resolvedTeamId);
    },
    onSuccess: () => {
      toast.success("Candidatura enviada à equipa!");
      queryClient.invalidateQueries({ queryKey: ["challenge-requests", id] });
    },
    onError: (mutationError: AxiosError<{ message?: string }>) => {
      toast.error(Array.isArray(mutationError.response?.data?.message) ? mutationError.response.data.message.join(", ") : mutationError.response?.data?.message || mutationError.message || "Erro ao candidatar-se ao desafio.");
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async () => {
      if (!id || !resolvedTeamId) {
        throw new Error("Você deve ter uma equipa para sair de um desafio.");
      }

      return leaveChallenge(id, resolvedTeamId);
    },
    onSuccess: () => {
      toast.success("Candidatura cancelada.");
      queryClient.invalidateQueries({ queryKey: ["challenge-requests", id] });
    },
    onError: (mutationError: AxiosError<{ message?: string }>) => {
      toast.error(Array.isArray(mutationError.response?.data?.message) ? mutationError.response.data.message.join(", ") : mutationError.response?.data?.message || mutationError.message || "Erro ao cancelar a candidatura.");
    },
  });

  if (isLoading) {
    return (
      <div>
        <ScreenHeader title="Desafio" back />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div>
        <ScreenHeader title="Desafio" back />
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p>Desafio não encontrado.</p>
        </div>
      </div>
    );
  }

  const teamName = challenge.team?.name || "Desconhecido";
  const initials = teamName.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase();
  const teamColor = "hsl(var(--primary))";
  const rating = challenge.team?.rating || 0;
  const dateObj = new Date(challenge.scheduledAt);
  const dateStr = dateObj.toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
  const timeStr = dateObj.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
  const mapType: Record<string, string> = {
    v5v5: "5v5",
    v7v7: "7v7",
    v11v11: "11v11",
  };
  const uiGameType = mapType[challenge.gameType] || challenge.gameType;
  const existingRequest = resolvedTeamId ? requests.find((request) => request.teamId === resolvedTeamId) : undefined;

  return (
    <div>
      <ScreenHeader title="Desafio" back />

      <div className="px-5 pb-6">
        <div className="rounded-3xl bg-gradient-card p-6 shadow-card border border-border/60 animate-slide-up">
          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-3xl font-display text-4xl text-background shadow-elevated"
              style={{ background: `linear-gradient(135deg, ${teamColor}, ${teamColor}aa)` }}
            >
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="font-display text-3xl leading-tight">{teamName}</h2>
              <div className="mt-1 flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-bold">{rating.toFixed(1)}</span>
                <span className="text-muted-foreground">· Equipa amadora</span>
              </div>
            </div>
          </div>

          <span className={cn("mt-4 inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider", statusStyles[challenge.status] || "bg-muted text-foreground border-border")}>
            {challenge.status}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat icon={<Users className="h-5 w-5" />} label="Tipo" value={uiGameType} accent />
          <Stat icon={<Calendar className="h-5 w-5" />} label="Data" value={dateStr} />
          <Stat icon={<Clock className="h-5 w-5" />} label="Hora" value={timeStr} />
          <Stat icon={<MapPin className="h-5 w-5" />} label="Local" value={challenge.location || "A definir"} />
        </div>

        <div className="mt-6">
          <h3 className="font-display text-xl">Sobre o desafio</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {challenge.description || `${teamName} procura adversário para um ${uiGameType} amigável. Equipa equilibrada, jogo com fair-play.`}
          </p>
        </div>

        {challenge.status === "OPEN" && (
          <div className="mt-6 rounded-[2rem] border border-border/60 bg-card/85 p-5 shadow-card backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-bold">Solicitações</p>
                <p className="font-display text-3xl leading-none">{requests.length}</p>
              </div>
              {isLoadingRequests ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                  {existingRequest ? existingRequest.status : "Disponível"}
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "Estado", value: challenge.status },
                { label: "Formato", value: uiGameType },
                { label: "Zona", value: challenge.province || "N/A" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/60 bg-background/70 px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                  <p className="mt-1 font-display text-lg leading-none">{item.value}</p>
                </div>
              ))}
            </div>

            {resolvedTeamId ? (
              <div className="mt-5 space-y-3">
                {existingRequest ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-2xl border-destructive/60 bg-destructive/5 text-destructive hover:bg-destructive/10"
                    disabled={leaveMutation.isPending}
                    onClick={() => leaveMutation.mutate()}
                  >
                    {leaveMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Cancelar candidatura"}
                  </Button>
                ) : (
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full rounded-2xl"
                    disabled={joinMutation.isPending}
                    onClick={() => joinMutation.mutate()}
                  >
                    {joinMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Candidatar-me"}
                  </Button>
                )}

                {!existingRequest && requests.length > 0 && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {requests.length} equipa(s) já se candidataram.
                  </p>
                )}
              </div>
            ) : isFetchingFreshUser ? (
              <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                A verificar a tua equipa...
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-border/60 bg-background/60 p-4">
                <p className="text-sm text-muted-foreground">
                  Cria uma equipa para te candidatares a este desafio.
                </p>
              </div>
            )}
          </div>
        )}

        {challenge.status !== "OPEN" ? (
          <div className="mt-8 rounded-2xl bg-secondary p-4 flex items-center justify-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-semibold">Desafio já não se encontra disponível</span>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="lg" 
            className="mt-8 w-full"
            onClick={() => nav("/app")}
          >
            Voltar ao feed
          </Button>
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
