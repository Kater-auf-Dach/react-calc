const mongoose = require('mongoose'),
      Schema = mongoose.Schema

let MemoryItem = new Schema({
  date: String,
  operation: String
})

module.exports = mongoose.model('MemoryItem', MemoryItem)
