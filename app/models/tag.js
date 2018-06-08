const mongoose = require('mongoose')
const TagSchema = require('../schemas/tag')
const Tag = mongoose.model('Tag', TagSchema)

module.exports = Tag