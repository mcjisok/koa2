const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


var GroupSchema = new mongoose.Schema({
    groupName:String,//组名称
    groupLeader:{//创建者
        type:ObjectId,
        ref:'User',
        default:null
    },
    groupUserList:[{//成员列表
        type:Array,
        ref:'User',
        default:[]
    }],
    groupPushList:[{//动态列表
        type:ObjectId,
        ref:'Push',
        default:[]
    }],
    groupDescription:{//组描述
        type:String,
        default:''
    },
    groupImg:{//组封面图片
        type:String,
        default:''
    },
    groupRole:{//组权限
        type:Number,
        default:51
    },
    groupManager:{//管理员
        type:ObjectId,
        ref:'User',
        default:null
    },
    groupMaxNumber:{//组限制人数
        type:Number,
        default:10
    },
    groupTag:[{//组标签 数组
        type:ObjectId,
        ref:'SubTag',
        default:null
    }],
    groupRequest:[{//入组请求
        requestUser:{//申请入组的用户id
            type:ObjectId,
            ref:'User'
        },
        requestTime:{//申请入组的时间
            type:Date,
            default:Date.now()
        },
        response:{//是否通过 1为通过 -1为拒绝  0为待处理
            type:Number,
            default:0
        }
    }],
    state:{//分组发布状态 false为待审核,true为审核通过
        type:Boolean,
        default:false
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

})


GroupSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next()
})


GroupSchema.statics = {
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

module.exports = GroupSchema