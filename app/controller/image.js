const Image = require('../models/image')
const path =require('path')
const fs = require('fs')


module.exports = {
    savePhotoGroup:async(ctx,next)=>{
        let data = ctx.request.body;
        let newGroup = new Image(data)
        let save = await newGroup.save()
        if(save){
            console.log(save)
            ctx.response.body = {code:200,data:save,msg:'保存成功'}
        }
    },

    getPhotoGroupList:async(ctx,next)=>{
        let res = await Image.fetch()
        console.log(res)
        ctx.response.body = {code:200,data:res,msg:'获取相册列表成功'}
    }
}