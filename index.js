const express = require("express");
const cors = require("cors");
const initDB = require("./db").initDB;

const User = require("./db/models/User");

const SERVER_PORT = 3000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

initDB();


const isValidString = (value) => typeof value === 'string' && value.trim() !== '';

const validateUserRequest = (req, res, next) => {
  const { name, phone, email, surname } = req.body;

  if (!isValidString(name)) {
    return res.status(400).json({ error: "Invalid 'name'. It must be a non-empty string." });
  }

  if (!isValidString(phone)) {
    return res.status(400).json({ error: "Invalid 'phone'. It must be a non-empty string." });
  }

  if (!isValidString(email)) {
    return res.status(400).json({ error: "Invalid 'email'. It must be a non-empty string." });
  }

  if (!isValidString(surname)) {
    return res.status(400).json({ error: "Invalid 'surname'. It must be a non-empty string." });
  }

  next();
};

const validatePatchRequest = (req, res, next) => {
  const { field, value } = req.body;

  if (!isValidString(field)) {
    return res.status(400).json({ error: "Invalid 'field'. It must be a non-empty string." });
  }

  if (!isValidString(value)) {
    return res.status(400).json({ error: "Invalid 'value'. It must be a non-empty string or number." });
  }

  next();
};

// Create a new user in the database
app.post("/user",validateUserRequest, async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      surname: req.body.surname,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve a list of users from the database with optional sorting.
app.get("/users", async (req, res) => {
  let order = null;

  if (req.query.sort) {
    const sortOrder = req.query.sort.toUpperCase();

    if (sortOrder !== "ASC" && sortOrder !== "DESC") {
      return res.status(400).json({
        error: "Invalid sort order. Please use 'asc' or 'desc'.",
      });
    }

    order = [["surname", sortOrder]];
  }

  try {
    const userList = await User.findAll({
      order: order,
    });
    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users from the database" });
  }
});

// Retrieve a specific user by ID from the database.
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: `User not found with ID ${req.params.id}`,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an existing user by ID in the database.
app.put("/users/:id",validateUserRequest, async (req, res) => {
  const userId = req.params.id;
  console.log(req.params);
  const { name, phone, email, surname } = req.body;

  try {
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({
        error: `User not found with ID ${userId}`,
      });
    }

    await existingUser.update({ name, phone, email, surname });

    res.json({
      message: "User updated successfully",
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

// Partially update an existing user's specific field by ID in the database.
app.patch("/users/:id", validatePatchRequest, async (req, res) => {
  const userId = req.params.id;
  const { field, value } = req.body;

  if (!field || value === undefined) {
    return res.status(400).json({
      error: "Please provide the field and value to update",
    });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: `User not found with ID ${userId}`,
      });
    }

    await user.update({ [field]: value });

    res.json({
      message: `User field '${field}' updated successfully`,
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an existing user by ID from the database.
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: `User not found with ID ${userId}`,
      });
    }

    await user.destroy();
    res.json({
      message: "User deleted successfully",
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is working on port ${SERVER_PORT}`);
});
