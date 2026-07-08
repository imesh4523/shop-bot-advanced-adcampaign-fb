import * as fs from 'fs';
import * as path from 'path';

// Manual env loader
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      process.env[key] = value;
      console.log(`Loaded env variable: ${key}`);
    }
  }
}

// Enable self-signed cert bypass for DB
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function test() {
  // Hoisting bypass: dynamically import database storage
  const { storage } = await import('../server/storage');
  const { db } = await import('../server/db');
  const { uploadedFiles } = await import('../shared/schema');
  const { eq } = await import('drizzle-orm');

  console.log("Testing saveUploadedFile directly in database...");
  try {
    const filename = "test_file_upload_" + Date.now() + ".txt";
    const mimeType = "text/plain";
    const base64Data = Buffer.from("Hello World from upload test!").toString("base64");
    
    const result = await storage.saveUploadedFile(filename, mimeType, base64Data);
    console.log("Database Save Success! Result ID:", result.id);

    // Clean up test file
    await db.delete(uploadedFiles).where(eq(uploadedFiles.filename, filename));
    console.log("Database Cleanup Success!");
  } catch (err) {
    console.error("Database saveUploadedFile Failed:", err);
  }
}

test().then(() => process.exit(0)).catch(console.error);
