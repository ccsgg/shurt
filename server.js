import express from "express";
import sqlite3 from "sqlite3";
import { generateShortCode } from "./public/utils.js";

const app = express();
const PORT = 3000;
const db = new sqlite3.Database("urls.db");

db.run(`CREATE TABLE IF NOT EXISTS urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_url TEXT NOT NULL,
  short_url TEXT NOT NULL UNIQUE,
  clicks INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.use(express.static("public"));
app.use(express.json());

app.post("/api/shorten", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  };

  console.log(`Received URL to shorten: ${url}`);

  const shortCode = generateShortCode();
  db.run("INSERT INTO urls (original_url, short_url) VALUES (?, ?)", [url, shortCode], function(err) {
    if (err) {
      return res.status(500).json({ error: "Error occurred while storing the URL" });
    }

    console.log(`Shortened URL: ${req.protocol}://${req.get("host")}:${PORT}/${shortCode}`);
    return res.status(201).json({
      id: this.lastID,
      originalUrl: url,
      shortCode: shortCode,
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`
    });
  });
});

app.get("/api/urls", (req, res) => {
  db.all(`SELECT id, original_url, short_url, clicks, created_at FROM urls ORDER BY id DESC`, [], (error, rows) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          error: "Impossible de récupérer les URLs"
        });
      }
      return res.json(rows);
    }
  );
});

app.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;

  db.get("SELECT * FROM urls WHERE short_url = ?", [shortCode], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Error occurred while retrieving the URL" });
    }

    if (!row) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    db.run("UPDATE urls SET clicks = clicks + 1 WHERE short_url = ?", [shortCode], (err) => {
      if (err) {
        return res.status(500).json({ error: "Error occurred while updating click count" });
      }
    });

    return res.redirect(302, row.original_url);
  });
});

app.delete("/api/urls/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM urls WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: "Error occurred while deleting the URL" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.status(204).end();
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 