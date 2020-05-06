const mongoose = require("mongoose/index.js");

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit();
}

const password = process.argv[2];

const url = `mongodb+srv://zenghao:${password}@phonebook-nzgtt.azure.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// List phonebook entries
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}

// Add new note using command line arguments
if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((response) => {
    console.log(`added ${person.name} ${person.number} to phonebook.`);
    mongoose.connection.close();
  });
}
