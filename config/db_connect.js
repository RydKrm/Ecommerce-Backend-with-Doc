const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(
      //eslint-disable-next-line
      process.env.DATABASE_CONNECTION_STRING,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log("databes has been conected form db_connect");
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = db;
