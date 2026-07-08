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
  const { db } = await import('../server/db');
  const { uploadedFiles } = await import('../shared/schema');

  const destFolder = "C:\\Users\\Administrator\\Desktop\\photogee";
  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
  }

  console.log("Fetching uploaded files from database...");
  const files = await db.select().from(uploadedFiles);
  console.log(`Found ${files.length} files in database.`);

  for (const file of files) {
    // Only export images/PDFs if needed, let's export all
    try {
      const filePath = path.join(destFolder, file.filename);
      const buffer = Buffer.from(file.data, 'base64');
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved file: ${file.filename} -> ${filePath}`);
    } catch (err: any) {
      console.error(`Failed to save ${file.filename}:`, err.message);
    }
  }
  console.log("Export completed!");
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
