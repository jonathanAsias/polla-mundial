"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/ranking/user-avatar";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(
    profile.display_name ?? profile.username
  );
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          avatar_url: avatarUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Error al guardar");
        return;
      }

      toast.success("Perfil actualizado");
      router.refresh();
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4">
        <UserAvatar
          username={profile.username}
          avatarUrl={avatarUrl || null}
          size="lg"
        />
        <div>
          <p className="font-display text-xl text-dorado-copa">
            @{profile.username}
          </p>
          <p className="font-mono text-sm text-blanco-linea/50">
            {profile.total_points} pts totales
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_name">Nombre para mostrar</Label>
        <Input
          id="display_name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Tu nombre"
          maxLength={50}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar_url">URL del avatar (opcional)</Label>
        <Input
          id="avatar_url"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
