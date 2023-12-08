"use strict";

var _require = require("sequelize"),
    DataTypes = _require.DataTypes;

var _require2 = require("../db"),
    sequelizeInstance = _require2.sequelizeInstance;

var User = sequelizeInstance.define("User", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  underscored: true,
  modelName: "user"
});
module.exports = User;