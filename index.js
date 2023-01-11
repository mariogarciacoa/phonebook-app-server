const express = require("express")
const cors = require("cors")
const app = express()
const logger = require("./midlewares/logger")
const unknownEndpoint = require("./midlewares/unknownEndPoints")
const morgan = require("morgan")
const { json } = require("express")

app.use(cors())
app.use(express.json())
app.use(logger)

// app.use(
// 	morgan(
// 		`:method :url :status :res[content-length] - :response-time ms`
// 	)
// )

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
]

app.get("/api", (req, res) => {
	res.send("Welcome to PhoneGuide")
})

app.get("/api/persons", (req, res) => {
	res.json(persons)
})

app.post("/api/persons", (req, res) => {
	const { name, number } = req.body
	const ids = persons.map((p) => p.id)
	const idMax = Math.max(...ids)

	const newPerson = {
		id: idMax + 1,
		name: name,
		number: number,
	}

	persons = [...persons, newPerson]

	res.send(newPerson)
})

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find((persons) => persons.id === id)

	res.json(person)
})

app.put("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)

	const lastContact = persons.find((persons) => persons.id === id)

	if (lastContact) {
		persons = persons.map((persons) => (persons.id === id ? req.body : persons))
		res.json(req.body)
	} else {
		res.status(404).end()
		console.log('no existe');
	}

})

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)

	const lastContact = persons.find((persons) => persons.id === id)

	if (lastContact) {
		persons = persons.filter((persons) => persons.id !== id)

		res.status(204).end()
	} else {
		res.status(404).end()
		console.log("no existe")
	}


})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
	console.log(`Running in PORT ${PORT}`)
})
