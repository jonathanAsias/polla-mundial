# 🌍 SPEC: Polla Mundialista — World Cup Prediction App
> Spec Driven Development (SDD) — listo para usar en Cursor

---

## 0. INSTRUCCIÓN MAESTRA PARA EL AGENTE

Eres un desarrollador senior full-stack. Tu trabajo es implementar esta aplicación **paso a paso**, siguiendo estrictamente esta especificación. Antes de escribir cualquier línea de código, lee el documento completo. Si algo es ambiguo, pregunta antes de asumir. Implementa en el orden definido en la sección de fases. Confirma cada fase antes de continuar con la siguiente.

---

## 1. VISIÓN DEL PRODUCTO

**Nombre:** Polla Mundialista 2026  
**Propósito:** Plataforma de predicción de resultados del Mundial de Fútbol 2026. Los usuarios se registran, predicen resultados de partidos antes de que inicien, ganan puntos por aciertos y compiten en un ranking global.  
**Audiencia:** Fanáticos del fútbol que quieran competir con amigos o en torneos grupales.

---

## 2. STACK TECNOLÓGICO

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilos | Tailwind CSS + shadcn/ui |
| Backend | Next.js API Routes (o Supabase Edge Functions) |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth (email/password) |
| Resultados en vivo | API-Football (https://www.api-football.com) o football-data.org |
| Despliegue | Vercel |
| Scheduling | Vercel Cron Jobs (para actualizar resultados automáticamente) |

---

## 3. DISEÑO VISUAL

### Paleta de colores
```
--verde-cancha:    #1A6B2F   (fondo primario oscuro, césped)
--dorado-copa:     #D4AF37   (acentos, títulos, iconos de trofeo)
--blanco-línea:    #F5F5F0   (texto principal sobre fondos oscuros)
--rojo-tarjeta:    #C0392B   (errores, alertas, botones destructivos)
--azul-cielo:      #1565C0   (links, estado activo secundario)
--gris-estadio:    #2D2D2D   (fondos de cards, superficies elevadas)
--negro-noche:     #111111   (fondo base de la app)
```

### Tipografía
- **Display:** `Bebas Neue` — para titulares, marcadores, nombres de equipos
- **Cuerpo:** `Inter` — para texto, formularios, descripciones
- **Datos:** `JetBrains Mono` — para puntajes, contadores, timestamps

### Elemento Firma (Signature)
Un marcador de partido tipo **scoreboard de estadio**: fondo oscuro con dígitos en Bebas Neue dorado, con una animación de flip cuando el resultado cambia. Este componente `<MatchCard />` es el centro visual de la app.

### Atmosfera visual
- Fondo base con textura sutil de césped (SVG pattern de líneas diagonales verdes muy tenues)
- Cards elevadas con `border: 1px solid rgba(212, 175, 55, 0.2)` (borde dorado sutil)
- Iconos de banderas reales (emoji o librería `flag-icons`)
- Confetti animado cuando el usuario gana puntos

---

## 4. ESTRUCTURA DE BASE DE DATOS

### Tabla: `users` (manejada por Supabase Auth)
```sql
-- Extendida con perfil público
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id),
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  avatar_url    TEXT,
  total_points  INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: `teams`
```sql
CREATE TABLE public.teams (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,          -- "México"
  code          TEXT NOT NULL,          -- "MEX"
  flag_emoji    TEXT,                   -- "🇲🇽"
  group_name    TEXT,                   -- "Grupo A"
  external_id   INT                     -- ID en API-Football
);
```

### Tabla: `matches`
```sql
CREATE TABLE public.matches (
  id              SERIAL PRIMARY KEY,
  home_team_id    INT REFERENCES teams(id),
  away_team_id    INT REFERENCES teams(id),
  phase           TEXT NOT NULL,        -- 'group', 'r32', 'r16', 'qf', 'sf', 'final'
  scheduled_at    TIMESTAMPTZ NOT NULL, -- Fecha y hora oficial del partido
  home_score      INT,                  -- NULL hasta que termine
  away_score      INT,                  -- NULL hasta que termine
  status          TEXT DEFAULT 'upcoming', -- 'upcoming', 'live', 'finished'
  external_id     INT,                  -- ID en API-Football
  venue           TEXT,
  city            TEXT
);
```

### Tabla: `predictions`
```sql
CREATE TABLE public.predictions (
  id              SERIAL PRIMARY KEY,
  user_id         UUID REFERENCES profiles(id),
  match_id        INT REFERENCES matches(id),
  predicted_home  INT NOT NULL,
  predicted_away  INT NOT NULL,
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  points_earned   INT DEFAULT 0,        -- 0, 1 o 2
  UNIQUE(user_id, match_id)
);
```

### Reglas de negocio en base de datos (RLS)
```sql
-- Un usuario solo puede ver y editar sus propias predicciones
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own predictions" ON predictions
  USING (auth.uid() = user_id);

-- El resultado del partido solo lo actualiza el sistema (service role)
-- Los usuarios NO pueden modificar matches
```

---

## 5. SISTEMA DE PUNTOS

| Situación | Puntos |
|-----------|--------|
| Acertó el ganador (o el empate) | +1 punto |
| Acertó el resultado exacto (marcador exacto) | +1 punto adicional |
| No acertó nada | 0 puntos |
| **Máximo por partido** | **2 puntos** |

**Regla de cierre de predicciones:**  
El sistema debe bloquear nuevas predicciones y ediciones **10 minutos antes** de `matches.scheduled_at`. Validar tanto en frontend (UI deshabilitada con countdown) como en backend (API rechaza con 403 si `now() > scheduled_at - interval '10 minutes'`).

---

## 6. MÓDULOS Y PÁGINAS

### 6.1 Autenticación (`/auth`)
- **Register:** Email + password + username. Validar unicidad de username. Enviar email de confirmación vía Supabase Auth.
- **Login:** Email + password. Redirigir a `/dashboard` si ya hay sesión.
- **Forgot Password:** Flujo estándar de Supabase.
- **UI:** Pantalla dividida: izquierda = branding animado con copa y banderas, derecha = formulario.

### 6.2 Dashboard (`/dashboard`)
- Muestra los **partidos de hoy** (o los próximos 3 si no hay hoy).
- Cada partido muestra:
  - Banderas y nombres de equipos
  - Hora del partido (en la zona horaria local del usuario)
  - Si ya tiene predicción registrada: mostrarla
  - Si está dentro del plazo: botón para registrar/editar predicción
  - Contador regresivo hasta el cierre de predicciones (10 min antes)
  - Si el partido terminó: resultado real + puntos ganados
- Widget lateral con ranking top 10.

### 6.3 Partidos por fase (`/matches`)
- Tabs: Fase de Grupos | Octavos | Cuartos | Semis | Final
- Lista de todos los partidos de esa fase con su estado
- Indicador visual: 🟡 Por jugar | 🔴 En vivo | ✅ Terminado
- Al hacer click en un partido: modal con detalle + formulario de predicción

### 6.4 Países participantes (`/teams`)
- Grid con todos los países del Mundial 2026 (48 selecciones)
- Cada tarjeta muestra: bandera (emoji grande), nombre, grupo asignado
- Al hacer click: perfil del equipo con sus partidos de grupo y resultados

### 6.5 Mi perfil (`/profile`)
- Información básica del usuario
- **Mis puntos:** total acumulado, desglose por partido
- **Mis predicciones:** tabla con todos los partidos donde predijo, resultado real, y puntos obtenidos
- Gráfica de progreso de puntos acumulados por fecha
- Opción de cambiar display name y avatar

### 6.6 Ranking (`/ranking`)
- Tabla global de todos los usuarios ordenada por puntos
- Mostrar posición, avatar, username, puntos totales, partidos predichos
- Resaltar la fila del usuario logueado
- Paginación o scroll infinito (top 100)

---

## 7. COMPONENTES CLAVE

### `<MatchCard />` — Componente Firma
```typescript
// Props
interface MatchCardProps {
  match: Match;
  prediction?: Prediction;
  onPredict: (homeScore: number, awayScore: number) => void;
  isLocked: boolean; // true si faltan < 10 min
}
```
- Fondo oscuro `#1a1a1a`, borde dorado sutil
- Nombres de equipos en Bebas Neue
- Marcador central con dígitos tipo scoreboard (animación flip si cambia)
- Barra de tiempo o countdown según estado
- Si `isLocked`: inputs de predicción deshabilitados con candado 🔒

### `<CountdownTimer />`
- Props: `deadline: Date`
- Muestra `HH:MM:SS` restantes en rojo si < 30 min
- Desaparece y muestra "Predicciones cerradas" cuando llega a 0

### `<PredictionForm />`
- Dos inputs numéricos (0–20) para home y away score
- Botón "Guardar predicción" (deshabilitado si `isLocked`)
- Feedback visual inmediato (toast de éxito/error)

### `<RankingTable />`
- Columnas: Pos | Avatar | Usuario | Pts | Partidos predichos
- Fila del usuario actual resaltada en dorado tenue

---

## 8. API ROUTES

### `POST /api/predictions`
- Auth requerida
- Valida que `now() < match.scheduled_at - 10min`
- Inserta o actualiza en tabla `predictions`
- Retorna la predicción guardada

### `GET /api/predictions?matchId=X`
- Retorna la predicción del usuario autenticado para ese partido

### `POST /api/matches/sync` *(solo service role / cron)*
- Llama a API-Football para obtener resultados de partidos finalizados
- Actualiza `matches.home_score`, `matches.away_score`, `matches.status`
- Llama a `calculatePoints()` para todos los usuarios con predicciones en esos partidos

### `POST /api/points/calculate` *(interno)*
```typescript
function calculatePoints(matchId: number): void {
  // Para cada predicción del partido:
  // 1. Determinar ganador real (o empate)
  // 2. Si predicted_winner == real_winner: +1 pt
  // 3. Si predicted_home == real_home AND predicted_away == real_away: +1 pt adicional
  // 4. Actualizar predictions.points_earned
  // 5. Recalcular profiles.total_points (SUM de todas las predicciones del usuario)
}
```

### `GET /api/ranking`
- Retorna top 100 usuarios ordenados por `total_points DESC`

---

## 9. CRON JOB (Vercel)

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/matches/sync",
      "schedule": "*/5 * * * *"
    }
  ]
}
```
- Corre cada 5 minutos
- Solo actualiza partidos con `status = 'live'` o `status = 'upcoming'` y cuya `scheduled_at` ya pasó
- Protegido con header `Authorization: Bearer CRON_SECRET`

---

## 10. DATOS INICIALES (Seed)

El archivo `seed.sql` debe incluir:

1. **48 selecciones** del Mundial 2026 con sus grupos (basado en el sorteo oficial de la FIFA)
2. **Fase de grupos:** 104 partidos (cada grupo juega todos contra todos, 3 partidos × grupos de 3 = formato expandido a 48 equipos)
3. **Fase eliminatoria:** estructura de árbol (32avos → 16avos → cuartos → semis → final)
4. Fechas y horarios oficiales según el calendario FIFA 2026

> **Nota para el agente:** Los datos del Mundial 2026 deben obtenerse de fuentes oficiales (FIFA.com o API-Football). El sorteo ocurrió en diciembre 2025. Busca los grupos y el calendario actualizado antes de hacer el seed.

---

## 11. VARIABLES DE ENTORNO

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
API_FOOTBALL_KEY=           # https://www.api-football.com
CRON_SECRET=                # Secret para proteger el endpoint de cron
NEXT_PUBLIC_APP_URL=        # URL de producción
```

