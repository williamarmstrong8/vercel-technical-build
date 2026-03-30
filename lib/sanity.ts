import { createClient } from 'next-sanity';

// useCdn: true for faster reads from Sanity's edge cache.
// Next.js caching (use cache + cacheLife) controls revalidation on our side.
export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
});
