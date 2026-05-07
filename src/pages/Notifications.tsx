import { ScreenHeader } from "@/components/ScreenHeader";
import { notifications } from "@/data/mock";
import { Inbox, Check, X, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  REQUEST_RECEIVED: { icon: Inbox, color: "bg-accent/15 text-accent" },
  REQUEST_ACCEPTED: { icon: Check, color: "bg-primary/15 text-primary" },
  REQUEST_REJECTED: { icon: X, color: "bg-destructive/15 text-destructive" },
  MATCH_CONFIRMED: { icon: Trophy, color: "bg-warning/15 text-warning" },
};

const Notifications = () => {
  return (
    <div>
      <ScreenHeader title="Alertas" subtitle={`${notifications.filter(n => n.unread).length} não lidas`} back />

      <div className="px-5 space-y-2">
        {notifications.map(n => {
          const { icon: Icon, color } = ICONS[n.type];
          return (
            <div key={n.id} className={cn(
              "flex items-start gap-3 rounded-2xl p-4 border transition-smooth animate-slide-up",
              n.unread ? "bg-card border-primary/30" : "bg-card/50 border-border/60"
            )}>
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl shrink-0", color)}>
                <Icon className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-bold">{n.title}</p>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">{n.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
              </div>
              {n.unread && <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
