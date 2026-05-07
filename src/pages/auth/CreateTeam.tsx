import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle2, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type OwnerRoleType = "CAPTAIN" | "COACH";

const PROVINCES = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango",
  "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla",
  "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico",
  "Namibe", "Uíge", "Zaire",
];

const CreateTeam = () => {
  const navigate = useNavigate();
  const [ownerRole, setOwnerRole] = useState<OwnerRoleType | null>(null);
  const [teamName, setTeamName] = useState("");
  const [province, setProvince] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerRole || !teamName.trim() || !province) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("http://localhost:8080/teams/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ← backend extrai o userId daqui
        },
        body: JSON.stringify({
          name: teamName.trim(),
          ownerRole,
          province, // ← campo novo
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao criar equipa.");
      }

      const data = await response.json();

      // Actualiza o cache com a equipa criada
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      localStorage.setItem("user_data", JSON.stringify({
        ...userData,
        team: data,
      }));

      toast.success("Equipa criada com sucesso!");
      navigate("/app");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar equipa.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-12 pb-6 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-12 left-6 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center pt-8">
        <header className="mb-10">
          <h1 className="font-display text-4xl mb-2 text-center uppercase tracking-tight">A Tua Equipa</h1>
          <p className="text-muted-foreground text-center text-sm">Configura o teu plantel antes de jogar.</p>
        </header>

        <form className="w-full max-w-sm space-y-6" onSubmit={handleCreateTeam}>
          {/* Nome da Equipa */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Nome da Equipa
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="Ex: Bayern de Munique Amador"
              className="w-full rounded-2xl bg-card border border-border/60 px-5 py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-center font-display text-2xl placeholder:opacity-30"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          {/* Província */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Província
            </label>
            <select
              required
              disabled={isLoading}
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-2xl bg-card border border-border/60 px-5 py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            >
              <option value="" disabled>Selecciona a tua província</option>
              {PROVINCES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Papel */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
              O teu papel
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setOwnerRole("CAPTAIN")}
                className={cn(
                  "flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300",
                  ownerRole === "CAPTAIN"
                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                    : "border-border/60 bg-card text-muted-foreground hover:border-muted-foreground"
                )}
              >
                <UserCircle2 className={cn("h-8 w-8 mb-2", ownerRole === "CAPTAIN" && "animate-pulse")} />
                <span className="font-bold text-sm tracking-tight">Capitão</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => setOwnerRole("COACH")}
                className={cn(
                  "flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300",
                  ownerRole === "COACH"
                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                    : "border-border/60 bg-card text-muted-foreground hover:border-muted-foreground"
                )}
              >
                <Users className={cn("h-8 w-8 mb-2", ownerRole === "COACH" && "animate-pulse")} />
                <span className="font-bold text-sm tracking-tight">Treinador</span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!ownerRole || !teamName.trim() || !province || isLoading}
            className="w-full mt-6 bg-gradient-primary text-primary-foreground font-bold shadow-glow transition-all active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Criar Equipa e Começar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;