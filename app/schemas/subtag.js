const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

var SubTagSchema = new mongoose.Schema({
    tagName:{
        type:String,
        default:''
    },
    pTag:{//父标签的id索引
        type:ObjectId,
        ref:'Tag'
    },
    tagPushList:[{//属于这个标签的动态
        type:ObjectId,
        ref:'Push',
        default:[]
    }],
    tagGroupList:[{//属于这个标签的圈子组
        type:ObjectId,
        ref:'Group',
        default:[]
    }],
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
})


SubTagSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next()
})


SubTagSchema.statics = {
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

module.exports = SubTagSchema