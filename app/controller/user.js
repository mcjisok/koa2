const User = require('../models/user')

module.exports = {
    register:async(ctx,next) =>{
        console.log(ctx)
        console.log(ctx.request.body);
        const userdata = ctx.request.body

        await new Promise(function (resolve, reject) {
            User.findOne({ username: userdata.username }, function (err, user) {
                if(err){
                    reject(err);
                }
                else{
                    if(user){
                        resolve(1)
                    }
                    else{
                        let _user = new User(userdata);
                        _user.save(function (err, user) {
                            if (err) {
                                reject(err)
                            }
                            else {
                                resolve(user)
                            }                            
                        })
                    }
                }
            })
        }).then(function(data){
            if(data === 1 ){
                console.log('用户已存在')
                ctx.response.body = { code: 404,msg:'用户已存在'}
            }
            else{
                console.log('用户注册成功')
                ctx.response.body = { code: 200, msg: '注册成功' }                
            }
        })      
    },

    login:async(ctx,next) =>{
        const userdata = ctx.request.body    
        // console.log(userdata)    
        await new Promise((resolve, reject) =>{
            User.findOne({ username: userdata.username},function(err,user){
                if(err){
                    reject(err)
                }
                else{
                    if(!user){
                        // 如果用户不存在，传1
                        resolve(1)
                    }
                    else{
                        user.comparePassword(userdata.userpassword, function (err, isMatch) {
                            if (err) {
                                reject(err)
                            }
                            if (isMatch) {
                                // 如果密码比对成功，传2
                                resolve(user)
                            }
                            else {
                                // 密码比对失败，传3
                                resolve(3)
                            }
                        })
                    }
                }
            })
        }).then(res=>{
            const a = res;
            // console.log(res)
            switch (a) {
                case 1:
                    ctx.response.body = { code:1, msg:'用户不存在'}
                    console.log(1)
                    break;                
                case 3:
                    console.log(3)
                    ctx.response.body = { code: 3, msg: '密码错误' }
                    break;
            }
            if (isNaN(a)){
                a.userpassword = ''
                console.log(a._id)
                ctx.state.loginID = a._id
                ctx.response.body = { code: 2, msg: '登录成功', userID: a._id, username:a.username, name:a.name,userinfo:a}   
            }
        }) .catch(err=>{
            console.log(err)
            // ctx.response.body = {}
            
        })
    },

    saveUserInfo:async(ctx,next) =>{
        let data = ctx.request.body
        console.log(data)
        let _id = data._id
        let userdata = data.user
        await new Promise((resolve,reject)=>{            
            User.update({_id:_id}, { $set: userdata},(err,user)=>{
                if(err){
                    console.log('保存失败')
                    reject(err)
                }
                else{
                    console.log('保存成功')
                    console.log(user)
                    User.findById(_id,(err,userinfo)=>{
                        resolve(userinfo)
                    })
                }
            })
        })       
        .then(res=>{          
            res.userpassword = '你猜猜用户密码是多少'
            ctx.response.body = {code:200,msg:'保存成功',userinfo:res}

        })
        .catch(err=>{
            ctx.response.body = {code:404,msg:'保存失败'}
        })

    },


    // 管理后台api
    getUserList:async(ctx,next)=>{
        let userlist = await User.find({}).exec()
        console.log(userlist)
        ctx.response.body = { code:200, data:userlist}
    }
}