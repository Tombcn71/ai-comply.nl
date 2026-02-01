"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { department: "Marketing", completed: 95 },
  { department: "Sales", completed: 88 },
  { department: "Product", completed: 92 },
  { department: "Finance", completed: 78 },
  { department: "HR", completed: 100 },
  { department: "IT", completed: 85 },
];

export function TrainingChart() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          AI-Geletterdheid per afdeling
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Percentage medewerkers met afgeronde training
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="department"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Afgerond"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="completed" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.completed >= 90
                        ? "hsl(var(--chart-2))"
                        : entry.completed >= 80
                          ? "hsl(var(--chart-1))"
                          : "hsl(var(--chart-3))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--chart-2))]" />
            <span className="text-muted-foreground">90%+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--chart-1))]" />
            <span className="text-muted-foreground">80-89%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--chart-3))]" />
            <span className="text-muted-foreground">&lt;80%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
