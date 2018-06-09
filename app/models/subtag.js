const mongoose = require('mongoose')
const SubTagSchema = require('../schemas/subtag')
const SubTag = mongoose.model('SubTag', SubTagSchema)

module.exports = SubTag