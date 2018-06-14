const Group = require('../models/group')
const SubTag = require('../models/subtag')

module.exports = {
    saveGroup:async(ctx,next)=>{
        let data = ctx.request.body
        // console.log(data)        
        let checkGroupName = await Group.findOne({groupName:data.groupName}).exec()
        // console.log('分组名是否重复？？？',checkGroupName)
        if(checkGroupName){
            ctx.response.body = {code:404,msg:'分组名已存在'}
        }
        //判断是否有选择标签

        
        else{
            if(data.groupTag.length >0){
                let tagname = data.groupTag.toString()
                // data.tagID = tagname
                // console.log('获取到的二级标签数据',data.groupTag)
                let tagData = await SubTag.findOne({tagName:tagname}).exec()
                // console.log(tagData)
                data.groupTag = tagData._id
            }
            let group = new Group(data)
            console.log('即将保存的data为',group)

            let save = await group.save()
            // console.log(save)

            let result = Promise.all([save])
            .then(res=>{
                ctx.response.body = {code:200,data:res,msg:'提交成功'}
            }).catch(e=>{
                ctx.response.body = {code:400,msg:'提交失败',err:e}
            })    
        }          
    },

    getGroupList:async(ctx,next)=>{
        console.log('开始获取分组数据列表')
        let data = await Group.find({})
                    .populate({path:'groupLeader',select:'username name userInfoPhoto'})
                    .populate({path:'groupTag',select:['tagName'],populate:{path:'pTag',select:['tagName']}})
                    .exec()
        // console.log('数据为',data)
        ctx.response.body = {
            code:200,
            data:data,
            msg:'获取分组列表成功'
        }
    },

    // 修改分组审核状态
    changeGroupState:async(ctx,next)=>{
        console.log('当前分组state为',ctx.request.body)
        let req = ctx.request.body
        let updates = {$set: {state: req.state}}
        let update = await Group.update({_id:req._id},updates)
        // console.log(update)
        if(update.ok === 1){
            ctx.response.body = {code:200,data:update,msg:'修改成功'}            
        }
        else{
            ctx.response.body = { code:400,msg:'修改失败'}
        }
    },

    // 删除分组
    delGroup:async(ctx,next)=>{
        console.log(ctx.request.body)
        let req = ctx.request.body
        let remove = await Group.remove(req)
        // console.log(remove)
        if(remove.ok === 1){
            ctx.response.body = { code:200, data:remove, msg:'删除成功'}
        }
        else{
            ctx.response.body = { code:200, msg:'删除失败'}
        }
    }
}