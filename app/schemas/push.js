const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

var PushSchema = new mongoose.Schema({
    pushTitle:{
        type:String,
        default:''
    },
    pushContent:{
        type:String,
        default:''
    },
    pushImageList:{
        type: Array,
        default:[]
    },
    isDrafts:{
        type:Boolean,
        default:false
    },
    userID:{
        type: ObjectId, 
        ref: 'User'
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

PushSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next()
})


PushSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
}

module.exports = PushSchema
