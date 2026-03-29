'use server';

import { getSql } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function saveLead(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const redirectTo = (formData.get('redirectTo') as string) || '/?lead=success';
  const safeRedirect =
    redirectTo.startsWith('/') && !redirectTo.startsWith('//')
      ? redirectTo
      : '/?lead=success';
  if (!email || !email.includes('@')) return;

  const sql = getSql();
  await sql`
    INSERT INTO leads (email, created_at)
    VALUES (${email}, NOW())
    ON CONFLICT (email) DO NOTHING
  `;

  redirect(safeRedirect);
}
