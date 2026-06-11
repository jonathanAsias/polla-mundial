import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="CREAR CUENTA"
      subtitle="Únete a la polla y empieza a predecir resultados."
    >
      <RegisterForm />
    </AuthShell>
  );
}
