const Tag = require('../models/tag')
const SubTag = require('../models/subtag')


module.exports = {
    saveTag:async(ctx,next)=>{

        let body = ctx.request.body
        if(body.firstTagID){
            let data = {
                pTag:body.firstTagID,
                tagName:body.subTagName
            }
            let newdata = new SubTag(data)
            let save = await newdata.save()

            let firstTag = await Tag.findOne({_id:body.firstTagID}).exec()
            console.log(firstTag)
            firstTag.subTagList.unshift(save._id)
            let firstTagUpdate = await firstTag.save()
            // console.log(res)

            let success = Promise.all([save,firstTagUpdate])
            .then(res=>{
                ctx.response.body = {code:200,data:save,message:"保存成功"}                
            })
            .catch(e=>{
                ctx.response.body = {code:400,data:null,message:e}                
            })
            
        }
        else{
            let name = ctx.request.body.name
            let data = {
                tagName:name
            }
            console.log(ctx.request.body)
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
        }
        
    },

    getTagList:async(ctx,next)=>{
        let tagList = await Tag.find()
                        .populate({path:'subTagList'})
                        .exec()
        // console.log('rere')
        console.log(tagList)
        if(tagList){
            ctx.response.body={code:200,data:tagList,message:"获取列表成功"}
        }
        else{
            ctx.response.body = {code:400,data:null,message:"获取列表失败"}
        }
    },

    // 分别获取一级标签和二级标签
    getAllTagList:async(ctx,next)=>{
        let tagList = await Tag.find()
                        .select('tagName')
                        .exec()
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