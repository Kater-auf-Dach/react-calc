'use strict'
const fs = require('fs')
// const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectID

let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/memory')
var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('connected!'))

let Memory = require('./models/memory')

const app = express()
app.set('port', (process.env.PORT || 3000))

app.use(express.static('./public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache')
  next()
})

app.get('/api/memory', (req, res) => {
  Memory.find({}, (err, memoryItem) => {
    if (err) throw err
    res.send(memoryItem)
  })
})

app.get('/api/memory/latest', (req, res) => {
  let count = parseInt(req.query.last) || 3
  Memory.find()
    .sort({$natural: 1})
    .limit(count)
    .exec((err, result) => {
      res.send(result)
    })
})

app.post('/api/memory', (req, res) => {
  let newMemoryItem = Memory({
    date: req.body.date,
    operation: req.body.operation
  })

  newMemoryItem.save(err => {
    if (err) throw err
    res.json({ success: true })
  })
})

app.get('/api/memory/:id', (req, res) => {
  Memory.findById(req.body.id, (err, memoryItem) => {
    if (err) throw err
    res.send(memoryItem)
  })
})

app.post('/api/memory/:id', (req, res) => {
  console.log(req.params.id)
  Memory.remove({_id: ObjectId(req.params.id)}, (err) => {
    if (err) throw err
    res.json({success: true})
  })
})

app.get('*', (req, res) => {
  fs.readFile('./public/index.html', (error, html) => {
    if (error) throw error

    res.setHeader('Content-Type', 'text/html')
    res.end(html)
  })
})

app.listen(app.get('port'), () => console.log(`Server is listening: http://localhost:${app.get('port')}`))
