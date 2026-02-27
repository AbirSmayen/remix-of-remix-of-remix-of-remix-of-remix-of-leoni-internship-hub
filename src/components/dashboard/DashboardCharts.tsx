import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const gridStroke = "hsl(var(--border))";
const textFill = "hsl(var(--muted-foreground))";

export function MiniLineCard({
  title,
  subtitle,
  data,
  dataKey,
}: {
  title: string;
  subtitle?: string;
  data: Array<Record<string, any>>;
  dataKey: string;
}) {
  return (
    <div className="card-elevated card-elevated-hover p-6">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="6 10" vertical={false} opacity={0.6} />
            <XAxis dataKey="name" tick={{ fill: textFill, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textFill, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ stroke: "hsl(var(--primary) / 0.35)", strokeWidth: 1 }}
              contentStyle={{
                background: "hsl(var(--card) / 0.98)",
                border: `1px solid ${gridStroke}`,
                borderRadius: 14,
                boxShadow: "0 16px 38px -28px rgba(15,23,42,0.55)",
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: "hsl(var(--primary))", stroke: "hsl(var(--card))", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DonutCard({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle?: string;
  data: Array<{ name: string; value: number; color?: string }>;
}) {
  const colors = data.map((d) => d.color).filter(Boolean) as string[];
  const fallback = ["hsl(var(--primary))", "hsl(var(--leoni-purple))", "hsl(var(--warning))", "hsl(var(--success))"];

  return (
    <div className="card-elevated card-elevated-hover p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card) / 0.98)",
                  border: `1px solid ${gridStroke}`,
                  borderRadius: 14,
                  boxShadow: "0 16px 38px -28px rgba(15,23,42,0.55)",
                }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={2}
                stroke="hsl(var(--card))"
                strokeWidth={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i] ?? fallback[i % fallback.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: d.color ?? fallback[i % fallback.length] }}
                />
                <span className="text-muted-foreground truncate">{d.name}</span>
              </div>
              <span className="font-semibold text-foreground tabular-nums">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BarCard({
  title,
  subtitle,
  data,
  dataKey,
}: {
  title: string;
  subtitle?: string;
  data: Array<Record<string, any>>;
  dataKey: string;
}) {
  return (
    <div className="card-elevated card-elevated-hover p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="6 10" vertical={false} opacity={0.6} />
            <XAxis dataKey="name" tick={{ fill: textFill, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textFill, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "hsl(var(--secondary) / 0.6)" }}
              contentStyle={{
                background: "hsl(var(--card) / 0.98)",
                border: `1px solid ${gridStroke}`,
                borderRadius: 14,
                boxShadow: "0 16px 38px -28px rgba(15,23,42,0.55)",
              }}
            />
            <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[10, 10, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

