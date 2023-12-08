const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");
const User = require("./models/User");

const SERVER_PORT = 3000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

initDB();

app.post("/user", async (req, res) => {
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

app.get("/users", async (req, res) => {
  try {
    const userList = await User.findAll();
    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

app.put("/users/:id", async (req, res) => {
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

app.patch("/users/:id", async (req, res) => {
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

app.get("/filter/:type", async (req, res) => {
  const sortOrder = req.params.type;
  let order = "ASC";

  if (sortOrder && sortOrder.toLowerCase() === "desc") {
    order = "DESC";
  }

  try {
    const userList = await User.findAll({
      order: [["surname", order]],
    });
    res.json(userList);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving filtered users from the database",
    });
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is working on port ${SERVER_PORT}`);
});
