const express = require("express/index.js");
const morgan = require("morgan/index.js");
const cors = require("cors/lib/index.js");
require("dotenv/lib/main").config();

const Person = require("./models/person.js");

const app = express();
app.use(express.static("build"));
app.use(cors());
app.use(express.json());

// logging
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

morgan.token("data", (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  } else return;
});

// Info page
app.get("/info", (request, response) => {
  date = String(new Date());
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has ${persons.length} ${
        persons.length === 1 ? "entry" : "entries"
      }.</p>
        <p>${date}</p>`
    );
  });
});

// GET all entries
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons.map((person) => person.toJSON()));
  });
});

// Get single entry
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person.toJSON());
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  Person.findByIdAndRemove(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(`Error: ${error.message}`);
    });
});

// Add new entry
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson.toJSON());
  });
});

// Run server on port 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
