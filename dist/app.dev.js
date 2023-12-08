"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require("express");

var cors = require("cors");

var _require = require("./db"),
    initDB = _require.initDB;

var User = require("./models/User");

var SERVER_PORT = 3000;
var app = express();
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
initDB();
app.post("/users", function _callee(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.create({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            surname: req.body.surname
          }));

        case 3:
          user = _context.sent;
          res.json(user);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Получение всех пользователей

app.get("/users", function _callee2(req, res) {
  var userList;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findAll());

        case 3:
          userList = _context2.sent;
          res.json({
            userList: userList
          });
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Получение пользователя по ID

app.get("/users/:id", function _callee3(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findByPk(req.params.id));

        case 3:
          user = _context3.sent;

          if (user) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "User not found with ID ".concat(req.params.id)
          }));

        case 6:
          res.status(200).json(user);
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // Обновление пользователя по ID

app.put("/users/:id", function _callee4(req, res) {
  var userId, _req$body, name, phone, email, surname, existingUser;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          userId = req.params.id;
          _req$body = req.body, name = _req$body.name, phone = _req$body.phone, email = _req$body.email, surname = _req$body.surname;
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(User.findByPk(userId));

        case 5:
          existingUser = _context4.sent;

          if (existingUser) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "User not found with ID ".concat(userId)
          }));

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap(existingUser.update({
            name: name,
            phone: phone,
            email: email,
            surname: surname
          }));

        case 10:
          res.json({
            message: "User updated successfully",
            userId: userId
          });
          _context4.next = 16;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](2);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 13]]);
});
app.patch("/users/:id", function _callee5(req, res) {
  var userId, _req$body2, field, value, user;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          userId = req.params.id;
          _req$body2 = req.body, field = _req$body2.field, value = _req$body2.value;

          if (!(!field || value === undefined)) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: "Please provide the field and value to update"
          }));

        case 4:
          _context5.prev = 4;
          _context5.next = 7;
          return regeneratorRuntime.awrap(User.findByPk(userId));

        case 7:
          user = _context5.sent;

          if (user) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: "User not found with ID ".concat(userId)
          }));

        case 10:
          _context5.next = 12;
          return regeneratorRuntime.awrap(user.update(_defineProperty({}, field, value)));

        case 12:
          res.json({
            message: "User field '".concat(field, "' updated successfully"),
            userId: userId
          });
          _context5.next = 18;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](4);
          res.status(500).json({
            error: _context5.t0.message
          });

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 15]]);
});
app["delete"]("/users/:id", function _callee6(req, res) {
  var userId, user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          userId = req.params.id;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(User.findByPk(userId));

        case 4:
          user = _context6.sent;

          if (user) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: "User not found with ID ".concat(userId)
          }));

        case 7:
          _context6.next = 9;
          return regeneratorRuntime.awrap(user.destroy());

        case 9:
          res.json({
            message: "User deleted successfully",
            userId: userId
          });
          _context6.next = 15;
          break;

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](1);
          res.status(500).json({
            error: _context6.t0.message
          });

        case 15:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 12]]);
});
app.get("/filter/:type", function _callee7(req, res) {
  var sortOrder, order, userList;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          sortOrder = req.params.type;
          order = "ASC";

          if (sortOrder && sortOrder.toLowerCase() === "desc") {
            order = "DESC";
          }

          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(User.findAll({
            order: [["surname", order]]
          }));

        case 6:
          userList = _context7.sent;
          res.json(userList);
          _context7.next = 13;
          break;

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](3);
          res.status(500).json({
            error: "Error retrieving filtered users from the database"
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 10]]);
});
app.listen(SERVER_PORT, function () {
  console.log("Server is working on port ".concat(SERVER_PORT));
});