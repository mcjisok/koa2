const User = require('../models/user')

const jwt = require('jsonwebtoken')
const jwtKoa = require('koa-jwt')
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密
const secret = 'jwt demo'
const request = require('request');

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
        console.log('用户请求为：',ctx.request)  
        console.log('请求头部为：',ctx.header.authorization)
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
                                User.update({_id:user.id},{$inc:{logincount:1}},function(err){
                                    if(err){
                                        reject(err)
                                    }
                                    else{
                                        resolve(user)
                                    }
                                })
                                
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

                let userToken = {
                    userID: a._id,
                    username:a.username,
                    name:a.name,
                }
                const token = jwt.sign(userToken, 'test', {expiresIn: '1h'})
                
                console.log('请求到的用户信息为？？？',res)
                ctx.response.body = { code: 2, msg: '登录成功', userID: a._id, username:a.username, name:a.name,userinfo:a,token:token}   
                
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
    },


    // 删除用户
    delUser:async(ctx,next)=>{
        let userdata = ctx.request.body
        // console.log(userdata)
        let deluser = await User.remove(userdata)
        // console.log(deluser)
        if(deluser.ok === 1 ){
            ctx.response.body = {code:200,msg:'删除成功'}
        }
        else{
            ctx.response.body = {code:400,msg:'删除失败'}
        }
    },

    wechatUser:async(ctx,next)=>{
        let req = ctx.request.body;
        let code = ctx.request.body.code;
        let appid = 'wx4315f305bf13ec29';
        let secret = '75107b466b0571b65e2b646c2a36cffb';
        let opts = {
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
            method:'GET'
        }
        console.log('js_code：',code)
        let r = await new Promise((resolve, reject) => {
            request(opts, (e, r, d) => {
            if (e) {
                return reject(e);
            }
            if (r.statusCode != 200) {
                return reject(`back statusCode：${r.statusCode}`);
            }
            return resolve(d);
            });
        })
        r = JSON.parse(r);
        console.log('session和openid为：',r)

        // // 生成3rdsessionID
        // let data = {
        //     userID: a._id,
        //     username:a.username,
        //     name:a.name,
        // }
        // const sessionID = jwt.sign(userToken, 'test', {expiresIn: '1h'})



        let userdata = await User.find({openID:r.openid}).exec()    //判断是否有用户的openid等于该值
        // console.log(userdata)
        console.log('openid数值为？？？？？',r.openid,'req为？？',req)
        if(userdata.length !== 1 ){
            console.log('查询不到该openid')
            let newUser = new User({openID:r.openid,name:req.name})
            let createUser = await newUser.save()
            console.log('用户以保存！！！',createUser)    
            createUser.userpassword = ''
            createUser.openID = ''
            ctx.response.body = {
                code:400,
                msg:'该用户不存在，已生成用户数据并存入数据库中',
                userdata:createUser
                // session:r.session_key
            }
        }
        else{
            userdata[0].userpassword = ''
            userdata[0].openID = ''
            ctx.response.body = {
                code:200,
                msg:'查询成功，用户存在',
                userdata:userdata[0]
                // session:r.session_key
            }
        }
        // else if(userdata.length  > 1){
        //     next()
        // }
    },

    createWechatUser:async(ctx,next)=>{
        let req = ctx.request.body
        console.log('前台传过来的数据为？？？？？？？',req)

        //用openid生成一个新用户存储到数据库
        // let code = ctx.request.body.loginCode;
        // let appid = 'wx4315f305bf13ec29';
        // let secret = '75107b466b0571b65e2b646c2a36cffb';
        // let opts = {
        //     url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
        //     method:'GET'
        // }
        // let r = await new Promise((resolve, reject) => {
        //     request(opts, (e, r, d) => {
        //     if (e) {
        //         return reject(e);
        //     }
        //     if (r.statusCode != 200) {
        //         return reject(`back statusCode：${r.statusCode}`);
        //     }
        //     return resolve(d);
        //     });
        // })
        // r = JSON.parse(r);
        // console.log(r)


        let newUser = new User({openID:req.data,name:req.name})
        let createUser = await newUser.save()
        console.log(createUser)
        // request('https://www.baidu.com', function (error, response, body) {
        //     if (!error && response.statusCode == 200) {
        //         console.log(body) // 打印google首页
        //     }
        // })
        if(createUser){
            ctx.body = {
                status:200,
                code:200,
                msg:'保存wechat用户成功'
            }
        }
    },

    verification:async(ctx,next)=>{
        let Num=""; 
        for(var i=0;i<6;i++) 
        { 
            Num+=Math.floor(Math.random()*10); 
        } 
        console.log(Num)
        ctx.response.body = {
            code:200,
            verificationNum:Num
        }
    }
}