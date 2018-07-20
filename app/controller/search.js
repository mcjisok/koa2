const Push = require('../models/push')
const Group = require('../models/group')
const SubTag = require('../models/subtag')
const User = require('../models/user')

module.exports = {
    // 查询热门标签或分组 前十个
    getHotSearchList:async(ctx,next)=>{
        
        let searchType = ctx.query.searchType
        console.log(searchType)
        // let hotSearchList = [];
        if(searchType === '0'){
            // type为0，则获取前十个标签
            let hotSearchList = await SubTag.find({}).limit(10).exec()
            console.log(hotSearchList)
            ctx.response.body = {
                code:200,
                hotSearchList,
                msg:'获取热门标签列表成功'
            }
        }
        else if(searchType === '1'){
            // type为1时，获取前十个分组的列表
            let hotSearchList = await Group.find({}).limit(10).exec()
            ctx.response.body = {
                code:200,
                hotSearchList,
                msg:'获取热门分组列表成功'
            }
        }
        else{
            ctx.status = 200
        }
        // console.log(hotSearchList)
        
    },

    getSearchResult:async(ctx,next)=>{
        // console.log('前台传来的数据为？？',ctx.query)
        let data = ctx.query
        console.log(data)
        if(data.searchType === '0'){
            let tag = await SubTag.find({tagName:data.searchContent}).exec()
            let tagID = tag[0]._id
            let pushlist = await Push.find({tagID:tagID})
                            .sort({ _id:-1,pushdateAt:1})
                            .populate({ path: 'userID', select: 'username name userInfoPhoto' })
                            .populate({ path: 'comment',populate:[{path:'from',select:['name','_id','userInfoPhoto']},{path:'reply.from',select:['name','_id','userInfoPhoto']},{path:'reply.to',select:['name','_id','userInfoPhoto']}]})  
                            .populate({path:'tagID',select:['tagName'],populate:{path:'pTag',select:['tagName']}})
                            .exec()
            console.log('pushlist的长度为？？、',pushlist.length)
            if(pushlist.length > 0){
                ctx.body = {
                    code:200,
                    pushlist:pushlist,
                    msg:'搜索成功'
                }
            }
            else{
                ctx.body = {
                    code:400,
                    msg:'搜索成功，结果为空'
                }
            }

            
            console.log(pushlist)
        }
        else if(data.searchType === '1'){
            let group = await Group.find({groupName:data.searchContent})
                        .populate({path:'groupPushList'})
                        .exec()
            console.log(group[0].groupPushList)
            ctx.body = {
                code:200,
                grouplist:group
            }
        }
    }
}