import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Sparkles, Trophy, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";
import { normalizeUser } from "@/lib/auth-user";

type OwnerRoleType = "CAPTAIN" | "COACH";

const PROVINCES = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango",
  "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla",
  "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico",
  "Namibe", "Uíge", "Zaire",
];

const CreateTeam = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [ownerRole, setOwnerRole] = useState<OwnerRoleType | null>(null);
  const [teamName, setTeamName] = useState("");
  const [province, setProvince] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const selectedRoleLabel = ownerRole === "CAPTAIN" ? "Capitão" : ownerRole === "COACH" ? "Treinador" : "A definir";

  const summaryItems = [
    { label: "Nome", value: teamName.trim() || "Ainda não definido" },
    { label: "Província", value: province || "Seleciona uma província" },
    { label: "Papel", value: selectedRoleLabel },
  ];

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerRole || !teamName.trim() || !province) return;

    setIsLoading(true);

    try {
      const response = await api.post("/teams/", {
        name: teamName.trim(),
        ownerRole,
        province,
      });

      const data = response.data;
      let refreshedUserData = null;

      try {
        const refreshResponse = await api.post("/auth/refresh");
        const refreshedToken = refreshResponse.data.access_token || refreshResponse.data.accessToken;

        if (refreshedToken) {
          localStorage.setItem("access_token", refreshedToken);
        }
      } catch (refreshError) {
        console.error("Falha ao renovar token após criar equipa:", refreshError);
      }

      try {
        const meResponse = await api.get("/users/me");
        refreshedUserData = normalizeUser(meResponse.data);
      } catch (meError) {
        console.error("Falha ao recarregar /users/me após criar equipa:", meError);
      }

      const primaryTeam = refreshedUserData?.team ?? data;
      const teamList = refreshedUserData?.teams && refreshedUserData.teams.length > 0
        ? refreshedUserData.teams
        : [primaryTeam];

      updateUser({
        ...(refreshedUserData ?? {}),
        teams: teamList,
        team: primaryTeam,
      });

      toast.success("Equipa criada com sucesso!");
      navigate("/app");
    } catch (error) {
      const apiError = error as AxiosError<{ message?: string }>;
      toast.error(apiError.response?.data?.message || apiError.message || "Erro ao criar equipa.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsla(var(--primary),0.18),_transparent_28%),radial-gradient(circle_at_top_right,_hsla(var(--accent),0.12),_transparent_24%),linear-gradient(180deg,_transparent,_hsla(var(--primary),0.03))]" />
      <div className="pointer-events-none absolute -left-20 top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-72 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 pb-8 pt-6">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow-sm backdrop-blur transition-all hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Passo único
          </div>
        </div>

        <section className="mb-6 rounded-[2rem] border border-border/60 bg-card/80 p-6 shadow-card backdrop-blur-xl">
          <div className="flex items-center gap-3 text-primary">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Configuração inicial</p>
              <h1 className="font-display text-4xl leading-none">A tua equipa</h1>
            </div>
          </div>
          <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
            Define o nome, a província e o teu papel para entrar na arena com uma presença mais forte.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { label: "Identidade", value: "Nome" },
              { label: "Origem", value: "Província" },
              { label: "Função", value: "Papel" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/60 bg-background/70 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                <p className="mt-1 font-display text-base text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <form className="space-y-4" onSubmit={handleCreateTeam}>
          <div className="rounded-[2rem] border border-border/60 bg-card/90 p-5 shadow-card backdrop-blur-xl">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
              Nome da equipa
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="Ex: 1500 FC"
              className="w-full rounded-2xl border border-border/60 bg-background/90 px-4 py-4 text-center font-display text-2xl text-foreground outline-none transition-all placeholder:opacity-30 focus:border-primary focus:ring-4 focus:ring-primary/10"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          <div className="rounded-[2rem] border border-border/60 bg-card/90 p-5 shadow-card backdrop-blur-xl">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
              Província
            </label>
            <select
              required
              disabled={isLoading}
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-2xl border border-border/60 bg-background/90 px-4 py-4 text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="" disabled>Selecciona a tua província</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="rounded-[2rem] border border-border/60 bg-card/90 p-5 shadow-card backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                O teu papel
              </label>
              <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                Seleção obrigatória
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setOwnerRole("CAPTAIN")}
                className={cn(
                  "group rounded-[1.5rem] border p-4 text-left transition-all duration-300",
                  ownerRole === "CAPTAIN"
                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_0_1px_hsl(var(--primary))]"
                    : "border-border/60 bg-background/70 text-muted-foreground hover:border-primary/30 hover:bg-secondary/60"
                )}
              >
                <div className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-all",
                  ownerRole === "CAPTAIN" ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary text-foreground"
                )}>
                  <Trophy className="h-5 w-5" />
                </div>
                <p className="font-display text-2xl leading-none">Capitão</p>
                <p className="mt-2 text-sm leading-relaxed text-inherit opacity-80">
                  Lidera a equipa e publica desafios.
                </p>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => setOwnerRole("COACH")}
                className={cn(
                  "group rounded-[1.5rem] border p-4 text-left transition-all duration-300",
                  ownerRole === "COACH"
                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_0_1px_hsl(var(--primary))]"
                    : "border-border/60 bg-background/70 text-muted-foreground hover:border-primary/30 hover:bg-secondary/60"
                )}
              >
                <div className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-all",
                  ownerRole === "COACH" ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary text-foreground"
                )}>
                  <Users className="h-5 w-5" />
                </div>
                <p className="font-display text-2xl leading-none">Treinador</p>
                <p className="mt-2 text-sm leading-relaxed text-inherit opacity-80">
                  Organiza o plantel e acompanha o progresso.
                </p>
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-card to-background/90 p-5 shadow-card backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Resumo</p>
                <p className="font-display text-2xl">Antes de continuar</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                Live preview
              </span>
            </div>

            <div className="space-y-2">
              {summaryItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">{item.label}</span>
                  <span className="max-w-[14rem] truncate text-right font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Assim que criares a equipa, o acesso fica pronto para começares a entrar em desafios.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!ownerRole || !teamName.trim() || !province || isLoading}
            className="w-full rounded-[1.4rem] bg-gradient-primary py-7 font-bold text-primary-foreground shadow-[0_18px_40px_hsl(var(--primary)/0.28)] transition-all active:scale-[0.99]"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Criar equipa e começar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;