import { AuthBranding } from "@/components/auth/auth-branding";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBranding />
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 text-center lg:hidden">
          <h1 className="font-display text-4xl text-dorado-copa">
            POLLA MUNDIALISTA
          </h1>
          <p className="font-display text-xl text-verde-cancha">2026</p>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-display text-3xl tracking-wide text-blanco-linea">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-blanco-linea/60">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
