const mongoose = require('mongoose')
const SubTagSchema = require('../schemas/tag')
const SubTag = mongoose.model('SubTag', SubTagSchema)

module.exports = SubTag