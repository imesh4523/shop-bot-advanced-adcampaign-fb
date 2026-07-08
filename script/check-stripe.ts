import * as fs from 'fs';
import * as path from 'path';

// Manual env loader
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const parts = line.split('=');
    if (parts.length >= 2) {
      process.env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  }
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function main() {
  const { storage } = await import('../server/storage');
  const s = await storage.getSetting('STRIPE_ENABLED');
  console.log('--- STRIPE_ENABLED STATUS ---');
  console.log(s);
  console.log('-----------------------------');
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
