const mongoose = require('mongoose');
const logger = require('../lib/logger')('server');

const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const cluster = process.env.DB_HOST;
const dbname = process.env.DB_NAME;


const connectDB = async () => {
    try {
      const conn = await mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}/${dbname}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
      });
      logger.info(`MongoDB Connected to database ${conn.connection.name} at ${conn.connection.host}`);
    } catch (error) {
      logger.error(error.message);
      process.exit(1);
    }
  }

  module.exports = connectDB;