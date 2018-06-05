const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

var TagSchema = new mongoose.Schema({
    tagName:{//标签名称
        type:String,
        default:''
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