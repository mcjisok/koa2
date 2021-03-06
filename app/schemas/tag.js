const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

var TagSchema = new mongoose.Schema({
    tagName:{//标签名称
        type:String,
        default:''
    },
    subTagList:[{//子标签列表
        type:ObjectId,
        ref:'SubTag',
        default:[]
    }],
    // tagPushList:[{//属于这个标签的动态
    //     type:ObjectId,
    //     ref:'Push',
    //     default:[]
    // }],
    // tagGroupList:[{//属于这个标签的圈子组
    //     type:ObjectId,
    //     ref:'Group',
    //     default:[]
    // }],
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

TagSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next()
})


TagSchema.statics = {
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

module.exports = TagSchema
