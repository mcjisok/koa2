const mongoose = require('mongoose')
const GroupSchema = require('../schemas/group')
const Group = mongoose.model('Group', GroupSchema)

module.exports = Group