const schemas = require("../models");

const modelCreator = (connection) => {
  schemas.forEach(({ model, schema, collection }) => {
    try {
      connection.model(model, schema, collection);
    } catch (error) {
      console.error("ERROR in modelCreator", error);
    }
  });

  return connection;
};

module.exports = modelCreator;
