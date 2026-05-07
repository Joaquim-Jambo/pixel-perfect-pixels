import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, UploadCloud, UserCircle, Shield } from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // States User
  const [userName, setUserName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // States Team
  const [hasTeam, setHasTeam] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamEmblemFile, setTeamEmblemFile] = useState<File | null>(null);
  const [teamEmblemPreview, setTeamEmblemPreview] = useState<string | null>(null);

  useEffect(() => {
    // Load initial data
    const saved = localStorage.getItem("user_data");
    if (saved) {
      const data = JSON.parse(saved);
      setUserName(data.name || "");
      if (data.avatarUrl) setAvatarPreview(data.avatarUrl);

      if (data.teams && data.teams.length > 0) {
        setHasTeam(true);
        setTeamId(data.teams[0].id);
        setTeamName(data.teams[0].name || "");
        if (data.teams[0].emblemUrl) setTeamEmblemPreview(data.teams[0].emblemUrl);
      }
    }
  }, []);

  const getHeaders = (isJson = false) => {
    const accessToken = localStorage.getItem("access_token");
    const headers: HeadersInit = {};
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    if (isJson) headers["Content-Type"] = "application/json";
    return headers;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleEmblemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTeamEmblemFile(file);
      setTeamEmblemPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let success = false;

    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const res = await fetch("http://localhost:8080/users/me/avatar", {
          method: "PATCH",
          headers: getHeaders(false),
          credentials: "include",
          body: formData,
        });
        if (!res.ok) throw new Error("Erro ao atualizar o avatar.");
      }

      if (userName.trim()) {
        const res = await fetch("http://localhost:8080/users", {
          method: "PATCH",
          headers: getHeaders(true),
          credentials: "include",
          body: JSON.stringify({ name: userName.trim() }),
        });
        if (!res.ok) throw new Error("Erro ao atualizar o nome do utilizador.");
      }

      success = true;
      toast.success("Perfil de utilizador atualizado!");
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro no utilizador.");
    } finally {
      setIsLoading(false);
      if (success) {
        localStorage.removeItem("user_data");
        navigate(-1);
      }
    }
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasTeam || !teamId) return;
    setIsLoading(true);
    let success = false;

    try {
      if (teamEmblemFile) {
        const formData = new FormData();
        formData.append("file", teamEmblemFile);
        const res = await fetch(`http://localhost:8080/teams/${teamId}/emblem`, {
          method: "PATCH",
          headers: getHeaders(false),
          credentials: "include",
          body: formData,
        });
        if (!res.ok) throw new Error("Erro ao atualizar emblema da equipa.");
      }

      if (teamName.trim()) {
        const res = await fetch(`http://localhost:8080/teams/${teamId}`, {
          method: "PATCH",
          headers: getHeaders(true),
          credentials: "include",
          body: JSON.stringify({ name: teamName.trim() }),
        });
        if (!res.ok) throw new Error("Erro ao atualizar nome da equipa.");
      }

      success = true;
      toast.success("Perfil de equipa atualizado!");
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro na equipa.");
    } finally {
      setIsLoading(false);
      if (success) {
        localStorage.removeItem("user_data");
        navigate(-1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-700">
      <ScreenHeader title="Editar Perfil" back />

      <div className="px-5 pt-6 pb-12 max-w-md mx-auto">
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-border/50 rounded-2xl h-14 p-1">
            <TabsTrigger value="user" className="rounded-xl py-3 font-bold gap-2">
              <UserCircle className="h-4 w-4" />
              Utilizador
            </TabsTrigger>
            {hasTeam && (
              <TabsTrigger value="team" className="rounded-xl py-3 font-bold gap-2">
                <Shield className="h-4 w-4" />
                Equipa
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="user">
            <form onSubmit={handleSaveUser} className="space-y-6">
              <div className="flex flex-col items-center gap-4 bg-card/40 p-6 rounded-3xl border border-border/40">
                <div className="h-32 w-32 rounded-full overflow-hidden bg-card border-4 border-primary/20 flex items-center justify-center relative group shadow-inner">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle className="h-16 w-16 text-muted-foreground opacity-50" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <UploadCloud className="h-8 w-8 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isLoading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">O teu Avatar</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Nome do utilizador
                </label>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ex: Cristiano Ronaldo"
                  className="w-full rounded-2xl bg-card border border-border/60 px-5 py-4 focus:border-primary focus:outline-none focus:ring-1 transition-all font-display text-xl"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-primary shadow-glow transition-all active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Guardar Utilizador"}
              </Button>
            </form>
          </TabsContent>

          {hasTeam && (
            <TabsContent value="team">
              <form onSubmit={handleSaveTeam} className="space-y-6">
                <div className="flex flex-col items-center gap-4 bg-card/40 p-6 rounded-3xl border border-border/40">
                  <div className="h-32 w-32 rounded-2xl overflow-hidden bg-card border-4 border-primary/20 flex items-center justify-center relative shadow-inner">
                    {teamEmblemPreview ? (
                      <img src={teamEmblemPreview} alt="Emblema" className="h-full w-full object-cover" />
                    ) : (
                      <Shield className="h-16 w-16 text-muted-foreground opacity-50" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <UploadCloud className="h-8 w-8 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEmblemChange}
                      disabled={isLoading}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Emblema da Equipa</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Nome da equipa
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Ex: 1500 FC"
                    className="w-full rounded-2xl bg-card border border-border/60 px-5 py-4 focus:border-primary focus:outline-none focus:ring-1 transition-all font-display text-xl"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-gradient-primary shadow-glow transition-all active:scale-[0.98]"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Guardar Equipa"}
                </Button>
              </form>
            </TabsContent>
          )}

        </Tabs>
      </div>
    </div>
  );
}
