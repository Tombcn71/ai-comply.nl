"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
  toggleCompliance,
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeCertification,
  getCertificationStats,
  type AiTool,
  type Employee,
} from "@/lib/db";
import { uploadCertificateToCellar } from "@/lib/s3";

/**
 * Get all AI tools for the user's organization
 */
export async function getToolsAction(): Promise<AiTool[]> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    const orgId = (session as any)?.session?.activeOrganizationId;
    if (!orgId) {
      // if we don't have an organization on the session, just return an
      // empty list rather than triggering an exception. callers already
      // handle an empty array and this keeps the console clean. log the
      // session for debugging so we can see why the field was missing.
      console.warn(
        "[Server Action] getToolsAction: no activeOrganizationId on session",
        session,
      );
      return [];
    }
    return await getAllTools(orgId);
  } catch (error) {
    console.error("[Server Action] Error fetching tools:", error);
    throw error;
  }
}

/**
 * Get single tool by ID
 */
export async function getToolAction(id: string): Promise<AiTool | null> {
  try {
    return await getToolById(id);
  } catch (error) {
    console.error("[Server Action] Error fetching tool:", error);
    throw error;
  }
}

/**
 * Create a new AI tool
 */
export async function createToolAction(data: {
  name: string;
  department: string;
  risk: string;
  purpose: string;
}): Promise<AiTool> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    if (!orgId) {
      throw new Error("Unauthorized: No organization");
    }

    if (!data.name || !data.department || !data.risk) {
      throw new Error("Missing required fields");
    }

    const result = await createTool(orgId, {
      name: data.name,
      department: data.department,
      risk: data.risk,
      purpose: data.purpose,
    });
    revalidatePath("/dashboard/register");
    return result;
  } catch (error) {
    console.error("[Server Action] Error creating tool:", error);
    throw error;
  }
}

/**
 * Update an AI tool
 */
export async function updateToolAction(
  id: string,
  data: Partial<{
    name: string;
    department: string;
    risk: string;
    purpose: string;
    is_compliant: boolean;
  }>,
): Promise<AiTool | null> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    if (!orgId) {
      throw new Error("Unauthorized: No organization");
    }
    const existing = await getToolById(id);
    if (!existing || existing.organization_id !== orgId) {
      throw new Error("Tool not found or access denied");
    }

    const result = await updateTool(
      id,
      data.name,
      data.department,
      data.risk,
      data.purpose,
      data.is_compliant,
    );
    revalidatePath("/dashboard/register");
    return result;
  } catch (error) {
    console.error("[Server Action] Error updating tool:", error);
    throw error;
  }
}

/**
 * Delete an AI tool
 */
export async function deleteToolAction(id: string): Promise<boolean> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    if (!orgId) {
      throw new Error("Unauthorized: No organization");
    }
    const existing = await getToolById(id);
    if (!existing || existing.organization_id !== orgId) {
      throw new Error("Tool not found or access denied");
    }

    const result = await deleteTool(id);
    revalidatePath("/dashboard/register");
    return result;
  } catch (error) {
    console.error("[Server Action] Error deleting tool:", error);
    throw error;
  }
}

/**
 * Toggle tool compliance status
 */
export async function toggleComplianceAction(
  id: string,
): Promise<AiTool | null> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    if (!orgId) {
      throw new Error("Unauthorized: No organization");
    }
    const existing = await getToolById(id);
    if (!existing || existing.organization_id !== orgId) {
      throw new Error("Tool not found or access denied");
    }

    const result = await toggleCompliance(id);
    revalidatePath("/dashboard/register");
    return result;
  } catch (error) {
    console.error("[Server Action] Error toggling compliance:", error);
    throw error;
  }
}

// ===== EMPLOYEES ACTIONS =====

/**
 * Get all employees for the user's organization
 */
