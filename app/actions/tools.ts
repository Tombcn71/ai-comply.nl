'use server';

import {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
  toggleCompliance,
  type AiTool,
} from '@/lib/db';

/**
 * Server action to get all tools
 */
export async function fetchAllTools(): Promise<AiTool[]> {
  try {
    return await getAllTools();
  } catch (error) {
    console.error('[Server Action] Error fetching tools:', error);
    throw error;
  }
}

/**
 * Server action to get a single tool
 */
export async function fetchTool(id: string): Promise<AiTool | null> {
  try {
    return await getToolById(id);
  } catch (error) {
    console.error('[Server Action] Error fetching tool:', error);
    throw error;
  }
}

/**
 * Server action to create a new tool
 */
export async function createNewTool(
  name: string,
  department: string,
  risk: string,
  purpose: string
): Promise<AiTool> {
  try {
    // Validate inputs
    if (!name || !department || !risk) {
      throw new Error('Missing required fields');
    }

    return await createTool(name, department, risk, purpose);
  } catch (error) {
    console.error('[Server Action] Error creating tool:', error);
    throw error;
  }
}

/**
 * Server action to update a tool
 */
export async function updateExistingTool(
  id: string,
  name?: string,
  department?: string,
  risk?: string,
  purpose?: string,
  isCompliant?: boolean
): Promise<AiTool | null> {
  try {
    return await updateTool(id, name, department, risk, purpose, isCompliant);
  } catch (error) {
    console.error('[Server Action] Error updating tool:', error);
    throw error;
  }
}

/**
 * Server action to delete a tool
 */
export async function deleteExistingTool(id: string): Promise<boolean> {
  try {
    return await deleteTool(id);
  } catch (error) {
    console.error('[Server Action] Error deleting tool:', error);
    throw error;
  }
}

/**
 * Server action to toggle compliance
 */
export async function toggleToolCompliance(id: string): Promise<AiTool | null> {
  try {
    return await toggleCompliance(id);
  } catch (error) {
    console.error('[Server Action] Error toggling compliance:', error);
    throw error;
  }
}
