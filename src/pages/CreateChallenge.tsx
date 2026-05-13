import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type UIGameType = "5v5" | "7v7" | "11v11";
type CreateChallengePayload = {
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  gameType: string;
  scheduledAt: string;
  province: string;
};
const TYPES: UIGameType[] = ["5v5", "7v7", "11v11"];
const GAMETYPE_MAP: Record<string, string> = {
  "5v5": "v5v5",
  "7v7": "v7v7",
  "11v11": "v11v11",
};

const CreateChallenge = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [type, setType] = useState<UIGameType>("7v7");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const mutation = useMutation({
    mutationFn: async (payload: CreateChallengePayload) => {
      const res = await api.post("/challenges", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Desafio publicado!");
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      nav("/app/games");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Erro ao publicar desafio.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !date || !time) return;

    // Combine date and time to ISO 8601
    const scheduledAt = new Date(`${date}T${time}`).toISOString();
    
    const province = user?.teams?.[0]?.province || user?.team?.province || "Desconhecido";

    mutation.mutate({
      title,
      description,
      location,
      latitude: 0, // Fallback
      longitude: 0, // Fallback
      gameType: GAMETYPE_MAP[type],
      scheduledAt,
      province,
    });
  };

  return (
    <div>
      <ScreenHeader title="Novo desafio" subtitle="Convoca um adversário" back />

      <form
        className="px-5 pb-10 space-y-5"
        onSubmit={handleSubmit}
      >
        <Field label="Título">
          <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Sábado à noite, jogo intenso" className="w-full bg-input border border-border rounded-2xl px-4 py-3.5 text-[0.95rem] text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
        </Field>

        <Field label="Descrição (opcional)">
          <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalhes do desafio..." className="w-full bg-input border border-border rounded-2xl px-4 py-3.5 text-[0.95rem] text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15 resize-none" />
        </Field>

        <Field label="Local">
          <input required value={location} onChange={e => setLocation(e.target.value)} placeholder="Campo, pavilhão..." className="w-full bg-input border border-border rounded-2xl px-4 py-3.5 text-[0.95rem] text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Data">
            <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-input border border-border rounded-2xl px-4 py-3.5 text-[0.95rem] text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
          </Field>
          <Field label="Hora">
            <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-input border border-border rounded-2xl px-4 py-3.5 text-[0.95rem] text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
          </Field>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Tipo de jogo</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "rounded-2xl border-2 py-5 font-display text-2xl transition-smooth",
                  type === t
                    ? "border-primary bg-primary/15 text-primary shadow-glow"
                    : "border-border bg-card text-muted-foreground hover:border-border/80"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full !mt-8" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Publicar desafio"}
        </Button>
      </form>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{label}</span>
    <div className="mt-2">{children}</div>
  </label>
);

export default CreateChallenge;
