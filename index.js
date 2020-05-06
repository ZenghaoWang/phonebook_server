const express = require("express/index.js");
const morgan = require("morgan/index.js");
const cors = require("cors/lib/index.js");

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

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

// Info page
app.get("/info", (request, response) => {
  date = String(new Date());

  response.send(
    `<p>Phonebook has ${persons.length} entries.</p>
      <p>${date}</p>`
  );
});

// GET all entries
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// Get single entry
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 1000);
};

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

// Add new entry
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.json(person);
});

// Run server on port 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
