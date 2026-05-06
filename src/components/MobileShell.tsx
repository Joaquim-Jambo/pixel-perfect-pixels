import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, Trophy, Bell, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/app", icon: Home, label: "Feed", end: true },
  { to: "/app/games", icon: Trophy, label: "Jogos" },
  { to: "/app/create", icon: Plus, label: "", fab: true },
  { to: "/app/notifications", icon: Bell, label: "Alertas" },
  { to: "/app/profile", icon: User, label: "Perfil" },
];

export const MobileShell = () => {
  const location = useLocation();
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background relative">
      <main className="flex-1 pb-24" key={location.pathname}>
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border/60 bg-card/95 backdrop-blur-xl">
        <div className="grid grid-cols-5 items-end px-2 py-2">
          {tabs.map(({ to, icon: Icon, label, fab, end }) =>
            fab ? (
              <NavLink key={to} to={to} className="flex justify-center -mt-8">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elevated animate-pulse-glow">
                  <Icon className="h-7 w-7" strokeWidth={3} />
                </span>
              </NavLink>
            ) : (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 py-2 text-xs font-semibold transition-smooth",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_8px_hsl(var(--primary))]")} strokeWidth={2.5} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            )
          )}
        </div>
      </nav>
    </div>
  );
};
