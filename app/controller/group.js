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
        console.log('数据为',data)
        ctx.response.body = {
            code:200,
            data:data,
            msg:'获取分组列表成功'
        }
    }
}