---

## 12. FASES DE IMPLEMENTACIÓN

Implementa en este orden exacto. Confirma cada fase antes de continuar:

### Fase 1 — Setup y estructura base
- [ ] Inicializar proyecto Next.js 14 con TypeScript y Tailwind
- [ ] Instalar shadcn/ui, configurar tema con colores del diseño
- [ ] Configurar fuentes (Bebas Neue, Inter, JetBrains Mono) en `layout.tsx`
- [ ] Conectar Supabase (cliente y servidor)
- [ ] Crear todas las tablas en Supabase con el SQL de la sección 4
- [ ] Configurar RLS policies

### Fase 2 — Autenticación
- [ ] Página `/auth/register` con validación de username único
- [ ] Página `/auth/login`
- [ ] Middleware de Next.js para proteger rutas privadas
- [ ] Crear `profiles` automáticamente al registrarse (trigger en Supabase)

### Fase 3 — Datos del Mundial
- [ ] Script de seed con los 48 equipos y sus grupos
- [ ] Script de seed con los partidos de la fase de grupos
- [ ] Página `/teams` con grid de países
- [ ] Página `/matches` con tabs por fase

### Fase 4 — Dashboard y predicciones
- [ ] Componente `<MatchCard />` con diseño scoreboard
- [ ] Componente `<CountdownTimer />`
- [ ] Componente `<PredictionForm />`
- [ ] `POST /api/predictions` con validación de tiempo
- [ ] Dashboard `/dashboard` con partidos del día

