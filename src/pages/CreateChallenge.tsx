import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { GameType } from "@/data/mock";

const TYPES: GameType[] = ["5v5", "7v7", "11v11"];

const CreateChallenge = () => {
  const nav = useNavigate();
  const [type, setType] = useState<GameType>("7v7");

  return (
    <div>
      <ScreenHeader title="Novo desafio" subtitle="Convoca um adversário" back />

      <form
        className="px-5 pb-10 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Desafio publicado!");
          nav("/app/games");
        }}
      >
        <Field label="Título">
          <input required placeholder="Ex: Sábado à noite, jogo intenso" className="w-full bg-input border border-border rounded-2xl px-4 py-3.5 text-[0.95rem] text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
        </Field>

        <Field label="Descrição (opcional)">
          <textarea rows={3} placeholder="Detalhes do desafio..." className="w-full bg-input border border-border rounded-2xl px-4 py-3.5 text-[0.95rem] text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15 resize-none" />
        </Field>

        <Field label="Local">
          <input required placeholder="Campo, pavilhão..." className="w-full bg-input border border-border rounded-2xl px-4 py-3.5 text-[0.95rem] text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Data">
            <input required type="date" className="w-full bg-input border border-border rounded-2xl px-4 py-3.5 text-[0.95rem] text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
          </Field>
          <Field label="Hora">
            <input required type="time" className="w-full bg-input border border-border rounded-2xl px-4 py-3.5 text-[0.95rem] text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
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

        <Button type="submit" variant="hero" size="lg" className="w-full !mt-8">
          Publicar desafio
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
