'use server';

import { getAllEmployees, getAllTools } from '@/lib/db';

export interface DossierData {
  tools: Array<{
    name: string;
    department: string;
    risk: string;
    is_compliant: boolean;
    date_added: Date;
  }>;
  employees: Array<{
    name: string;
    department: string;
    status: string;
    certified_date?: Date;
  }>;
  timestamp: string;
  totals: {
    totalTools: number;
    compliantTools: number;
    totalEmployees: number;
    certifiedEmployees: number;
  };
}

/**
 * Get all data needed for dossier generation
 */
export async function getDossierDataAction(): Promise<DossierData> {
  try {
    console.log('[Dossier Action] Fetching data for dossier...');
    
    const [tools, employees] = await Promise.all([
      getAllTools(),
      getAllEmployees(),
    ]);

    const totalTools = tools.length;
    const compliantTools = tools.filter((t) => t.is_compliant).length;
    const totalEmployees = employees.length;
    const certifiedEmployees = employees.filter((e) => e.status === 'certified').length;

    const timestamp = new Date().toLocaleString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    console.log('[Dossier Action] Data fetched successfully', {
      totalTools,
      compliantTools,
      totalEmployees,
      certifiedEmployees,
    });

    return {
      tools,
      employees,
      timestamp,
      totals: {
        totalTools,
        compliantTools,
        totalEmployees,
        certifiedEmployees,
      },
    };
  } catch (error) {
    console.error('[Dossier Action] Error fetching dossier data:', error);
    throw new Error('Failed to fetch dossier data');
  }
}
