const Group = require('../models/group')
const SubTag = require('../models/subtag')
const User = require('../models/user')
const Push = require('../models/push')
// const Group = require('../models/group')

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
            console.log(save)

            // let updatesUserGroup = {$set: {groupList: save._id}}
            let findUser = await User.findById(save.groupLeader)
            findUser.groupList.push(save._id)
            let updateUser = await findUser.save()

            let result = Promise.all([save,updateUser])
            .then(res=>{
                ctx.response.body = {code:200,data:res.save,msg:'提交成功'}
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
    },

    // 前台用户获取所在的所有分组列表
    

    getMyGroup:async(ctx)=>{
        // console.log(ctx)
        let data =ctx.request.body
        console.log(data)
        let match = {state:data.state}
        let result = await User.findOne({_id:data._id})
                    .select('groupList')
                    .populate({path:'groupList',match:match})
                    .exec()
        console.log('获取到的数据为！！！',result)
        if(result){
            ctx.response.body = {code:200,data:result,msg:'获取成功'}
        }
        else{
            ctx.response.body = {code:400,msg:'获取失败'}
        }
    },

    // 获取热门分组列表
    getHotGroup:async(ctx)=>{
        console.log('正在获取')
        let data = await Group.find().exec()
        console.log('获取到的热门分组列表为：',data)
        if(data){
            ctx.response.body = {code:200,data,msg:'获取热门分组成功'}
        }
        else{
            ctx.response.body = {code:400,msg:'获取热门分组失败'}
        }
    },


    // 获取分组详情页
    getGroupDetail:async(ctx,next)=>{
        let data = ctx.request.body
        console.log(data)
        let groupDetail = await Group.findOne(data)
                        // .populate({path:'groupPushList'})
                        .exec()
        // console.log(groupDetail)

        // let groupID = data._id
        // let pushList = await Push
        //                 .find({'groupID':groupID,'isDrafts':false})
        //                 .sort({ _id:-1,pushdateAt:1})
        //                 .populate({ path: 'userID', select: 'username name userInfoPhoto' })
        //                 .populate({ path: 'comment',populate:[{path:'from',select:['name','_id','userInfoPhoto']},{path:'reply.from',select:['name','_id','userInfoPhoto']},{path:'reply.to',select:['name','_id','userInfoPhoto']}]})  
        // console.log(pushList)


        if(groupDetail){
            ctx.response.body = {code:200,groupDetail,msg:'获取成功'}
        }
        else{
            ctx.response.body = {code:400,msg:'获取失败'}            
        }
    },
    //获取指定分组的push列表
    getGroupPushList:async(ctx,next)=>{
        let reqParam = ctx.request.body
        let groupID = reqParam.groupID

        let total = await Push.count({groupID:groupID});
        let page = Number(reqParam.page);
        console.log(page)
        let size =3;
        let hasMore = total - (page - 1) * size > size ? true : false;


        let pushList = await Push
                        .find({groupID:groupID,isDrafts:false})
                        .sort({ _id:-1,pushdateAt:1})
                        .populate({ path: 'userID', select: 'username name userInfoPhoto' })
                        .populate({ path: 'comment',populate:[{path:'from',select:['name','_id','userInfoPhoto']},{path:'reply.from',select:['name','_id','userInfoPhoto']},{path:'reply.to',select:['name','_id','userInfoPhoto']}]})  
                        .slice('comment', 3)         
                        .skip((page - 1) * size)
                        .limit(size) 
        console.log('前台传来的数据为：',reqParam)

        if(pushList){
            ctx.response.body = { code: 200, hasMore: hasMore, pushList: pushList, total: total }                        
        }
        else{
            ctx.response.body = { code:400}
        }
        // console.log(pushList)
        
    } 
}