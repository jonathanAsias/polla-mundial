# Plantillas de correo — Supabase Auth

## Dónde configurarlas

1. Abre [Supabase Dashboard](https://supabase.com/dashboard/project/vnxduzhxzxxlxrwfhneo/auth/templates)
2. Ve a **Authentication → Email Templates**
3. Pega el HTML de cada archivo en la plantilla correspondiente

## Plantillas

| Archivo | Plantilla en Supabase | Asunto sugerido |
|---------|----------------------|-----------------|
| `confirm-signup.html` | **Confirm signup** | `Confirma tu cuenta — Polla Mundialista 2026` |
| `reset-password.html` | **Reset password** | `Restablece tu contraseña — Polla Mundialista` |

## Variables de Supabase (no las borres)

- `{{ .ConfirmationURL }}` — enlace de confirmación o reset
- `{{ .SiteURL }}` — URL del sitio
- `{{ .Email }}` — correo del usuario

## URL Configuration

En **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000` (dev) o tu URL de Vercel (prod)
- **Redirect URLs:** `http://localhost:3000/auth/callback`
