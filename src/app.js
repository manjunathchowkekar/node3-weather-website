//1
// const express = require('express')

// const app = express()

// app.get('', (req, res) => {
// 	res.send('Hello express!')
// })

// app.get('/help', (req, res) => {
// 	res.send('Help page')
// })

// app.get('/about', (req, res) => {
// 	res.send('About page')
// })

// app.get('/weather', (req, res) => {
// 	res.send('Weather page')
// })

// app.listen(3000, () => {
// 	console.log('Server is up to 3000')
// })

// //2
// const express = require('express')

// const app = express()

// app.get('', (req, res) => {
// 	res.send('<h1>Hello express!<h1>')
// })

// app.get('/help', (req, res) => {
// 	res.send([{
// 		name: 'Manjunath',
// 	},
// 	{
// 		name: 'Dhananjay'
// 	}])
// })

// app.get('/about', (req, res) => {
// 	res.send('<h1>About page</h1>')
// })

// app.get('/weather', (req, res) => {
// 	res.send({
// 		forecast: 'raining',
// 		location: 'Ganganadu',
// 	})
// })

// app.listen(3000, () => {
// 	console.log('Server is up to 3000')
// })

//3
// console.log(__dirname)
// console.log(__filename)
// console.log(path.join(__dirname, '../public'))

// const path = require('path')
// const express = require('express')

// const app = express()

// const publicDirectoryPath = path.join(__dirname, '../public')

// console.log(publicDirectoryPath)
// app.use(express.static(publicDirectoryPath))
// app.get('', (req, res) => {
// 	res.send('<h1>Hello express!<h1>')
// })

// app.get('/weather', (req, res) => {
// 	res.send({
// 		forecast: 'raining',
// 		location: 'Ganganadu',
// 	})
// })

// app.listen(3000, () => {
// 	console.log('Server is up to 3000')
// })

//template engine handle bars

const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')


const express = require('express')
const { error } = require('console')

const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
console.log(publicDirectoryPath)

const viewsDirectory = path.join(__dirname, '../templates/views')
console.log(viewsDirectory)

const partialsPath = path.join(__dirname, '../templates/partials')
console.log(partialsPath)


//set up handlebars engine and view location
app.set('view engine', 'hbs')
app.set('views', viewsDirectory)

//register partials in Handlebars
hbs.registerPartials(partialsPath)

//setup static directory to serve  
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather',
		name: 'Manjunath',
		page: 'home page',
	})
})

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name: 'Manjunath',
		page: 'about page',
	})
})

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'help',
		message: 'This is some helful text',
		name: 'Manjunath',
		page: 'help page',
	})
})

app.get('/weather', (req, res) => {
	if (!req.query.address) {
		res.send({
			error: 'you must provide address term'
		})
	}
	res.send({
		forecast: 'raining',
		location: 'Ganganadu',
		address: req.query.address,
	})
})

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'you must provide a search term'
		})
	}

	geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
		if (error) {
			return res.send({ error })
		}
		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send(error)
			}
			res.send({
				forecast: forecastData,
				location,
				address: req.query.address
			})
		})
	})
	// console.log(req.query.search)
	// res.send({
	// 	products: []
	// })
})

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Manjunath',
		errorMessage: 'Help article not found',
		page: 'error page',
	})
})

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		errorMessage: 'Page not found!',
		name: 'Manjunath',
		page: 'error page',
	})
})

app.listen(3000, () => {
	console.log('Server is up to 3000')
})

