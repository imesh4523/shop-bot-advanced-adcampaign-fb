import pg from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://doadmin:password@localhost:5432/defaultdb";

const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  console.log("Testing connection to DigitalOcean PostgreSQL...");
  try {
    const client = await pool.connect();
    console.log("Connected successfully!");
    
    // Check if users table exists
    const res = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    console.log("Users table exists:", res.rows[0].exists);
    
    if (res.rows[0].exists) {
      const userCount = await client.query("SELECT COUNT(*) FROM users;");
      console.log("Current user count:", userCount.rows[0].count);
      
      const allUsers = await client.query("SELECT id, email, first_name, last_name FROM users;");
      console.log("Users in DB:", allUsers.rows);
    }
    
    client.release();
  } catch (error: any) {
    console.error("Connection failed:", error.message || error);
  } finally {
    await pool.end();
  }
}

main();
