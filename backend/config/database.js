const { DataSource } = require("typeorm");
const path = require("path");
const Task = require("../models/Task");

const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.DB_PATH || "./database/tasks.sqlite",
  synchronize: process.env.NODE_ENV === "development", // Only in development
  logging:
    process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  entities: [Task],
  migrations: [path.join(__dirname, "../migrations/*.js")],
  subscribers: [path.join(__dirname, "../subscribers/*.js")],
  cache: {
    duration: 30000, // 30 seconds cache
  },
});

module.exports = { AppDataSource };
