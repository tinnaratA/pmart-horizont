const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(express.static('src'))

app.get('/', (req, res) => res.redirect('login.html'))

app.listen(3000, () => console.log('PMart_Horizont app listening on port 3000'))