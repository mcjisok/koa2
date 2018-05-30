const Push = require('../models/push')

module.exports = {
    // 保存发布的动态
    savePush:async(ctx,next)=>{
        let data = ctx.request.body
        let pushID = data.pushID
        console.log('请求数据源为：')
        console.log(data)
        let now = data.isDrafts
        // 判断是否立刻发布，如果是，就添加一个发布时间
        if(now === false){
            let pushdate = new Date()
            data.pushdateAt = pushdate
            console.log(data)
        }
        if(pushID !== ''){
            console.log('这是要重新修改发布的数据')
            await new Promise((resolve,reject)=>{
                Push.update({_id:pushID},{$set:data},(err,docs)=>{
                    if(err){
                        console.log('修改失败')
                        reject(err)
                    }
                    else{
                        console.log('修改成功')
                        resolve({code:200,msg:'修改成功'})
                    }
                })
            })
            .then(res=>{
                ctx.response.body = res
            })
            .catch(err=>{
                ctx.response.body = {code:404,msg:'修改失败'}              
            })
        }
        else{
            await new Promise((resolve,reject)=>{
                let push = new Push(data)
                push.save((err,push)=>{
                    if(err){
                        console.log(err)
                        reject(err)
                    }
                    else{
                        resolve(push)
                    }
                })
            })
            .then(res=>{
                console.log(res)
                ctx.response.body = { code:200,msg:'发布成功'}
            })
            .catch(err=>{
                ctx.response.body = { code:400, msg:'发布失败'}
            })
        }
        // console.log('长度' + data.length)
        // console.log(data)
        
    },

    // 首页获取所有用户动态消息列表
    getPushList:async(ctx,next)=>{
        let reqParam = ctx.request.body;
        console.log(reqParam)
        let total = await Push.count();
        let page = Number(reqParam.page);
        console.log(page)
        let size =3;
        let hasMore = total - (page - 1) * size > size ? true : false;
        

        // let options = {"limit":size,"skip":(page-1)*size};
        // let options = { limit: size,skip: (page-1)*size};       
        

        await new Promise((resolove,reject) =>{
            Push.find({'isDrafts':false})
            .sort({ _id:-1,pushdateAt:-1})
            .populate({ path: 'userID', select: 'username name userInfoPhoto' })
            .skip((page - 1) * size).limit(size)            
            .exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    console.log(docs);
                    resolove(docs)
                }
            })
        })
        .then(res=>{
            ctx.response.body = { code: 200, hasMore: hasMore, pushList: res, total: total }            
        })
        .catch(err=>{
            ctx.response.body = {code:404}
        })        
    },

    // 获取用户草稿箱中的动态消息列表
    getDraftsList:async(ctx,next)=>{
        let userid =ctx.request.body._id;
        await new Promise((resolove,reject)=>{
            Push.find({userID:userid,isDrafts:true})
            .sort({_id:-1})
            .exec((err,docs)=>{
                if(err){
                    reject()
                }
                else{
                    resolove(docs)
                }
            })
        })
        .then(res=>{
            ctx.response.body = res
        })
        .catch(err=>{
            console.log(err)
        })
    },

    // 删除单条动态消息
    delPush:async(ctx,next)=>{
        let data = ctx.request.body
        console.log('111111111111111111111111111111')
        console.log(data)
        await new Promise((resolove,reject)=>{
            Push.remove(data,err=>{
                if(err){
                    console.log('删除失败')
                    reject(err)
                }
                else{
                    console.log('删除成功')
                    resolove({code:200,msg:'删除成功'})
                }
            })
        })
        .then(res=>{
            ctx.response.body = res
        })
        .catch(e=>{
            ctx.response.body = e
        })
    }
}