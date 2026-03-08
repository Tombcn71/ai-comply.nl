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
  PieChart,
  Pie,
  Legend,
} from "recharts";

interface DepartmentData {
  department: string;
  completed: number;
}

interface TrainingBreakdown {
  name: string;
  value: number;
}

const COLORS = ["#10b981", "#ef4444"];

export function TrainingChart({
  departmentData,
  trainingBreakdown,
}: {
  departmentData: DepartmentData[];
  trainingBreakdown: TrainingBreakdown[];
}) {
  return (
    <div className="grid gap-6 lg:col-span-1">
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
                data={departmentData}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 80, bottom: 0 }}
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
                  {departmentData.map((entry, index) => (
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

      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Trainingstatus
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Medewerkers gecertificeerd vs. niet-gecertificeerd
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trainingBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trainingBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} medewerkers`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
