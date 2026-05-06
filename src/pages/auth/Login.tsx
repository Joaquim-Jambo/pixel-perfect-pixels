import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-12 pb-6 relative">
      <button onClick={() => navigate(-1)} className="absolute top-12 left-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center pt-8">
        <h1 className="font-display text-4xl mb-2 text-center">JÁ TENS CADEIRA?</h1>
        <p className="text-muted-foreground text-center mb-10 text-sm">Entra na tua conta do Onze.</p>

        <form className="w-full max-w-sm space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/app'); }}>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
            <input 
              type="email" 
              required
              placeholder="mister@clube.pt" 
              className="w-full rounded-2xl bg-card border border-border/60 px-5 py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
            />
          </div>
          <div className="space-y-1 relative">
             <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full rounded-2xl bg-card border border-border/60 px-5 py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
            />
            <div className="flex justify-end mt-2">
               <Link to="#" className="text-xs text-primary font-medium hover:underline">Esqueci a password</Link>
            </div>
          </div>
          
          <Button type="submit" size="lg" className="w-full mt-6 bg-gradient-primary text-primary-foreground font-bold shadow-glow">
            Entrar
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-auto pt-6">
        Ainda não tens equipa? <Link to="/auth/register" className="text-foreground font-medium hover:text-primary">Regista-te</Link>
      </p>
    </div>
  );
};

export default Login;
