# Polla Mundialista 2026

Plataforma de predicción de resultados del Mundial de Fútbol 2026.

## Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- Repositorio: [github.com/jonathanAsias/polla-mundial](https://github.com/jonathanAsias/polla-mundial)

## Configuración local

```bash
npm install
cp .env.local.example .env.local
# Completa las variables en .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Supabase

**Proyecto:** `https://vnxduzhxzxxlxrwfhneo.supabase.co`

1. Ve a **SQL Editor** en el dashboard de Supabase
2. Ejecuta el contenido completo de [`supabase/schema.sql`](supabase/schema.sql)
3. Ejecuta [`supabase/seed.sql`](supabase/seed.sql) para cargar 49 equipos y 104 partidos
4. Verifica que existan las tablas: `profiles`, `teams`, `matches`, `predictions`

Alternativa por CLI (requiere `service_role` real en `.env.local`):

```bash
npm run seed
```

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública `anon` (JWT) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave `service_role` — **solo servidor/cron** |
| `API_FOOTBALL_KEY` | Para sincronizar resultados (Fase 5) |
| `CRON_SECRET` | Protege `/api/matches/sync` |
| `NEXT_PUBLIC_APP_URL` | URL de la app en producción |

> **Importante:** La `service_role` debe tener `"role":"service_role"` en el JWT. No uses la clave `anon` como service role.

## Publicar en GitHub

```bash
git remote add origin https://github.com/jonathanAsias/polla-mundial.git
git branch -M main
git push -u origin main
```

## Despliegue en Vercel

1. Importa el repo desde GitHub
2. Agrega las variables de entorno de `.env.local`
3. En Supabase → Authentication → URL Configuration, agrega la URL de Vercel como redirect

## Fases implementadas

- ✅ Fase 1 — Setup, tema visual, Supabase client, schema SQL
- ✅ Fase 2 — Autenticación (login, registro, recuperar contraseña)
- ⏳ Fase 3 — Seed de equipos/partidos, `/teams`, `/matches`

Ver [`SPEC_POLLA_MUNDIALISTA.md`](SPEC_POLLA_MUNDIALISTA.md) para el plan completo.
