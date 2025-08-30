import { Client } from "pg";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { name, email, department, year, password } = JSON.parse(event.body);

  const client = new Client({
    connectionString: process.env.DATABASE_URL, // set in Netlify env vars
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const result = await client.query(
      "INSERT INTO members (name, email, department, year, password_hash) VALUES ($1,$2,$3,$4,$5) RETURNING id",
      [name, email, department, year, password] // ⚠️ use bcrypt before storing passwords
    );
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: result.rows[0].id }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Database error" };
  }
}
