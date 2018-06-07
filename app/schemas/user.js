const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')
const SALT_WORK_FACTOR = 10;
const ObjectId = Schema.Types.ObjectId

// var Schema = mongoose.Schema;
// var ObjectId = Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
    username: {
        unique: true,
        type: String
    },
    name: {
        // unique: true,
        type: String,
        default:''
    },    
    userpassword: String,
    usermobile:{
        type:Number,
        default:''
    }, 
    useremail:{
        type:String,
        default:''
    },
    userInfoPhoto:{
        type:String,
        default:''
    },
    userAddress:{
        type:Array,
        default:[]
    },
    pushList:{
        type: ObjectId,
        ref:'Push'               
    },
    logincount:{
        type:Number,
        default:0
    },
    groupList:[{
        type:ObjectId,
        ref:'Group'
    }],
    role: {
        type: Number,
        default: 51
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

UserSchema.pre('save', function (next) {
    const user = this
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err)
        }
        bcrypt.hash(user.userpassword, salt, null, function (err, hash) {
            if (err) {
                next(err)
            }
            user.userpassword = hash
            next()
        })
    })
});

UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.userpassword, function (err, isMatch) {
            if (err) return cb(err)

            cb(null, isMatch)
        })
    }
};


UserSchema.statics = {
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
};

module.exports = UserSchema