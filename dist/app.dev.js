"use strict";

var _this = void 0;

var express = require("express");

var sqlite3 = require("sqlite3");

var cors = require("cors");

var SERVER_PORT = 3000;
var app = express();
app.use(cors());
var db = new sqlite3.Database("users.db");
db.run("\n  CREATE TABLE IF NOT EXISTS users (\n    id INTEGER PRIMARY KEY,\n    name TEXT,\n    phone TEXT,\n    email TEXT,\n    surname TEXT\n  )\n");
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.post("/user", function (req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      phone = _req$body.phone,
      email = _req$body.email,
      surname = _req$body.surname;

  if (!name || !phone || !email || !surname) {
    return res.status(400).json({
      error: "Please provide all the required fields: name, phone, email, surname"
    });
  }

  db.run("INSERT INTO users (name, phone, email, surname) VALUES (?, ?, ?, ?)", [name, phone, email, surname], function (err) {
    if (err) {
      return res.status(500).json({
        error: "Error inserting data into the database"
      });
    }

    res.json({
      message: "User added successfully",
      userId: _this.lastID
    });
  });
});
app.get("/users", function (req, res) {
  db.all("SELECT * FROM users", function (err, rows) {
    if (err) {
      return res.status(500).json({
        error: "Error retrieving users from the database"
      });
    }

    res.json(rows);
  });
});
app.get("/users/:id", function (req, res) {
  var userId = req.params.id;
  db.get("SELECT * FROM users WHERE id = ?", [userId], function (err, row) {
    if (err) {
      return res.status(500).json({
        error: "Error retrieving user from the database"
      });
    }

    if (!row) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json(row);
  });
});
app.put("/users/:id", function (req, res) {
  var userId = req.params.id;
  var _req$body2 = req.body,
      name = _req$body2.name,
      phone = _req$body2.phone,
      email = _req$body2.email,
      surname = _req$body2.surname;
  db.get("SELECT * FROM users WHERE id = ?", [userId], function (err, existingUser) {
    if (err) {
      return res.status(500).json({
        error: "Error checking user existence in the database"
      });
    }

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    db.run("UPDATE users SET name = ?, phone = ?, email = ?, surname = ? WHERE id = ?", [name, phone, email, surname, userId], function (err) {
      if (err) {
        return res.status(500).json({
          error: "Error updating user in the database"
        });
      }

      res.json({
        message: "User updated successfully",
        userId: userId
      });
    });
  });
});
app.patch("/users/:id", function (req, res) {
  var userId = req.params.id;
  var _req$body3 = req.body,
      field = _req$body3.field,
      value = _req$body3.value;

  if (!field || value === undefined) {
    return res.status(400).json({
      error: "Please provide the field and value to update"
    });
  }

  db.get("SELECT * FROM users WHERE id = ?", [userId], function (err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error checking user existence in the database"
      });
    }

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    db.run("UPDATE users SET ".concat(field, " = ? WHERE id = ?"), [value, userId], function (updateErr) {
      if (updateErr) {
        return res.status(500).json({
          error: "Error updating user field in the database"
        });
      }

      res.json({
        message: "User field '".concat(field, "' updated successfully"),
        userId: userId
      });
    });
  });
});
app["delete"]("/users/:id", function (req, res) {
  var userId = req.params.id;
  db.get("SELECT * FROM users WHERE id = ?", [userId], function (err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error checking user existence in the database"
      });
    }

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    db.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
      if (err) {
        return res.status(500).json({
          error: "Error deleting user from the database"
        });
      }

      res.json({
        message: "User deleted successfully",
        userId: userId
      });
    });
  });
});
app.get("/filter/:type", function (req, res) {
  var sortOrder = req.params.type;
  var sql = "SELECT * FROM users";
  sql += " ORDER BY surname";

  if (sortOrder) {
    sql += " ".concat(sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC");
  }

  db.all(sql, function (err, rows) {
    if (err) {
      return res.status(500).json({
        error: "Error retrieving filtered users from the database"
      });
    }

    res.json(rows);
  });
});
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.listen(SERVER_PORT, function () {
  console.log("Server is working on port ".concat(SERVER_PORT));
});