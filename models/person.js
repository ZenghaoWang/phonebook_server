const mongoose = require("mongoose/index");

const url = process.env.MONGODB_URI;

console.log(`Connecting to ${url}`);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Connected to MongoDB.");
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${error.message}`);
  });

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