export async function getEmployeesAction(): Promise<Employee[]> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    if (!orgId) {
      throw new Error("Unauthorized: No organization");
    }
    return await getAllEmployees(orgId);
  } catch (error) {
    console.error("[Server Action] Error fetching employees:", error);
    throw error;
  }
}

/**
 * Get single employee by ID
 */
export async function getEmployeeAction(id: string): Promise<Employee | null> {
  try {
    return await getEmployeeById(id);
  } catch (error) {
    console.error("[Server Action] Error fetching employee:", error);
    throw error;
  }
}

/**
 * Create a new employee
 */
export async function createEmployeeAction(data: {
  name: string;
  department: string;
  status: string;
}): Promise<Employee> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    if (!orgId) {
      throw new Error("Unauthorized: No organization");
    }

    if (!data.name || !data.department) {
      throw new Error("Missing required fields");
    }

    const result = await createEmployee(orgId, {
      name: data.name,
      department: data.department,
      status: data.status || "pending",
    });
    revalidatePath("/dashboard/training");
    return result;
  } catch (error) {
    console.error("[Server Action] Error creating employee:", error);
    throw error;
  }
}

/**
 * Update employee certification
 */
export async function certifyEmployeeAction(
  id: string,
  certificateUrl: string,
): Promise<Employee | null> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    if (!orgId) {
      throw new Error("Unauthorized: No organization");
    }

    if (!id || !certificateUrl) {
      throw new Error("Missing required fields");
    }

    const existing = await getEmployeeById(id);
    if (!existing || existing.organization_id !== orgId) {
      throw new Error("Employee not found or access denied");
    }

    const result = await updateEmployeeCertification(id, certificateUrl);
    revalidatePath("/dashboard/training");
    return result;
  } catch (error) {
    console.error("[Server Action] Error certifying employee:", error);
    throw error;
  }
}

/**
 * Get certification statistics for the user's organization
 */
export async function getCertificationStatsAction(): Promise<{
  total: number;
  certified: number;
  percentage: number;
}> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    if (!orgId) {
      throw new Error("Unauthorized: No organization");
    }
    return await getCertificationStats(orgId);
  } catch (error) {
    console.error("[Server Action] Error fetching stats:", error);
    throw error;
  }
}

/**
 * Upload certificate to Cellar S3 and update employee
 */
export async function uploadCertificateAction(
  employeeId: string,
  formData: FormData,
): Promise<Employee | null> {
  try {
    console.log(
      "[uploadCertificateAction] Starting upload for employee:",
      employeeId,
    );

    // Verify organization ownership
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    if (!orgId) {
      throw new Error("Unauthorized: No organization");
    }

    const file = formData.get("certificate") as File;

    if (!file) {
      console.error("[uploadCertificateAction] No file found in formData");
      throw new Error("No file provided");
    }

    if (!employeeId) {
      console.error("[uploadCertificateAction] No employee ID provided");
      throw new Error("Employee ID is required");
    }

    console.log("[uploadCertificateAction] File details:", {
      fileName: file.name,
      size: file.size,
      type: file.type,
    });

    // Upload to Cellar S3
    console.log(
      "[uploadCertificateAction] Calling uploadCertificateToCellar...",
    );
    const certificateUrl = await uploadCertificateToCellar(file, employeeId);

    console.log(
      "[uploadCertificateAction] Upload successful, URL:",
      certificateUrl,
    );

    // Update employee in database
    console.log("[uploadCertificateAction] Updating employee in database...");
    const result = await updateEmployeeCertification(
      employeeId,
      certificateUrl,
    );

    console.log("[uploadCertificateAction] Database update successful", {
      employeeId,
      status: result?.status,
      certificateUrl: result?.certificate_url,
    });

    revalidatePath("/dashboard/training");

    console.log(
      "[uploadCertificateAction] COMPLETE - Employee certified successfully",
    );
    return result;
  } catch (error) {
    console.error("[uploadCertificateAction] ERROR", {
      employeeId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
