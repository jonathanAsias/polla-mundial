import type { PointsChartPoint } from "@/lib/queries/profile";

interface PointsChartProps {
  data: PointsChartPoint[];
}

export function PointsChart({ data }: PointsChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-blanco-linea/50">
        Aún no tienes puntos en partidos finalizados.
      </p>
    );
  }

  const max = Math.max(...data.map((d) => d.cumulative), 1);

  return (
    <div className="space-y-3">
      <div className="flex h-40 items-end gap-2 border-b border-dorado-copa/20 pb-2">
        {data.map((point) => (
          <div
            key={point.date}
            className="group flex flex-1 flex-col items-center justify-end gap-1"
          >
            <span className="font-mono text-xs text-dorado-copa opacity-0 transition group-hover:opacity-100">
              {point.cumulative}
            </span>
            <div
              className="w-full min-w-[8px] rounded-t bg-gradient-to-t from-verde-cancha to-dorado-copa transition hover:opacity-90"
              style={{ height: `${(point.cumulative / max) * 100}%`, minHeight: "4px" }}
              title={`+${point.earned} pts · Total ${point.cumulative}`}
            />
            <span className="text-[10px] text-blanco-linea/40">{point.label}</span>
          </div>
        ))}
      </div>
      <p className="text-center font-mono text-sm text-dorado-copa">
        Total acumulado: {data[data.length - 1]?.cumulative ?? 0} pts
      </p>
    </div>
  );
}
