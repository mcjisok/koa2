const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

var ImageSchema = new mongoose.Schema({

    imageGroupName:{//相册名称
        type:String    
    },
    imageGroupDec:{//相册描述
        type:String
    },
    imageList:[{
        imageName:{//相片名称
            type:String,
            default:''
        },
        path:{//相片保存路径
            type:String,
            default:''
        },
        uid:{//唯一id 用时间戳存储
            type:Number,
            default:-1
        },
        imgDescription:{//相片描述
            type:String,
            default:''
        },
        meta: {//创建时间和更新时间
            createAt: {
                type: Date,
                default: Date.now()
            },
            updateAt: {
                type: Date,
                default: Date.now()
            }
        }
    }],
    meta: {//创建时间和更新时间
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

ImageSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
        // this.imageList.meta.createAt = this.imageList.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
        // this.imageList.meta.updateAt = Date.now();
    }
    next()
})


ImageSchema.statics = {
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

module.exports = ImageSchema