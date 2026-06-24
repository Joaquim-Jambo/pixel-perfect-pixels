import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: Record<string, string> = {
        name,
        email,
        passwordHash: password,
        confirmPassword: password,
      };
      if (phone.trim()) payload.phone = phone.trim();

      await api.post("/auth/register", payload);

      const loginRes = await api.post("/auth/login", { email, password });
      const data = loginRes.data;
      const accessToken = data.access_token || data.accessToken;

      const userData = data.user || { id: "temp_id", name, email };

      await login(userData, accessToken);

      if (phone.trim()) {
        setShowOtp(true);
        toast.success("Código de verificação enviado para o teu telefone!");
      } else {
        toast.success("Conta criada com sucesso!");
        navigate("/auth/create-team");
      }
    } catch (error) {
      const apiError = error as AxiosError<{ message?: string }>;
      toast.error(apiError.response?.data?.message || apiError.message || "Erro ao criar conta. Tenta novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setIsVerifyingOtp(true);

    try {
      await api.post("/auth/verify-phone", {
        phone: phone.trim(),
        code: otpCode.trim(),
      });
      toast.success("Telefone verificado com sucesso!");
      navigate("/auth/create-team");
    } catch (error) {
      const apiError = error as AxiosError<{ message?: string }>;
      toast.error(apiError.response?.data?.message || apiError.message || "Código inválido. Tenta novamente.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  if (showOtp) {
    return (
      <div className="flex min-h-screen flex-col bg-background px-6 pt-12 pb-6 relative">
        <button onClick={() => { setShowOtp(false); }} className="absolute top-12 left-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-6 w-6" />
        </button>

        <div className="flex flex-1 flex-col items-center justify-center pt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/15 text-primary mb-6">
            <Smartphone className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl mb-2 text-center font-extrabold tracking-tight">Verifica o teu telefone</h1>
          <p className="text-muted-foreground text-center mb-10 text-sm">
            Enviámos um código para <span className="font-bold text-foreground">{phone}</span>
          </p>

          <form className="w-full max-w-sm space-y-4" onSubmit={handleVerifyOtp}>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Código de verificação</label>
              <input
                type="text"
                required
                maxLength={6}
                inputMode="numeric"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full rounded-2xl bg-card border border-border/60 px-5 py-4 text-center font-display text-2xl tracking-[0.3em] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
              />
            </div>

            <Button type="submit" size="lg" disabled={isVerifyingOtp || otpCode.length < 4} className="w-full mt-6 bg-gradient-primary text-primary-foreground font-bold shadow-glow">
              {isVerifyingOtp ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verificar"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-12 pb-6 relative">
      <button onClick={() => navigate(-1)} className="absolute top-12 left-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center pt-8">
        <h1 className="font-display text-3xl mb-2 text-center font-extrabold tracking-tight">Junta-te ao Jogo</h1>
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
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Telefone <span className="text-muted-foreground/60">(opcional)</span></label>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+258 84 000 0000"
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