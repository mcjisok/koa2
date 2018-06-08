const Tag = require('../models/tag')

module.exports = {
    saveTag:async(ctx,next)=>{
        let name = ctx.request.body.name
        let data = {
            tagName:name
        }
        console.log(data)
        let newTag = new Tag(data)
        console.log(newTag)
        let save = await newTag.save()
        console.log(save)
        if(save){
            ctx.response.body = {code:200,data:save,message:"保存成功"}
        }
        else{
            ctx.response.body = {code:400,data:null,message:"保存失败"}
        }
    },

    getTagList:async(ctx,next)=>{
        let tagList = await Tag.fetch()
        // console.log('rere')
        console.log(tagList)
        if(tagList){
            ctx.response.body={code:200,data:tagList,message:"获取列表成功"}
        }
        else{
            ctx.response.body = {code:400,data:null,message:"获取列表失败"}
        }
    }
}