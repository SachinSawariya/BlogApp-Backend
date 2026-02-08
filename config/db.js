const mongoose = require("mongoose");
const config = require("./config.js");
const modelCreator = require("../src/services/modelCreator.js");

const connectDB = async () => {
    try {
        const dbName = config.SERVER.DB_NAME;
        console.log("dbName ", config.SERVER.DB_URI)

        // Ensure global clientDBConnections is initialized
        if (!global.clientDBConnections) {
            global.clientDBConnections = new Map();
        }

        const connection = await mongoose.createConnection(`${config.SERVER.DB_URI}/${dbName}`);

        // Create models on the connection and return the connection object
        const clientDBConnection = modelCreator(connection);

        global.clientDBConnections.set(dbName, clientDBConnection);
        global.connections = global.clientDBConnections.get(dbName)


        connection.on("connected", async () => {
            logger.info(`Connected to ${dbName} Database 🙌`);
        });
        connection.on("error", (err) => {
            logger.error(`${dbName} Database - Error:` + err);
        });
        connection.on("disconnected", () => {
            logger.warn(`${dbName} Database - disconnected. Retrying...`);
        });

        return clientDBConnection;
    } catch (error) {
        logger.error("MongoDB Connection Failed", error);
        process.exit(1);
    }
};

module.exports = connectDB;
