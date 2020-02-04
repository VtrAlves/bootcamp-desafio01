const express = require('express')

const app = express()
let reqs = 0

app.use(express.json())

app.use((req, res, next) => {
	console.log(++reqs)
	next()
})

let projects = []

function verifyIndex(req, res, next) {
	let { idx } = req.params

	let count = projects.filter(i => i.id === idx).length

	if (count === 0) return res.json({ message: `Invalid id` })

	next()
}

app.post('/projects', (req, res) => {
	let { id, title } = req.body

	let index = projects.push({
		id,
		title,
		tasks: [],
	})

	return res.json({
		message: 'Created a new project successfully!',
		added: projects[index - 1],
	})
})

app.get('/projects', (req, res) => {
	return res.json({
		message: 'Searching all users...',
		response: projects,
	})
})

app.put('/projects/:idx', verifyIndex, (req, res) => {
	let { title } = req.body
	let { idx } = req.params

	projects = projects.map(i => {
		i.id === idx ? (i.title = title) : i.title
		return i
	})

	res.json({
		message: `Updating id: ${idx}`,
		new: projects,
	})
})

app.delete('/projects/:idx', verifyIndex, (req, res) => {
	let { idx } = req.params

	let result = projects.filter(i => i.id !== idx)

	projects = result

	return res.json({
		message: `Successfully deleted id: ${idx}`,
		new: projects,
	})
})

app.listen(3333)
