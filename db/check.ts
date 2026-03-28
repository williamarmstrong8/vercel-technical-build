import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  try {
    const clubs = await sql`SELECT COUNT(*) as count FROM clubs`;
    const pricing = await sql`SELECT COUNT(*) as count FROM pricing`;
    console.log('✓ clubs rows:  ', clubs[0].count);
    console.log('✓ pricing rows:', pricing[0].count);

    if (Number(clubs[0].count) === 0) {
      console.log('\n⚠ Tables exist but are EMPTY — run db/schema.sql in your Neon SQL editor');
    } else {
      const sample = await sql`SELECT id, name FROM clubs LIMIT 3`;
      console.log('\nSample clubs:');
      sample.forEach((c) => console.log(' -', c.id, c.name));
    }
  } catch (err: any) {
    console.error('✗ Error:', err.message);
    if (err.message.includes('does not exist')) {
      console.log('\n⚠ Tables do not exist — run db/schema.sql in your Neon SQL editor');
    }
  }
}

main();