### Fase 5 — Resultados y puntos
- [ ] `POST /api/matches/sync` conectado a API-Football
- [ ] Función `calculatePoints()` 
- [ ] Configurar cron job en `vercel.json`
- [ ] Mostrar puntos por partido en MatchCard

### Fase 6 — Perfil y ranking
- [ ] Página `/profile` con historial de predicciones y puntos
- [ ] `GET /api/ranking` y página `/ranking`
- [ ] Animación de confetti al ganar puntos

### Fase 7 — Pulido y despliegue
- [ ] Responsive design (mobile-first)
- [ ] Loading skeletons para todas las listas
- [ ] Error boundaries y estados vacíos
- [ ] Deploy a Vercel con variables de entorno

---

## 13. CRITERIOS DE ACEPTACIÓN

- ✅ Un usuario puede registrarse con email y hacer login
- ✅ El usuario ve los partidos de hoy al entrar al dashboard
- ✅ Puede registrar su predicción hasta 10 min antes del partido
- ✅ No puede modificar su predicción pasado ese límite (bloqueado en UI y API)
- ✅ El resultado del partido se actualiza automáticamente en máx. 5 min tras terminar
- ✅ Los puntos se calculan y reflejan en el perfil automáticamente
- ✅ El ranking se actualiza en tiempo real
- ✅ La app es usable en móvil
- ✅ El diseño es mundialista: verde, dorado, banderas, scoreboard style

---

## 14. NOTAS PARA EL AGENTE

1. **No improvises datos:** Los equipos, grupos y partidos deben ser los reales del Mundial 2026. Si no los tienes con certeza, busca antes de hardcodearlos.
2. **Valida en backend siempre:** No confíes solo en el frontend para el corte de predicciones.
3. **Maneja zonas horarias:** Guarda todo en UTC en la base de datos. Muestra en la zona local del navegador.
4. **El cron puede fallar:** Los puntos deben poder recalcularse manualmente sin duplicar.
5. **Primero funcional, luego bonito:** Si hay conflicto entre funcionalidad y estética, prioriza que funcione.
6. **Un commit por fase:** Haz un commit al final de cada fase con el mensaje `feat: fase X - [nombre]`.
