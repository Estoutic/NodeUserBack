"use strict";

var _require = require("sequelize"),
    Sequelize = _require.Sequelize;

var sequelizeInstance = new Sequelize({
  dialect: "sqlite",
  storage: "./sqliteData/users.sqlite"
});

var initDB = function initDB() {
  return regeneratorRuntime.async(function initDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(sequelizeInstance.authenticate());

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(sequelizeInstance.sync());

        case 5:
          console.log("Sequelize was initialized");
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log("Sequelize ERROR (initDB)", _context.t0);
          process.exit();

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  sequelizeInstance: sequelizeInstance,
  initDB: initDB
};