import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name, 
          email, 
          passwordHash: password, // As per API docs RegisterDto
          confirmPassword: password 
        }),
        credentials: "include", // ← ISTO PERMITE RECEBER E SALVAR O COOKIE
      });

      if (!response.ok) {
        throw new Error("Erro no registo. Tenta novamente.");
      }

      const data = await response.json();
      console.log(data)
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }
      if (data.refresh_token || data.refreh_token) {
        localStorage.setItem("refresh_token", data.refresh_token || data.refreh_token);
      }
      
      toast.success("Conta criada com sucesso!");
      navigate("/auth/create-team");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta. Tenta novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-12 pb-6 relative">
      <button onClick={() => navigate(-1)} className="absolute top-12 left-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center pt-8">
        <h1 className="font-display text-4xl mb-2 text-center">JUNTA-TE AO JOGO</h1>
        <p className="text-muted-foreground text-center mb-10 text-sm">Cria a tua conta mister!</p>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleRegister}>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Teu nome" 
              className="w-full rounded-2xl bg-card border border-border/60 px-5 py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mister@clube.pt" 
              className="w-full rounded-2xl bg-card border border-border/60 px-5 py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
            />
          </div>
          <div className="space-y-1">
             <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</label>
             <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full rounded-2xl bg-card border border-border/60 px-5 py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
            />
          </div>
          
          <Button type="submit" size="lg" disabled={isLoading} className="w-full mt-6 bg-gradient-primary text-primary-foreground font-bold shadow-glow">
            {isLoading ? "A criar..." : "Criar conta"}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-auto pt-6">
        Já tens conta? <Link to="/auth/login" className="text-foreground font-medium hover:text-primary">Entrar</Link>
      </p>
    </div>
  );
};

export default Register;
