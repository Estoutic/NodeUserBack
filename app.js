const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");

const SERVER_PORT = 3000;

const app = express();
app.use(cors());


const db = new sqlite3.Database("users.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    phone TEXT,
    email TEXT,
    surname TEXT
  )
`);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/user", (req, res) => {
  const { name, phone, email, surname } = req.body;

  if (!name || !phone || !email || !surname) {
    return res.status(400).json({
      error: "Please provide all the required fields: name, phone, email, surname",
    });
  }

  db.run(
    "INSERT INTO users (name, phone, email, surname) VALUES (?, ?, ?, ?)",
    [name, phone, email, surname],
    (err) => {
      if (err) {
        return res.status(500).json({
          error: "Error inserting data into the database",
        });
      }

      res.json({
        message: "User added successfully",
        userId: this.lastID,
      });
    }
  );
});


app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Error retrieving users from the database",
      });
    }
    res.json(rows);
  });
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      return res.status(500).json({
        error: "Error retrieving user from the database",
      });
    }

    if (!row) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(row);
  });
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, phone, email, surname } = req.body;

  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, existingUser) => {
    if (err) {
      return res.status(500).json({
        error: "Error checking user existence in the database",
      });
    }

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    db.run(
      "UPDATE users SET name = ?, phone = ?, email = ?, surname = ? WHERE id = ?",
      [name, phone, email, surname, userId],
      (err) => {
        if (err) {
          return res.status(500).json({
            error: "Error updating user in the database",
          });
        }

        res.json({
          message: "User updated successfully",
          userId: userId,
        });
      }
    );
  });
});


app.patch("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { field, value } = req.body;

  if (!field || value === undefined) {
    return res.status(400).json({
      error: "Please provide the field and value to update",
    });
  }

  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      return res.status(500).json({
        error: "Error checking user existence in the database",
      });
    }

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    db.run(
      `UPDATE users SET ${field} = ? WHERE id = ?`,
      [value, userId],
      (updateErr) => {
        if (updateErr) {
          return res.status(500).json({
            error: "Error updating user field in the database",
          });
        }

        res.json({
          message: `User field '${field}' updated successfully`,
          userId: userId,
        });
      }
    );
  });
});


app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      return res.status(500).json({
        error: "Error checking user existence in the database",
      });
    }

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    db.run("DELETE FROM users WHERE id = ?", [userId], (err) => {
      if (err) {
        return res.status(500).json({
          error: "Error deleting user from the database",
        });
      }

      res.json({
        message: "User deleted successfully",
        userId: userId,
      });
    });
  });
});
app.get("/filter/:type", (req, res) => {
  const  sortOrder  = req.params.type;

  let sql = "SELECT * FROM users";

  sql += " ORDER BY surname";

  if (sortOrder) {
    sql += ` ${sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC"}`;
  }

  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Error retrieving filtered users from the database",
      });
    }

    res.json(rows);
  });
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(SERVER_PORT, () => {
  console.log(`Server is working on port ${SERVER_PORT}`);
});


