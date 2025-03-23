router.get('/search', async (req, res) => {
    const { name, position, status } = req.query;
    let query = "SELECT * FROM candidates WHERE 1=1";
    let params = [];
  
    if (name) {
      query += " AND name LIKE ?";
      params.push(`%${name}%`);
    }
    if (position) {
      query += " AND position = ?";
      params.push(position);
    }
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
  
    try {
      const [results] = await db.execute(query, params);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error searching candidates:", error);
      res.status(500).json({ error: "Error searching candidates." });
    }
  });
  