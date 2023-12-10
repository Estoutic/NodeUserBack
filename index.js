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

  if (!isValidString(req.body.name)) {
    return res.status(400).json({ error: "Invalid 'name'. It must be a non-empty string." });
  }

  if (!isValidString(req.body.phone)) {
    return res.status(400).json({ error: "Invalid 'phone'. It must be a non-empty string." });
  }

  if (!isValidString(req.body.email)) {
    return res.status(400).json({ error: "Invalid 'email'. It must be a non-empty string." });
  }

  if (!isValidString(req.body.surname)) {
    return res.status(400).json({ error: "Invalid 'surname'. It must be a non-empty string." });
  }

  next();
};

const validatePatchRequest = (req, res, next) => {

  if (!isValidString(req.body.field)) {
    return res.status(400).json({ error: "Invalid 'field'. It must be a non-empty string." });
  }

  if (!isValidString(req.body.value)) {
    return res.status(400).json({ error: "Invalid 'value'. It must be a non-empty string or number." });
  }

  next();
};

// 1. Создание сущности в базе данных 
app.post("/user", validateUserRequest, async (req, res) => {
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

// 2. Получение списка юзеров с возможностью сортировки (в алфавитном порядке по фамилиям или в обратном)
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

// 3. Получение юзера по ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: `User not found with ID ${req.params.id}`,
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление всех полей сущности по id
app.put("/users/:id", validateUserRequest, async (req, res) => {
  const userId = req.params.id;

  try {
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({
        error: `User not found with ID ${userId}`,
      });
    }

    await existingUser.update(req.body);

    res.json({
      message: "User updated successfully",
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.patch("/users/:id", validatePatchRequest, async (req, res) => {
  const userId = req.params.id;

  try {
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({
        error: `User not found with ID ${userId}`,
      });
    }

    await existingUser.update({ [req.body.field]: req.body.value });

    res.json({
      message: `User field '${req.body.field}' updated successfully`,
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удалние юзера по id
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({
        error: `User not found with ID ${userId}`,
      });
    }

    await existingUser.destroy();
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