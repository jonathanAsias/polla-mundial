import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="RECUPERAR CONTRASEÑA"
      subtitle="Te enviaremos un enlace para restablecerla."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
