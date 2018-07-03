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
    },

    getPhotoList:async(ctx)=>{
        let data = ctx.request.body
        console.log('前台传来的数据为',data)
        let res = await Image.find(data).exec()
        if(res){
            ctx.response.body = {code:200,res,msg:'获取成功'}
        }
        else{
            ctx.response.body = { code:400,msg:'获取失败'}
        }
    }
}