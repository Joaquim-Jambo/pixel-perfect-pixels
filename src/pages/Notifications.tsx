import { ScreenHeader } from "@/components/ScreenHeader";
import { Inbox, Check, X, Trophy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AppNotification } from "@/types/Challenge";

const ICONS = {
  REQUEST_RECEIVED: { icon: Inbox, color: "bg-accent/15 text-accent" },
  REQUEST_ACCEPTED: { icon: Check, color: "bg-primary/15 text-primary" },
  REQUEST_REJECTED: { icon: X, color: "bg-destructive/15 text-destructive" },
  MATCH_CONFIRMED: { icon: Trophy, color: "bg-warning/15 text-warning" },
};

const Notifications = () => {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get<AppNotification[]>("/notifications");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div>
        <ScreenHeader title="Alertas" subtitle="Carregando..." back />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="Alertas" subtitle={`${notifications.filter(n => !n.read).length} não lidas`} back />

      <div className="px-5 space-y-2">
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground py-10 text-sm">Nenhuma notificação por agora.</p>
        ) : (
          notifications.map(n => {
            const { icon: Icon, color } = ICONS[n.type] || { icon: Inbox, color: "bg-muted text-muted-foreground" };
            const timeAgo = n.createdAt
              ? new Date(n.createdAt).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
              : "";
            return (
              <div key={n.id} className={cn(
                "flex items-start gap-3 rounded-2xl p-4 border transition-smooth animate-slide-up",
                !n.read ? "bg-card border-primary/30" : "bg-card/50 border-border/60"
              )}>
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl shrink-0", color)}>
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-bold">{n.title}</p>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">{timeAgo}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                </div>
                {!n.read && <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;