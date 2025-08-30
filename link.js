import { neon } from '@netlify/neon';

export default async (req, res) => {
  try {
    const sql = neon();

    // Example: get ID from query params (?id=1)
    const id = req.query.id || 1;

    const [post] = await sql`SELECT * FROM posts WHERE id = ${id}`;

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
