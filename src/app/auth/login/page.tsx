import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="INICIAR SESIÓN"
      subtitle="Ingresa para ver tus predicciones y el ranking."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
