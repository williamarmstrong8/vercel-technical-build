'use server';

import { getSql } from '@/lib/db';
import { redirect } from 'next/navigation';

// Server Action so the form works without JavaScript (progressive enhancement).
// Hero form redirects to /chat, CTA form stays on the landing page.
export async function saveLead(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const redirectTo = (formData.get('redirectTo') as string) || '/?lead=success';

  // Prevent open redirects to external domains.
  const safeRedirect =
    redirectTo.startsWith('/') && !redirectTo.startsWith('//')
      ? redirectTo
      : '/?lead=success';
  if (!email || !email.includes('@')) return;

  const sql = getSql();
  // Duplicate emails are silently ignored so resubmitting doesn't error.
  await sql`
    INSERT INTO leads (email, created_at)
    VALUES (${email}, NOW())
    ON CONFLICT (email) DO NOTHING
  `;

  redirect(safeRedirect);
}
