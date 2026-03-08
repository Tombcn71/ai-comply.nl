"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export type RiskCategory = "minimaal" | "beperkt" | "hoog" | "onaanvaardbaar";
export type Department = "Marketing" | "HR" | "IT" | "Sales";

export interface Tool {
  id: string;
  name: string;
  department: Department;
  risk: RiskCategory;
  dateAdded: Date;
  purpose: string;
  isCompliant: boolean;
}

export async function getTools(): Promise<Tool[]> {
  const tools = await prisma.aiTool.findMany({
    orderBy: { dateAdded: "desc" },
  });
  return tools.map((tool) => ({
    ...tool,
    risk: tool.risk as RiskCategory,
    department: tool.department as Department,
  }));
}

export async function createTool(
  data: Omit<Tool, "id" | "dateAdded">
): Promise<Tool> {
  const tool = await prisma.aiTool.create({
    data: {
      name: data.name,
      department: data.department,
      risk: data.risk,
      purpose: data.purpose,
      isCompliant: data.isCompliant,
    },
  });
  revalidatePath("/dashboard/register");
  revalidatePath("/dashboard");
  return {
    ...tool,
    risk: tool.risk as RiskCategory,
    department: tool.department as Department,
  };
}

export async function updateTool(
  id: string,
  data: Partial<Omit<Tool, "id" | "dateAdded">>
): Promise<Tool> {
  const tool = await prisma.aiTool.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.department && { department: data.department }),
      ...(data.risk && { risk: data.risk }),
      ...(data.purpose && { purpose: data.purpose }),
      ...(data.isCompliant !== undefined && { isCompliant: data.isCompliant }),
    },
  });
  revalidatePath("/dashboard/register");
  revalidatePath("/dashboard");
  return {
    ...tool,
    risk: tool.risk as RiskCategory,
    department: tool.department as Department,
  };
}

export async function deleteTool(id: string): Promise<void> {
  await prisma.aiTool.delete({
    where: { id },
  });
  revalidatePath("/dashboard/register");
  revalidatePath("/dashboard");
}

export async function toggleCompliance(id: string): Promise<Tool> {
  const tool = await prisma.aiTool.findUnique({
    where: { id },
  });
  if (!tool) throw new Error("Tool not found");

  const updated = await prisma.aiTool.update({
    where: { id },
    data: { isCompliant: !tool.isCompliant },
  });
  revalidatePath("/dashboard/register");
  revalidatePath("/dashboard");
  return {
    ...updated,
    risk: updated.risk as RiskCategory,
    department: updated.department as Department,
  };
}
