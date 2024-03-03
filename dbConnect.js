const mongoose = require('mongoose');

module.exports = async () => {
  const mongoUri = process.env.DATABASE;

  try {
    const connect = await mongoose.connect(mongoUri);
    console.log(`mongoDB connected : ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}