'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LeadSuccessInner() {
  const params = useSearchParams();
  if (params.get('lead') !== 'success') return null;
  return (
    <p className="text-sm font-medium text-foreground mb-6">
      ✓ You&apos;re on the list — we&apos;ll be in touch shortly.
    </p>
  );
}

export function LeadSuccess() {
  return (
    <Suspense>
      <LeadSuccessInner />
    </Suspense>
  );
}
