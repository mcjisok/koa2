const mongoose = require('mongoose')
const PushSchema = require('../schemas/push')
const Push = mongoose.model('Push', PushSchema)

module.exports = Push