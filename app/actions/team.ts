'use server';

import { auth } from '@/lib/auth';
import { pool } from '@/lib/db';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { headers } from 'next/headers';

/**
 * Get team members for the organization
 */
export async function getTeamMembersAction(): Promise<Array<{
  id: string;
  email: string;
  role: string;
  created_at: Date;
}>> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    const orgId = (session as any)?.session?.activeOrganizationId;
    if (!orgId) {
      throw new Error('Unauthorized: No organization');
    }

    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users WHERE organization_id = $1 ORDER BY created_at DESC',
      [orgId]
    );

    return result.rows;
  } catch (error) {
    console.error('[Team Action] Error fetching team members:', error);
    throw error;
  }
}

/**
 * Invite a new team member (admin only)
 */
export async function inviteTeamMemberAction(email: string): Promise<{
  success: boolean;
  message: string;
  tempPassword?: string;
}> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    const role = (session?.user as any)?.role;
    if (!orgId) {
      throw new Error('Unauthorized: No organization');
    }

    if (role !== 'admin') {
      throw new Error('Only admins can invite team members');
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('User already exists');
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(12).toString('hex');
    const hashedPassword = await bcryptjs.hash(tempPassword, 12);

    // Create new user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, organization_id, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email`,
      [email.toLowerCase(), hashedPassword, orgId, 'member']
    );

    console.log('[Team Action] Team member invited:', email);

    return {
      success: true,
      message: `User ${email} invited successfully`,
      tempPassword,
    };
  } catch (error) {
    console.error('[Team Action] Error inviting team member:', error);
    throw error;
  }
}

/**
 * Remove a team member (admin only)
 */
export async function removeTeamMemberAction(userId: string): Promise<boolean> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    const role = (session?.user as any)?.role;
    if (!orgId) {
      throw new Error('Unauthorized: No organization');
    }

    if (role !== 'admin') {
      throw new Error('Only admins can remove team members');
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 AND organization_id = $2',
      [userId, orgId]
    );

    if (result.rowCount === 0) {
      throw new Error('Team member not found');
    }

    return true;
  } catch (error) {
    console.error('[Team Action] Error removing team member:', error);
    throw error;
  }
}

/**
 * Update team member role (admin only)
 */
export async function updateTeamMemberRoleAction(
  userId: string,
  role: 'admin' | 'member'
): Promise<{ id: string; email: string; role: string }> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const orgId = (session as any)?.session?.activeOrganizationId;
    const userRole = (session?.user as any)?.role;
    if (!orgId) {
      throw new Error('Unauthorized: No organization');
    }

    if (userRole !== 'admin') {
      throw new Error('Only admins can update roles');
    }

    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 AND organization_id = $3 RETURNING id, email, role',
      [role, userId, orgId]
    );

    if (result.rows.length === 0) {
      throw new Error('Team member not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('[Team Action] Error updating team member role:', error);
    throw error;
  }
}
