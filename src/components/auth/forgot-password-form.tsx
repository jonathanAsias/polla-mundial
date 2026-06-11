"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/auth/callback?type=recovery` }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-rojo-tarjeta/30 bg-rojo-tarjeta/10 px-3 py-2 text-sm text-rojo-tarjeta">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-lg border border-verde-cancha/30 bg-verde-cancha/10 px-3 py-2 text-sm text-blanco-linea">
          Te enviamos un enlace para restablecer tu contraseña.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar enlace"}
      </Button>

      <p className="text-center text-sm text-blanco-linea/60">
        <Link href="/auth/login" className="text-dorado-copa hover:underline">
          Volver al inicio de sesión
        </Link>
      </p>
    </form>
  );
}
