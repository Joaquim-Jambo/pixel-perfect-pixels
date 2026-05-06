import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  subtitle?: string;
  back?: boolean;
  action?: React.ReactNode;
}

export const ScreenHeader = ({ title, subtitle, back, action }: Props) => {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/80 px-5 pt-6 pb-4 backdrop-blur-xl">
      {back && (
        <button
          onClick={() => nav(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-smooth hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-3xl leading-none">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
};
